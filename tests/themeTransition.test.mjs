import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import vm from "node:vm"
import ts from "typescript"

const source = fs.readFileSync(new URL("../lib/themeTransition.ts", import.meta.url), "utf8")
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText

class Surface {
  listeners = new Map()
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set())
    this.listeners.get(type).add(callback)
  }
  removeEventListener(type, callback) { this.listeners.get(type)?.delete(callback) }
  emit(type) { this.listeners.get(type)?.forEach(callback => callback()) }
  get count() { return [...this.listeners.values()].reduce((sum, callbacks) => sum + callbacks.size, 0) }
}

function fixture({ dark = false, supported = true, reduced = false, printing = false, blockedStorage = false, hidden = false } = {}) {
  const window = new Surface()
  const document = new Surface()
  const motion = new Surface()
  const print = new Surface()
  const attributes = new Map()
  const classes = new Set(dark ? ["dark"] : [])
  const timers = new Map()
  const saved = new Map()
  let now = 0
  let timerId = 0
  let styleReads = 0
  const observers = []
  document.visibilityState = hidden ? "hidden" : "visible"
  document.documentElement = {
    classList: {
      contains: name => classes.has(name),
      toggle: (name, value) => { if (value) classes.add(name); else classes.delete(name) },
    },
    style: {},
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: name => attributes.delete(name),
  }
  motion.matches = reduced
  print.matches = printing
  window.matchMedia = query => query === "print" ? print : motion
  if (supported) window.CSSPropertyRule = class {}
  window.getComputedStyle = () => ({ getPropertyValue: () => { styleReads++; return "#f5f3ee" } })
  const exports = {}
  vm.runInNewContext(compiled, {
    exports, window, document,
    MutationObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this) }
      observe(root, options) { this.root = root; this.options = options; this.connected = true }
      disconnect() { this.connected = false }
    },
    localStorage: { setItem: (key, value) => { if (blockedStorage) throw new Error("blocked"); saved.set(key, value) } },
    setTimeout: (callback, ms) => { timers.set(++timerId, { callback, due: now + ms }); return timerId },
    clearTimeout: id => timers.delete(id),
  })
  return {
    api: exports, document, window, motion, print, timers, saved,
    get observer() { return observers.at(-1) },
    get styleReads() { return styleReads },
    get active() { return attributes.has("data-theme-transition") },
    advance(ms) {
      now += ms
      for (const [id, timer] of [...timers]) if (timer.due <= now) { timers.delete(id); timer.callback() }
    },
  }
}

test("initial saved theme is read without motion, storage writes, or timers", () => {
  const f = fixture({ dark: true })
  assert.equal(f.api.getServerThemeSnapshot(), false)
  const dispose = f.api.subscribeTheme(() => {})
  assert.equal(f.api.getThemeSnapshot(), true)
  assert.equal(f.active, false)
  assert.equal(f.timers.size, 0)
  assert.equal(f.saved.size, 0)
  assert.equal(f.styleReads, 0)
  dispose()
})

test("manual changes apply both directions, storage and colorScheme immediately", () => {
  const f = fixture()
  const snapshots = []
  const dispose = f.api.subscribeTheme(() => snapshots.push(f.api.getThemeSnapshot()))
  f.api.toggleTheme()
  assert.equal(f.active, true)
  assert.equal(f.api.getThemeSnapshot(), true)
  assert.equal(f.document.documentElement.style.colorScheme, "dark")
  assert.equal(f.saved.get("theme"), "dark")
  f.advance(399)
  assert.equal(f.active, true)
  f.advance(1)
  assert.equal(f.active, false)
  f.api.toggleTheme()
  assert.equal(f.document.documentElement.style.colorScheme, "light")
  assert.equal(f.saved.get("theme"), "light")
  assert.deepEqual(snapshots, [true, false])
  f.advance(400)
  assert.equal(f.timers.size, 0)
  dispose()
})

test("rapid reversals use the current root theme and just one latest cleanup timer", () => {
  const f = fixture()
  const dispose = f.api.subscribeTheme(() => {})
  for (let i = 0; i < 7; i++) { f.api.toggleTheme(); assert.equal(f.timers.size, 1); f.advance(30) }
  assert.equal(f.api.getThemeSnapshot(), true)
  f.advance(369)
  assert.equal(f.active, true)
  f.advance(1)
  assert.equal(f.active, false)
  dispose()
})

