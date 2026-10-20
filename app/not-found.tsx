import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ui } from "@/data/ui"

const buttonBase = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"

export default function NotFound() {
  return (
    <section className="page-frame mx-auto flex min-h-[75vh] max-w-[1200px] flex-col justify-center px-5 py-24 sm:px-8 sm:py-32">
      <h1 className="display-section font-display text-ink">{ui.notFound.title}</h1>
      <p className="mt-5 max-w-xl text-base leading-8 text-muted">{ui.notFound.description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={`${buttonBase} bg-solid text-on-solid hover:bg-accent-strong`}><ArrowLeft size={15} aria-hidden />{ui.actions.backHome}</Link>
        <Link href="/#projects" className={`${buttonBase} border border-line text-ink hover:border-ink hover:bg-paper`}>{ui.actions.work}</Link>
      </div>
    </section>
  )
}
