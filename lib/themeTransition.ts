// One store coordinates the desktop and mobile controls, including rapid clicks.
const TRANSITION_MS = 350
const subscribers = new Set<() => void>()
let observer: MutationObserver | undefined
let reducedMotion: MediaQueryList | undefined
let printMedia: MediaQueryList | undefined
let cleanupTimer: ReturnType<typeof setTimeout> | undefined

export function getThemeSnapshot() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("dark")
}

export function getServerThemeSnapshot() {
  return false
}

function notify() {
  subscribers.forEach((callback) => callback())
}

function resetTransition() {
  if (cleanupTimer !== undefined) clearTimeout(cleanupTimer)
  cleanupTimer = undefined
  document.documentElement.removeAttribute("data-theme-transition")
}

function onVisibilityChange() {
  if (document.visibilityState !== "visible") resetTransition()
}

export function subscribeTheme(callback: () => void) {
  // Separate entries also support two subscriptions with the same callback.
  const subscription = () => callback()
  subscribers.add(subscription)

  if (subscribers.size === 1) {
    observer = new MutationObserver(notify)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    printMedia = window.matchMedia("print")
    reducedMotion.addEventListener("change", resetTransition)
    printMedia.addEventListener("change", resetTransition)
    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("beforeprint", resetTransition)
  }

  return () => {
    subscribers.delete(subscription)
    if (subscribers.size !== 0) return
    resetTransition()
    observer?.disconnect()
    observer = undefined
    reducedMotion?.removeEventListener("change", resetTransition)
    printMedia?.removeEventListener("change", resetTransition)
    reducedMotion = undefined
    printMedia = undefined
    document.removeEventListener("visibilitychange", onVisibilityChange)
    window.removeEventListener("beforeprint", resetTransition)
  }
}

export function toggleTheme() {
  const root = document.documentElement
  const next = !getThemeSnapshot()
  const animate = subscribers.size > 0 && "CSSPropertyRule" in window
    && !reducedMotion?.matches && !printMedia?.matches
    && document.visibilityState === "visible"

  if (cleanupTimer !== undefined) clearTimeout(cleanupTimer)
  cleanupTimer = undefined

  if (animate) {
    root.setAttribute("data-theme-transition", "")
    // Commit the transition rule/current interpolated color before changing its target.
    window.getComputedStyle(root).getPropertyValue("--canvas")
  } else {
    resetTransition()
  }

  root.classList.toggle("dark", next)
  root.style.colorScheme = next ? "dark" : "light"
  try {
    localStorage.setItem("theme", next ? "dark" : "light")
  } catch {
    // Theme switching still works if storage is blocked or unavailable.
  }
  notify()

  // A small buffer avoids cancelling the final CSS frame; no frame loop is needed.
  if (animate) cleanupTimer = setTimeout(resetTransition, TRANSITION_MS + 50)
}
