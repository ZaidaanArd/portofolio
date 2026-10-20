"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("[data-reveal]"))

    if (elements.length === 0) {
      return
    }

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"))
      return
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [pathname])

  return null
}