test("desktop/mobile share one observer; removing one does not interrupt the other", () => {
  const f = fixture()
  const desktop = []
  const mobile = []
  const disposeDesktop = f.api.subscribeTheme(() => desktop.push(f.api.getThemeSnapshot()))
  const firstObserver = f.observer
  const disposeMobile = f.api.subscribeTheme(() => mobile.push(f.api.getThemeSnapshot()))
  assert.equal(f.observer, firstObserver)
  f.api.toggleTheme()
  assert.deepEqual(desktop, [true])
  assert.deepEqual(mobile, [true])
  disposeDesktop()
  assert.equal(f.active, true)
  assert.equal(firstObserver.connected, true)
  f.api.toggleTheme()
  assert.deepEqual(mobile, [true, false])
  disposeMobile()
  assert.equal(firstObserver.connected, false)
  assert.equal(f.active, false)
  assert.equal(f.timers.size, 0)
  assert.equal(f.window.count + f.document.count + f.motion.count + f.print.count, 0)
})

test("duplicate callbacks remain independently subscribed and remount is safe", () => {
  const f = fixture()
  const callback = () => {}
  const first = f.api.subscribeTheme(callback)
  const second = f.api.subscribeTheme(callback)
  first()
  f.api.toggleTheme()
  assert.equal(f.active, true)
  second()
  const third = f.api.subscribeTheme(callback)
  assert.equal(f.active, false)
  f.api.toggleTheme()
  assert.equal(f.active, true)
  third()
})

test("reduced motion, print, hidden tabs and unsupported browsers switch directly", () => {
  for (const options of [{ reduced: true }, { printing: true }, { hidden: true }, { supported: false }]) {
    const f = fixture(options)
    const dispose = f.api.subscribeTheme(() => {})
    f.api.toggleTheme()
    assert.equal(f.api.getThemeSnapshot(), true)
    assert.equal(f.active, false)
    assert.equal(f.timers.size, 0)
    assert.equal(f.styleReads, 0)
    dispose()
  }
})

test("visibility/preferences/print cancel active motion without changing the chosen theme", () => {
  for (const event of ["visibility", "motion", "print", "beforeprint"]) {
    const f = fixture()
    const dispose = f.api.subscribeTheme(() => {})
    f.api.toggleTheme()
    if (event === "visibility") { f.document.visibilityState = "hidden"; f.document.emit("visibilitychange") }
    if (event === "motion") { f.motion.matches = true; f.motion.emit("change") }
    if (event === "print") { f.print.matches = true; f.print.emit("change") }
    if (event === "beforeprint") f.window.emit("beforeprint")
    assert.equal(f.active, false)
    assert.equal(f.timers.size, 0)
    assert.equal(f.api.getThemeSnapshot(), true)
    dispose()
  }
})

test("blocked localStorage does not break controls or cleanup", () => {
  const f = fixture({ blockedStorage: true })
  const dispose = f.api.subscribeTheme(() => {})
  assert.doesNotThrow(() => f.api.toggleTheme())
  assert.equal(f.api.getThemeSnapshot(), true)
  f.advance(400)
  assert.equal(f.active, false)
  dispose()
})

test("external root changes update subscribers without starting an animation", () => {
  const f = fixture()
  let notifications = 0
  const dispose = f.api.subscribeTheme(() => notifications++)
  f.document.documentElement.classList.toggle("dark", true)
  f.observer.callback()
  assert.equal(f.api.getThemeSnapshot(), true)
  assert.equal(notifications, 1)
  assert.equal(f.active, false)
  dispose()
})

test("CSS registers every light token and limits color transitions to the root", () => {
  const css = fs.readFileSync(new URL("../app/globals.css", import.meta.url), "utf8")
  const light = css.match(/:root \{([\s\S]*?)\n\}/)[1]
  const tokens = [...light.matchAll(/(--[\w-]+): (#[\da-f]+);/g)]
  for (const [, name, color] of tokens) {
    assert.ok(css.includes(`@property ${name} {\n  syntax: "<color>";\n  inherits: true;\n  initial-value: ${color};`))
  }
  const rootTransition = css.match(/html\[data-theme-transition\] \{([\s\S]*?)\n\}/)[1]
  assert.match(rootTransition, /transition-duration: 350ms/)
  assert.match(rootTransition, /transition-timing-function: ease-in-out/)
  assert.doesNotMatch(rootTransition, /transform|opacity|translate|all;/)
  assert.doesNotMatch(css, /\[data-theme-transition\]\s+\*/)
})
