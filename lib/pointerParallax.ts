const ELIGIBLE_POINTER = "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
const RESPONSE_MS = 90
const SETTLED_DISTANCE = 0.0005

/** Attach a finite, pointer-driven animation to server-rendered layers. */
export function attachPointerParallax(root: HTMLElement): () => void {
  const motion = window.matchMedia(ELIGIBLE_POINTER)
  const print = window.matchMedia("print")
  const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax-depth]"))
  let frame = 0
  let previousTime = 0
  let windowActive = true
  const current = { x: 0, y: 0 }
  const target = { x: 0, y: 0 }

  for (const layer of layers) {
    const depth = Number(layer.dataset.parallaxDepth)
    layer.style.setProperty("--parallax-depth", `${Number.isFinite(depth) ? Math.max(0, depth) : 0}px`)
  }

  function writePosition() {
    root.style.setProperty("--parallax-x", String(current.x))
    root.style.setProperty("--parallax-y", String(current.y))
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    root.removeAttribute("data-parallax-active")
  }

  function resetImmediately() {
    stop()
    current.x = target.x = 0
    current.y = target.y = 0
    writePosition()
  }

  function canAnimate() {
    return motion.matches && !print.matches && windowActive &&
      document.visibilityState === "visible" && !root.contains(document.activeElement)
  }

  function tick(time: number) {
    frame = 0
    if (!canAnimate()) {
      resetImmediately()
      return
    }

    const elapsed = Math.min(Math.max(time - previousTime, 0), 64)
    previousTime = time
    const weight = 1 - Math.exp(-elapsed / RESPONSE_MS)
    current.x += (target.x - current.x) * weight
    current.y += (target.y - current.y) * weight

    if (Math.max(Math.abs(target.x - current.x), Math.abs(target.y - current.y)) <= SETTLED_DISTANCE) {
      current.x = target.x
      current.y = target.y
      writePosition()
      stop()
      return
    }

    writePosition()
    frame = requestAnimationFrame(tick)
  }

  function animate() {
    if (frame || (current.x === target.x && current.y === target.y)) return
    previousTime = performance.now()
    root.setAttribute("data-parallax-active", "")
    frame = requestAnimationFrame(tick)
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerType !== "mouse" || !canAnimate()) {
      resetImmediately()
      return
    }

    const bounds = root.getBoundingClientRect()
    if (!bounds.width || !bounds.height) {
      resetImmediately()
      return
    }

    const clamp = (value: number) => Math.min(1, Math.max(-1, value))
    target.x = clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1)
    target.y = clamp(((event.clientY - bounds.top) / bounds.height) * 2 - 1)
    animate()
  }

  function returnToCenter() {
    target.x = target.y = 0
    if (canAnimate()) animate()
    else resetImmediately()
  }

  function onBlur() {
    windowActive = false
    resetImmediately()
  }

  function onFocus() {
    windowActive = true
    resetImmediately()
  }

  root.addEventListener("pointermove", onPointerMove, { passive: true })
  root.addEventListener("pointerleave", returnToCenter)
  root.addEventListener("pointercancel", resetImmediately)
  root.addEventListener("focusin", resetImmediately)
  window.addEventListener("scroll", returnToCenter, { passive: true, capture: true })
  window.addEventListener("resize", resetImmediately, { passive: true })
  window.addEventListener("blur", onBlur)
  window.addEventListener("focus", onFocus)
  window.addEventListener("beforeprint", resetImmediately)
  document.addEventListener("visibilitychange", resetImmediately)
  motion.addEventListener("change", resetImmediately)
  print.addEventListener("change", resetImmediately)

  return () => {
    stop()
    root.removeEventListener("pointermove", onPointerMove)
    root.removeEventListener("pointerleave", returnToCenter)
    root.removeEventListener("pointercancel", resetImmediately)
    root.removeEventListener("focusin", resetImmediately)
    window.removeEventListener("scroll", returnToCenter, true)
    window.removeEventListener("resize", resetImmediately)
    window.removeEventListener("blur", onBlur)
    window.removeEventListener("focus", onFocus)
    window.removeEventListener("beforeprint", resetImmediately)
    document.removeEventListener("visibilitychange", resetImmediately)
    motion.removeEventListener("change", resetImmediately)
    print.removeEventListener("change", resetImmediately)
    root.style.removeProperty("--parallax-x")
    root.style.removeProperty("--parallax-y")
    layers.forEach((layer) => layer.style.removeProperty("--parallax-depth"))
  }
}
