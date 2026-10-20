"use client"

import { useEffect, useRef } from "react"
import type { ReactNode } from "react"
import { attachPointerParallax } from "@/lib/pointerParallax"

interface PointerParallaxProps {
  children: ReactNode
  className?: string
  as?: "div" | "section"
}

export default function PointerParallax({ children, className, as: Tag = "div" }: PointerParallaxProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (root) return attachPointerParallax(root)
  }, [Tag])

  return <Tag ref={rootRef} className={className} data-pointer-parallax>{children}</Tag>
}
