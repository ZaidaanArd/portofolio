import { ArrowUpRight } from "lucide-react"
import Button from "./Button"
import PointerParallax from "./PointerParallax"
import { personal } from "@/data/personal"
import { ui } from "@/data/ui"

export default function Hero() {
  return (
    <PointerParallax as="section" className="page-frame hero-enter mx-auto max-w-[1200px] px-5 pb-14 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
      <div className="lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:items-center lg:gap-10 xl:gap-16">
        <div className="min-w-0">
          <h1 className="display-hero max-w-4xl font-display text-balance text-ink">
            {personal.greeting}
          </h1>
          <p className="mt-6 text-lg font-semibold text-ink">{personal.role}</p>
          <p className="mt-3 max-w-xl text-base leading-8 text-muted sm:text-lg">{personal.tagline}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="#projects">{ui.actions.work}<ArrowUpRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Button>
            <Button href="#contact" variant="secondary">{ui.actions.contact}</Button>
          </div>
          <p className="mt-6 text-sm text-muted">{personal.availability}</p>
        </div>
        <div aria-hidden="true" className="hero-monogram pointer-events-none relative hidden w-full max-w-[360px] select-none justify-self-end font-display text-ink lg:block">
          <span data-parallax-depth="2" className="absolute left-3 top-5 h-px w-16 bg-accent/30" />
          <div className="flex h-full items-center justify-center leading-none tracking-[-0.08em]">
            <span data-parallax-depth="4" className="block">{personal.initials[0]}</span>
            <span data-parallax-depth="7" className="relative top-[18px] block">{personal.initials[1]}</span>
          </div>
          <span data-parallax-depth="2" className="absolute bottom-5 right-3 h-px w-16 bg-accent/30" />
        </div>
      </div>
    </PointerParallax>
  )
}
