import { ArrowUpRight } from "lucide-react"
import BrowserFrame from "./BrowserFrame"
import PointerParallax from "./PointerParallax"
import type { Project } from "@/data/projects"
import { ui } from "@/data/ui"

const focusLink = "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-paper"

export default function CompactProjectCard({ project }: { project: Project }) {
  const title = project.shortName ?? project.title
  const href = project.demoUrl ?? project.githubUrl
  const action = project.demoUrl ? ui.actions.demo : ui.actions.code
  const host = project.demoUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "")
  const screenshots = project.image || project.dashboardImage ? (
    <PointerParallax className="surface-grid relative min-w-0 border border-line bg-canvas p-3 sm:p-6 lg:p-8">
      {project.image && (
        <div data-parallax-depth="6">
          <BrowserFrame
            src={project.image}
            alt={project.imageCaption ?? `${ui.project.landingCaption}: ${title}`}
            url={host}
            sizes="(min-width: 1280px) 540px, (min-width: 1024px) 45vw, calc(100vw - 4rem)"
          />
        </div>
      )}
      {project.dashboardImage && (
        <div data-parallax-depth="12" className="mt-4 w-[78%] sm:w-[60%] lg:absolute lg:-bottom-8 lg:-left-10 lg:mt-0 lg:w-[56%]">
          <BrowserFrame
            src={project.dashboardImage}
            alt={project.dashboardImageCaption ?? `${ui.project.dashboardCaption}: ${title}`}
            url={host}
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, 65vw"
          />
        </div>
      )}
    </PointerParallax>
  ) : (
    <div className="flex aspect-video items-center justify-center border border-line text-sm text-muted">{ui.project.screenshotMissing}</div>
  )

  return (
    <article className="reveal border-b border-line bg-paper text-ink" data-reveal>
      <div className="grid gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <h3 className="font-display text-[clamp(1.75rem,2.5vw,2.25rem)] leading-[1.2]">
              {href ? <a href={href} target="_blank" rel="noopener noreferrer" className={`${focusLink} transition-colors hover:text-accent`}>{title}</a> : title}
            </h3>
            {project.status && <p className="text-sm text-muted">{ui.project.status[project.status]}</p>}
          </div>
          <p className="mt-4 max-w-lg text-base leading-8 text-muted">{project.cardDescription ?? project.description}</p>
          <ul aria-label={ui.project.stack} className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
            {project.techStack.slice(0, 4).map((tech) => <li key={tech}>{tech}</li>)}
          </ul>
          {(project.role || project.team) && <p className="mt-4 text-sm leading-7 text-ink">{[project.role, project.team].filter(Boolean).join(" · ")}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-paper">
                {ui.actions.demo}<ArrowUpRight size={15} aria-hidden />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-paper">
                {project.githubLabel ?? (project.collaboration ? ui.actions.teamRepo : ui.actions.code)}<ArrowUpRight size={15} aria-hidden />
              </a>
            )}
          </div>
        </div>
        <div className="order-first min-w-0 lg:order-last">
          {href ? <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${action}: ${title}`} className={`block ${focusLink}`}>{screenshots}</a> : screenshots}
        </div>
      </div>
    </article>
  )
}
