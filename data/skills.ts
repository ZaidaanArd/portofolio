export interface SkillCategory {
  name: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    name: "Backend",
    skills: ["Node.js", "Express", "PostgreSQL"],
  },
  {
    name: "Tools",
    skills: ["Git", "GitHub", "Figma", "VS Code"],
  },
  {
    name: "Other",
    skills: ["English", "Video Editing"],
  },
]
