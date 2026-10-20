# AGENTS.md — Portfolio Website Project

> 📎 For visual/design guidance (color, typography, layout, tone), see **`DESIGN.md`** — do not mix design decisions into this file.

## 1. Project Overview

This website is a **personal portfolio** showcasing profile, projects, skills, and contact information. Target audience: recruiters, freelance clients, and the developer community. Main goal: build personal branding and demonstrate technical ability directly through the code and design of this site itself.

The number of projects shown is still small (early-career portfolio), so the design focus is:
- Storytelling per project (problem → solution → result → learning), not just a list of projects.
- Presentation quality compensates for project quantity.
- A structure that is easy to update as new projects are added.

## 2. Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript (recommended, not plain JavaScript)
- **Deployment**: Vercel
- **Icons**: lucide-react (or similar, consistent across the site)
- **Font**: use `next/font` for loading optimization, choose a modern and readable font (e.g. Inter, Geist, or Space Grotesk for accents)
- **Animation (optional)**: Framer Motion, use sparingly — do not overdo it to the point of hurting performance/loading

## 3. Folder Structure (target)

```
/app
  /page.tsx            -> homepage (hero, about, projects, skills, contact sections)
  /projects/[slug]/page.tsx  -> detail page for each project (optional, if a project needs its own page)
  /layout.tsx
  /globals.css
/components
  Hero.tsx
  About.tsx
  ProjectCard.tsx
  ProjectList.tsx
  Skills.tsx
  Contact.tsx
  Navbar.tsx
  Footer.tsx
/data
  projects.ts           -> all project data (array of objects), not hardcoded in components
  skills.ts
/public
  /images               -> project screenshots, profile photo, etc.
/lib
  utils.ts              -> helper functions if needed
```

**Key principle**: content (project data, skills, etc.) is separated from UI components and stored in `/data`, so it is easy to update without touching JSX.

## 4. Content Sections (homepage order)

1. **Hero**
   - Name
   - One-line value proposition (who you are, what your main skill is)
   - CTA button (e.g. "See my work" / "Get in touch")

2. **About**
   - Short story (3-5 sentences), keep it brief
   - Can add a photo or illustration

3. **Projects / Selected Work**
   - Show 3-6 best projects (not all)
   - Each project card contains: title, short description, tech stack used, demo & GitHub links
   - When clicked, it should ideally open a detail page with a case study (problem → solution → challenge → result)

4. **Skills**
   - Group by category (e.g. Frontend, Backend, Tools) to keep it tidy
   - Display as badges/lists, not progress bars (progress bars feel too subjective/unprofessional)

5. **Contact**
   - Email, LinkedIn, GitHub
   - Optional: a simple contact form (if desired, use Formspree/Resend so no backend is needed)

## 5. Design Guidelines

All visual guidance, tone, typography, color, and aesthetics are **not** written in this file — see **`DESIGN.md`** as the single design reference. Agents must read `DESIGN.md` before building any UI component and follow it consistently across all pages.

## 6. Coding Conventions

- Use **TypeScript** for all files (`.tsx`/`.ts`)
- Components are written as **functional components** with hooks (not class components)
- Use **Tailwind utility classes** directly in JSX; avoid custom CSS unless truly necessary
- File & component names: **PascalCase** for components (`ProjectCard.tsx`), **camelCase** for functions/variables
- All text/copy is stored as constants/data, not hardcoded repeatedly across components
- Each component should be small and focused on a single responsibility

## 7. Build Priorities (work order)

1. Set up the Next.js + Tailwind project and basic folder structure
2. Build Navbar & Footer
3. Build the Hero section
4. Build the About section
5. Build the Projects section (start with dummy/placeholder data if projects are not complete)
6. Build the Skills section
7. Build the Contact section
8. Responsive testing (mobile & desktop)
9. Deploy to Vercel
10. Iterate: add new projects, refine the design, add animation if needed

## 8. Notes for the Agent

- Do not generate fictional/fake projects to fill the Projects section — use a clearly labelled "Coming soon" placeholder or ask the user for real data.
- Prioritize a **finished & online** product over a "perfect" design that does not run yet.
- If there is ambiguity about content (e.g. name, bio, projects), make reasonable assumptions and mark them with a `// TODO: update` comment so the user can easily find and edit them later.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
