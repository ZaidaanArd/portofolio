import { skillCategories } from "@/data/skills"
import { ui } from "@/data/ui"
import SectionHeading from "./SectionHeading"

export default function Skills() {
  return (
    <section id="skills" className="page-frame mx-auto max-w-[1200px] border-b border-line px-5 py-14 sm:px-8 sm:py-20">
      <SectionHeading title={ui.sections.skills} />
      <div className="reveal mt-7 sm:mt-9" data-reveal>
        {skillCategories.map((category) => (
          <div key={category.name} className="grid gap-3 border-b border-line py-5 last:border-b-0 sm:grid-cols-[12rem_1fr] sm:gap-10">
            <h3 className="text-base font-semibold text-ink">{category.name}</h3>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-base leading-7 text-muted">
              {category.skills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
