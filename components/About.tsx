import SectionHeading from "./SectionHeading"
import { personal } from "@/data/personal"
import { ui } from "@/data/ui"

export default function About() {
  return (
    <section id="about" className="page-frame mx-auto max-w-[1200px] border-y border-line bg-paper px-5 py-10 sm:px-8 sm:py-14">
      <div className="grid gap-5 sm:grid-cols-[12rem_1fr] sm:gap-10">
        <SectionHeading title={ui.sections.about} />
        <p className="reveal max-w-2xl text-base leading-8 text-muted" data-reveal>{personal.about}</p>
      </div>
    </section>
  )
}
