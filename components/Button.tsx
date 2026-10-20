import type { AnchorHTMLAttributes, ReactNode } from "react"

type Variant = "primary" | "secondary"

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: Variant
  children: ReactNode
}

const baseStyles =
  "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 motion-reduce:transform-none hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"

const variants: Record<Variant, string> = {
  primary:
    "bg-solid text-on-solid shadow-lg shadow-solid/15 hover:bg-accent-strong hover:text-on-accent",
  secondary:
    "border border-line bg-paper/60 text-ink hover:border-ink hover:bg-paper",
}

export default function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <a
      href={href}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
}
