import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import BrowserFrame from "@/components/BrowserFrame"
import { getProject, caseStudyProjects } from "@/data/projects"
import { ui } from "@/data/ui"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return caseStudyProjects.map((project) => ({ slug: project.id }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)

  if (!project || project.hasCaseStudy === false) return {}

  return {
    title: project.shortName ?? project.title,
    description: project.description,
    alternates: {
      canonical: `/projects/${project.id}`,
    },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.description,
      url: `/projects/${project.id}`,
      images: [
        {
          url: project.image ?? "/opengraph-image",
          alt: `Preview of ${project.shortName ?? project.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [project.image ?? "/opengraph-image"],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project || project.hasCaseStudy === false) notFound()

  const story = [project.problem, project.approach, project.result, project.learning]
    .map((content, index) => ({ title: ui.project.story[index], content }))
    .filter((item): item is { title: string; content: string } => Boolean(item.content))
  const recognition = project.recognition
  const certificateHref = recognition?.certificateUrl ?? recognition?.certificateImage
  const demoHost = project.demoUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "")
  const spreadColumns = project.dashboardImage && project.image ? "lg:grid-cols-[1.42fr_0.58fr] lg:items-end" : ""

  return (
    <article className="page-frame mx-auto max-w-[1200px] pt-24 sm:pt-28">
      <header className="px-5 pb-10 sm:px-8 sm:pb-12">
        <Link href="/#projects" className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas">
          <ArrowLeft size={14} aria-hidden />{ui.actions.backToWork}
        </Link>
        <h1 className="display-project mt-7 max-w-4xl font-display text-balance text-ink">{project.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted">{project.description}</p>
      </header>

      <section aria-label="Product screenshots" className="project-screen-grid border-y border-line bg-accent-soft p-5 sm:p-8 lg:p-12">
        {project.dashboardImage || project.image ? (
          <div className={`grid gap-8 lg:gap-10 ${spreadColumns}`}>
            {project.dashboardImage && (
              <figure className="relative z-10">
                <BrowserFrame src={project.dashboardImage} alt={`Dashboard of ${project.shortName ?? project.title}`} url={demoHost} priority sizes="(min-width: 1280px) 720px, (min-width: 1024px) 60vw, calc(100vw - 4rem)" />
                <figcaption className="mt-3 text-sm leading-6 text-muted">{project.dashboardImageCaption ?? ui.project.dashboardCaption}</figcaption>
              </figure>
            )}
            {project.image && (
              <figure className={project.dashboardImage ? "lg:pb-8" : ""}>
                <BrowserFrame src={project.image} alt={`Landing page of ${project.shortName ?? project.title}`} url={demoHost} priority={!project.dashboardImage} sizes="(min-width: 1280px) 440px, (min-width: 1024px) 38vw, calc(100vw - 4rem)" />
                <figcaption className="mt-3 text-sm leading-6 text-muted">{project.imageCaption ?? ui.project.landingCaption}</figcaption>
              </figure>
            )}
          </div>
        ) : <p className="py-12 text-center text-muted">{ui.project.screenshotMissing}</p>}
      </section>

      <section aria-label="Project details" className="border-b border-line bg-paper">
        <dl className={`grid ${project.role ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {project.role && (
            <div className="border-b border-line p-5 sm:p-8 md:border-b-0 md:border-r">
              <dt className="label text-ink">{ui.project.contribution}</dt>
              <dd className="mt-3 text-sm leading-7 text-muted">{project.role}</dd>
            </div>
          )}
          <div className="border-b border-line p-5 sm:p-8 md:border-b-0 md:border-r">
            <dt className="label text-ink">{ui.project.context}</dt>
            <dd className="mt-3 text-sm leading-7 text-muted">
              {project.team}
              {project.repoOwner && (
                <span className="mt-2 block">{ui.project.maintainedBy} <a href={project.repoOwner.url} target="_blank" rel="noopener noreferrer" className="rounded-sm font-semibold text-ink underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-paper">{project.repoOwner.name}</a></span>
              )}
            </dd>
          </div>
          <div className="p-5 sm:p-8">
            <dt className="label text-ink">{ui.project.stack}</dt>
            <dd className="mt-3 text-sm leading-7 text-muted">{project.techStack.join(" / ")}</dd>
          </div>
        </dl>
      </section>

      <div>
        {story.map((item, index) => (
          <section key={item.title} aria-labelledby={`story-${item.title.toLowerCase()}`} className={`grid gap-4 border-b border-line px-5 py-8 sm:grid-cols-[12rem_1fr] sm:gap-10 sm:px-8 sm:py-10 ${index % 2 === 1 ? "bg-paper" : "bg-canvas"}`}>
            <h2 id={`story-${item.title.toLowerCase()}`} className="display-section font-display text-ink">{item.title}</h2>
            <p className="max-w-2xl text-base leading-8 text-muted">{item.content}</p>
          </section>
        ))}
      </div>

      {recognition && (
        <section aria-labelledby="project-recognition" className="border-t border-line bg-canvas surface-grid p-5 sm:p-8 lg:p-12">
          <div className="grid gap-8 border border-line bg-paper p-6 sm:p-8 lg:grid-cols-[1fr_20rem] lg:items-center lg:gap-12">
            <div>
              <h2 id="project-recognition" className="display-section font-display text-ink">{recognition.title}</h2>
              <p className="mt-4 text-base font-semibold leading-7 text-ink">{recognition.event}{recognition.year && !recognition.event.includes(recognition.year) ? ` / ${recognition.year}` : ""}</p>
              {recognition.organizer && <p className="mt-3 text-sm leading-7 text-muted">{ui.project.organizedBy} {recognition.organizer}</p>}
              {recognition.note && <p className="mt-4 max-w-xl text-base leading-8 text-muted">{recognition.note}</p>}
              {certificateHref && (
                <a href={certificateHref} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
                  {ui.actions.certificate}<ArrowUpRight size={15} aria-hidden />
                </a>
              )}
            </div>
            {recognition.certificateImage && certificateHref && (
              <a href={certificateHref} target="_blank" rel="noopener noreferrer" className="block border border-line bg-canvas p-3 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-paper">
                <div className="relative aspect-[7/5]">
                  <Image src={recognition.certificateImage} alt={`${recognition.title} certificate for ${project.shortName ?? project.title} — ${recognition.event}`} fill sizes="(min-width: 1024px) 320px, calc(100vw - 6rem)" className="object-contain" />
                </div>
              </a>
            )}
          </div>
        </section>
      )}

      <nav aria-label="Project links" className="flex flex-wrap gap-3 border-t border-line bg-solid px-5 py-10 text-on-solid sm:px-8 sm:py-14">
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-on-solid px-6 text-sm font-bold text-solid transition-colors hover:bg-accent-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-solid focus-visible:ring-offset-4 focus-visible:ring-offset-solid">
            {ui.actions.demo}<ArrowUpRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-on-solid/45 px-6 text-sm font-bold text-on-solid transition-colors hover:border-on-solid hover:bg-on-solid/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-solid focus-visible:ring-offset-4 focus-visible:ring-offset-solid">
            {project.githubLabel ?? (project.collaboration ? ui.actions.teamRepo : ui.actions.code)}<ArrowUpRight size={15} aria-hidden />
          </a>
        )}
      </nav>
    </article>
  )
}
