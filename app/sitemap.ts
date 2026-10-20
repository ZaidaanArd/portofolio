import type { MetadataRoute } from "next"
import { caseStudyProjects } from "@/data/projects"
import { siteUrl } from "@/data/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages = caseStudyProjects.map((project) => ({
    url: new URL(`/projects/${project.id}`, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl.toString(),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectPages,
  ]
}
