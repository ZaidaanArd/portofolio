"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { getThemeSnapshot, getServerThemeSnapshot, subscribeTheme, toggleTheme } from "@/lib/themeTransition"

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot)

  const label = isDark ? "Switch to light theme" : "Switch to dark theme"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      className={`group flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:bg-ink/5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${className}`}
    >
      {isDark ? (
        <Sun
          size={18}
          className="transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110 motion-reduce:transform-none"
        />
      ) : (
        <Moon
          size={18}
          className="transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110 motion-reduce:transform-none"
        />
      )}
    </button>
  )
}
