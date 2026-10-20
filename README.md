# Muhammad Zaidaan Ardiyansyah — Portfolio

Personal portfolio website built with Next.js to showcase profile, projects, skills, and contact information.

## Tech Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Lucide React

## Getting Started

Use Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Create `.env.local` for production URLs and the contact form:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_FORMSPREE_ID=your_form_id
```

Without a Formspree ID, the contact form falls back to opening a prepared email draft.

## Content Structure

- `data/personal.ts`: profile and social links
- `data/projects.ts`: project list
- `data/skills.ts`: skill categories
- `CONTENT.md`: worksheet for filling in real content
- `DESIGN.md`: visual guidelines

Do not add fictional projects. Keep the clearly labelled placeholder until real project data is available.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
npm audit
```

## Deployment

The project can be deployed directly to Vercel once all content and production settings are confirmed.
