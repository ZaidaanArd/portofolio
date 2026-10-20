import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import BrowserFrame from "./BrowserFrame"
import PointerParallax from "./PointerParallax"
import CompactProjectCard from "./CompactProjectCard"
import type { Project } from "@/data/projects"
import { ui } from "@/data/ui"

const caseStudyLink = "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-solid focus-visible:ring-offset-4 focus-visible:ring-offset-solid"

export default function ProjectCard({ project }: { project: Project }) {
  if (project.hasCaseStudy === false) return <CompactProjectCard project={project} />

  const href = `/projects/${project.id}`
  const host = project.demoUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "")

  return (
    <article className="reveal border-b border-line bg-solid text-on-solid" data-reveal>
      <div className="grid gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <h3 className="display-project font-display">
            <Link href={href} className={`${caseStudyLink} transition-colors hover:text-on-solid/80`}>{project.shortName ?? project.title}</Link>
          </h3>
          {project.status && <p className="mt-2 text-sm text-on-solid/75">{ui.project.status[project.status]}</p>}
          <p className="mt-5 max-w-lg text-base leading-8 text-on-solid/80">{project.cardDescription ?? project.description}</p>
          <ul aria-label={ui.project.stack} className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-on-solid/75">
            {project.techStack.slice(0, 4).map((tech) => <li key={tech}>{tech}</li>)}
          </ul>
          {project.role && (
            <dl className="mt-6 text-sm leading-7">
              <dt className="font-semibold text-on-solid/90">{ui.project.contribution}</dt>
              <dd className="mt-1 text-on-solid/75">{project.role}</dd>
            </dl>
          )}
          {project.recognition && (
            <p className="mt-4 text-sm font-medium leading-7 text-on-solid/90">{project.recognition.title} · {project.recognition.event.split(" — ")[0]}</p>
          )}
          <Link href={href} className="group mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-on-solid px-6 py-3 text-sm font-semibold text-solid transition-all hover:-translate-y-0.5 hover:bg-accent-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-solid focus-visible:ring-offset-4 focus-visible:ring-offset-solid motion-reduce:transform-none">
            {ui.actions.caseStudy}<ArrowUpRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <PointerParallax className="surface-grid relative order-first min-w-0 border border-on-solid/15 bg-on-solid/[0.04] p-3 sm:p-6 lg:order-last lg:p-8">
          {project.image ? (
            <div data-parallax-depth="6">
              <Link href={href} aria-label={`${ui.actions.caseStudy}: ${project.shortName ?? project.title}`} className={`block ${caseStudyLink}`}>
                <BrowserFrame src={project.image} alt={`Landing page of ${project.shortName ?? project.title}`} url={host} priority sizes="(min-width: 1280px) 520px, (min-width: 1024px) 48vw, calc(100vw - 5rem)" />
              </Link>
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center border border-on-solid/20 p-6 text-sm text-on-solid/75">{ui.project.screenshotMissing}</div>
          )}
          {project.dashboardImage && (
            <div data-parallax-depth="12" className="mt-4 w-[78%] sm:w-[60%] lg:absolute lg:-bottom-8 lg:-left-10 lg:mt-0 lg:w-[56%]">
              <Link href={href} aria-label={`${ui.actions.caseStudy}: ${project.dashboardImageCaption ?? ui.project.dashboardCaption}`} className={`block ${caseStudyLink}`}>
                <BrowserFrame src={project.dashboardImage} alt={`Dashboard of ${project.shortName ?? project.title}`} sizes="(min-width: 1024px) 330px, (min-width: 640px) 50vw, 65vw" />
              </Link>
            </div>
          )}
        </PointerParallax>
      </div>
    </article>
  )
}
