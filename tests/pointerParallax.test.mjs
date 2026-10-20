import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import vm from "node:vm"
import ts from "typescript"

const source = fs.readFileSync(new URL("../lib/pointerParallax.ts", import.meta.url), "utf8")
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText

class Surface {
  listeners = new Map()
  addEventListener(type, handler) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set())
    this.listeners.get(type).add(handler)
  }
  removeEventListener(type, handler) { this.listeners.get(type)?.delete(handler) }
  emit(type, event = {}) {
    for (const handler of this.listeners.get(type) ?? []) handler(event)
  }
  get listenerCount() { return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0) }
}

function style() {
  const values = new Map()
  return {
    setProperty: (key, value) => values.set(key, value),
    removeProperty: (key) => values.delete(key),
    getPropertyValue: (key) => values.get(key) ?? "",
  }
}

function fixture(eligible = true) {
  const root = new Surface()
  const window = new Surface()
  const document = new Surface()
  const motion = new Surface()
  const print = new Surface()
  const frames = new Map()
  const attributes = new Map()
  const layers = [2, 4, 7, 6, 12].map(depth => ({ dataset: { parallaxDepth: String(depth) }, style: style() }))
  let time = 0
  let frameId = 0
  motion.matches = eligible
  print.matches = false
  document.visibilityState = "visible"
  document.activeElement = null
  root.style = style()
  root.querySelectorAll = () => layers
  root.contains = node => node === root || layers.includes(node)
  root.getBoundingClientRect = () => ({ left: 100, top: 50, width: 400, height: 200 })
  root.setAttribute = (key, value) => attributes.set(key, value)
  root.removeAttribute = key => attributes.delete(key)
  window.matchMedia = query => query === "print" ? print : motion
  const exports = {}
  vm.runInNewContext(compiled, {
    exports, window, document,
    performance: { now: () => time },
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId },
    cancelAnimationFrame: id => frames.delete(id),
  })
  const dispose = exports.attachPointerParallax(root)
  const position = () => ["x", "y"].map(axis => Number(root.style.getPropertyValue(`--parallax-${axis}`)))
  function advance(ms = 16) {
    time += ms
    const pending = [...frames.values()]
    frames.clear()
    pending.forEach(callback => callback(time))
  }
  function settle() {
    for (let count = 0; frames.size && count < 200; count++) advance()
    assert.equal(frames.size, 0, "animation must stop rather than loop when idle")
  }
  function move(x = 500, y = 250, pointerType = "mouse") {
    root.emit("pointermove", { clientX: x, clientY: y, pointerType })
  }
  function neutral() { assert.deepEqual(position(), [0, 0]); assert.equal(frames.size, 0) }
  return { root, window, document, motion, print, layers, frames, attributes, dispose, position, advance, settle, move, neutral }
}

test("center stays still; corners clamp to the declared layer amplitudes", () => {
  const f = fixture()
  f.move(300, 150)
  f.neutral()
  f.move(9999, 9999)
  f.settle()
  assert.deepEqual(f.position(), [1, 1])
  assert.deepEqual(f.layers.map(layer => layer.style.getPropertyValue("--parallax-depth")), ["2px", "4px", "7px", "6px", "12px"])
  assert(!f.attributes.has("data-parallax-active"))
  f.move(-9999, -9999)
  f.settle()
  assert.deepEqual(f.position(), [-1, -1])
  f.dispose()
})

test("90ms time-based smoothing is independent of refresh rate", () => {
  const fast = fixture(), slow = fixture()
  fast.move(); slow.move()
  fast.advance(16)
  assert(Math.abs(fast.position()[0] - (1 - Math.exp(-16 / 90))) < 1e-10)
  for (let i = 0; i < 48; i++) fast.advance(8)
  for (let i = 0; i < 25; i++) slow.advance(16)
  assert(Math.abs(fast.position()[0] - slow.position()[0]) < 1e-10)
  fast.dispose(); slow.dispose()
})

test("rapid motion uses one pending frame, never overshoots, and stops at rest", () => {
  const f = fixture()
  for (let i = 0; i < 100; i++) f.move(i % 2 ? 100 : 500, i % 2 ? 50 : 250)
  assert.equal(f.frames.size, 1)
  f.settle()
  assert.deepEqual(f.position(), [-1, -1])
  f.move(100, 50)
  assert.equal(f.frames.size, 0)
  f.dispose()
})

test("pointer leave and scroll ease back to center", () => {
  const f = fixture()
  for (const [surface, event] of [[f.root, "pointerleave"], [f.window, "scroll"]]) {
    f.move(); f.settle()
    surface.emit(event)
    assert.equal(f.frames.size, 1)
    f.settle(); f.neutral()
  }
  f.dispose()
})

test("touch, pen, pointer cancellation, and ineligible media remain static", () => {
  const f = fixture()
  for (const pointerType of ["touch", "pen"]) {
    f.move(); f.advance()
    f.move(500, 250, pointerType)
    f.neutral()
  }
  f.move(); f.root.emit("pointercancel"); f.neutral()
  f.motion.matches = false
  f.motion.emit("change")
  f.move(); f.neutral()
  f.motion.matches = true
  f.motion.emit("change")
  f.move(); f.settle()
  assert.deepEqual(f.position(), [1, 1])
  f.dispose()
})

test("focus keeps links stable until focus exits the region", () => {
  const f = fixture()
  f.move(); f.advance()
  f.document.activeElement = f.layers[0]
  f.root.emit("focusin")
  f.neutral()
  f.move(); f.neutral()
  f.document.activeElement = null
  f.move(); f.settle()
  assert.deepEqual(f.position(), [1, 1])
  f.dispose()
})

test("blur, visibility, resize, and print cancel pending motion and reset", () => {
  const f = fixture()
  f.move(); f.window.emit("blur"); f.neutral()
  f.move(); f.neutral()
  f.window.emit("focus")
  f.move(); f.document.visibilityState = "hidden"
  f.document.emit("visibilitychange"); f.neutral()
  f.move(); f.neutral()
  f.document.visibilityState = "visible"
  f.document.emit("visibilitychange")
  f.move(); f.window.emit("resize"); f.neutral()
  f.move(); f.print.matches = true
  f.print.emit("change"); f.neutral()
  f.move(); f.neutral()
  f.print.matches = false
  f.print.emit("change")
  f.move(); f.window.emit("beforeprint"); f.neutral()
  f.dispose()
})

test("zero-sized regions are safe; unmount removes all listeners, styles and frames", () => {
  const f = fixture()
  f.move()
  f.root.getBoundingClientRect = () => ({ left: 0, top: 0, width: 0, height: 0 })
  f.move(); f.neutral()
  f.dispose()
  for (const surface of [f.root, f.window, f.document, f.motion, f.print]) assert.equal(surface.listenerCount, 0)
  for (const key of ["--parallax-x", "--parallax-y"]) assert.equal(f.root.style.getPropertyValue(key), "")
  assert(f.layers.every(layer => layer.style.getPropertyValue("--parallax-depth") === ""))
  assert.equal(f.frames.size, 0)
  assert(!f.attributes.has("data-parallax-active"))
})
