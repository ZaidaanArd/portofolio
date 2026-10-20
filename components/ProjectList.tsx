import { projects } from "@/data/projects"
import { ui } from "@/data/ui"
import ProjectCard from "./ProjectCard"
import SectionHeading from "./SectionHeading"

export default function ProjectList() {
  return (
    <section id="projects" className="page-frame mx-auto max-w-[1200px] pt-14 sm:pt-20">
      <div className="px-5 pb-8 sm:px-8 sm:pb-10">
        <SectionHeading title={ui.sections.projects} />
      </div>
      {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
    </section>
  )
}
