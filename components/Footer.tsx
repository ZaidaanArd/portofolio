import { ArrowUp, FolderGit, Globe, Mail } from "lucide-react"
import { personal } from "@/data/personal"
import { ui } from "@/data/ui"

const socials = [
  { label: ui.social.github, href: personal.github, icon: FolderGit },
  { label: ui.social.linkedin, href: personal.linkedin, icon: Globe },
  { label: ui.social.email, href: `mailto:${personal.email}`, icon: Mail },
]

export default function Footer() {
  return (
    <footer className="px-2 sm:px-4">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 border-x border-t border-on-solid/10 bg-solid px-5 py-8 text-sm text-on-solid/75 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          &copy; {new Date().getFullYear()} {personal.name}.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-on-solid/20 text-on-solid/65 transition-colors hover:bg-on-solid/10 hover:text-on-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-solid focus-visible:ring-offset-2 focus-visible:ring-offset-solid"
            >
              <social.icon size={16} />
            </a>
          ))}
          <a
            href="#main-content"
            className="ml-1 inline-flex h-9 items-center gap-2 rounded-full border border-on-solid/20 px-4 text-xs font-semibold text-on-solid/65 transition-colors hover:bg-on-solid/10 hover:text-on-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-solid focus-visible:ring-offset-2 focus-visible:ring-offset-solid"
          >
            <ArrowUp size={14} />
            {ui.actions.backToTop}
          </a>
        </div>
      </div>
    </footer>
  )
}
