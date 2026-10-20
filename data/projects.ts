export interface Project {
  id: string
  title: string
  shortName?: string
  description: string
  cardDescription?: string
  status?: "in-progress" | "completed"
  hasCaseStudy?: boolean
  problem?: string
  approach?: string
  result?: string
  learning?: string
  storyHeading?: string
  linksHeading?: string
  recognition?: {
    title: string
    event: string
    organizer?: string
    year?: string
    note?: string
    certificateImage?: string
    certificateUrl?: string
  }
  role?: string
  team?: string
  repoOwner?: {
    name: string
    url: string
  }
  collaboration?: boolean
  year?: string
  techStack: string[]
  demoUrl?: string
  githubUrl?: string
  image?: string
  imageCaption?: string
  dashboardImage?: string
  dashboardImageCaption?: string
  githubLabel?: string
}

export const projects: Project[] = [
  {
    id: "levelup-lms",
    title: "LevelUp — Adaptive LMS for Neurodivergent Learners",
    shortName: "LevelUp",
    description:
      "An adaptive learning platform for students with ADHD and dyslexia, with an accessibility panel on every page, quizzes that adjust their difficulty, and learning progress stored on the device.",
    cardDescription: "An adaptive learning platform for students with ADHD and dyslexia.",
    problem:
      "Digital learning material rarely adapts to how neurodivergent learners read.",
    approach:
      "An accessibility panel on every page, profile presets, three-level adaptive quizzes, and a progress dashboard.",
    result:
      "A dashboard that tracks progress per paragraph and exports certificates as PDF.",
    learning:
      "Syncing quiz progress with the dashboard, optimizing the bundle with lazy loading, and working as a team through branches and pull requests.",
    storyHeading:
      "From an accessibility gap to a working learning experience.",
    linksHeading: "See LevelUp beyond the case study.",
    recognition: {
      title: "Finalist",
      event: "CITECH (Carnival Technology) 2026 — Web Design Competition",
      organizer:
        "UKM Logicware and Open Source (UKM LAOS), Faculty of Computer Science, Universitas Jember",
      year: "2026",
      note: "LevelUp was selected as a finalist in the web design competition held from 2 to 23 August 2026, themed around developing student creativity and digital innovation.",
      certificateImage: "/images/levelup-finalist-citech.webp",
    },
    role: "Dashboard, progress tracking, PDF certificate export, and UI polish",
    team: "Team collaboration project",
    repoOwner: {
      name: "Kemal Faza",
      url: "https://github.com/kemal-faza",
    },
    collaboration: true,
    year: "2026",
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "IndexedDB",
      "Vitest",
    ],
    demoUrl: "https://neurodivergent-lms.vercel.app/",
    githubUrl: "https://github.com/kemal-faza/neurodivergent-lms",
    image: "/images/levelup-landing.webp",
    imageCaption: "Landing — accessibility panel and learner profile presets",
    dashboardImage: "/images/levelup-dashboard.webp",
    dashboardImageCaption:
      "Dashboard — progress per paragraph, streaks, and PDF certificates",
    githubLabel: "Team repo",
  },
  {
    id: "sthana-kampus",
    title: "Sthana Kampus",
    description: "A campus facility reservation and reporting platform.",
    cardDescription: "A campus facility reservation and reporting platform.",
    status: "in-progress",
    hasCaseStudy: false,
    role: "Brand & UI Lead",
    team: "Team project",
    collaboration: true,
    year: "2026",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Convex"],
    demoUrl: "https://sthana.myudak.com/",
    githubUrl: "https://github.com/ZaidaanArd/ProjectPPK",
    githubLabel: "Team repo",
    image: "/images/sthana-landing.webp",
    imageCaption: "Sthana Kampus public homepage — UI snapshot during development",
    dashboardImage: "/images/sthana-beranda-user.png",
    dashboardImageCaption: "User home — facility reservation overview",
  },
]

// Existing projects keep their case study unless explicitly opted out.
export const caseStudyProjects = projects.filter((project) => project.hasCaseStudy !== false)

export function getProject(id: string) {
  return projects.find((project) => project.id === id)
}
