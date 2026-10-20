"use client"

import { useEffect, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import Link from "next/link"
import { ArrowUpRight, Menu, X } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { personal } from "@/data/personal"
import { ui } from "@/data/ui"

const navLinks = ui.navigation

const sectionIds = navLinks.map((link) => link.href.split("#")[1])

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState("")
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let frame = 0

    function update() {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? Math.min(Math.max(doc.scrollTop / max, 0), 1) : 0)

      const marker = window.innerHeight * 0.35
      let current = ""
      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (!element) continue
        const rect = element.getBoundingClientRect()
        if (rect.top <= marker && rect.bottom > marker) current = `/#${id}`
      }
      setActive(current)
    }

    function onScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  function closeMenu() {
    setOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && open) {
      closeMenu()
      menuButtonRef.current?.focus()
    }
  }

  return (
    <nav
      aria-label="Main navigation"
      onKeyDown={handleKeyDown}
      className="fixed inset-x-0 top-0 z-50 px-2 sm:px-4"
    >
      <div className="relative mx-auto flex h-15 max-w-[1200px] items-center justify-between border-x border-b border-line bg-canvas/88 px-4 shadow-sm shadow-ink/[0.03] backdrop-blur-xl sm:h-16 sm:px-6">
        <Link
          href="/"
          aria-label="Back to top"
          className="rounded-sm text-xl font-bold tracking-[-0.03em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas sm:text-2xl"
        >
          {personal.shortName}
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <ul className="flex items-center gap-6 text-sm font-medium text-muted">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active === link.href ? "true" : undefined}
                  className={`nav-link rounded-sm transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas ${
                    active === link.href ? "text-ink" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-solid px-5 py-2.5 text-sm font-semibold text-on-solid transition-all hover:-translate-y-0.5 hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas motion-reduce:transform-none"
            >
              {ui.actions.contact}
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            className="rounded-full border border-line bg-paper p-2.5 text-ink transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? ui.actions.closeMenu : ui.actions.openMenu}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-accent"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="mx-auto max-w-[1200px] border-x border-b border-line bg-canvas/98 px-5 py-5 shadow-xl shadow-ink/10 backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col text-base font-semibold text-muted">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active === link.href ? "true" : undefined}
                  className={`flex items-center gap-3 border-b border-line py-4 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas ${
                    active === link.href ? "text-ink" : ""
                  }`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#contact"
                className="mt-5 flex min-h-12 items-center justify-center rounded-full bg-solid px-5 text-sm font-semibold text-on-solid"
                onClick={closeMenu}
              >
                {ui.actions.contact}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
