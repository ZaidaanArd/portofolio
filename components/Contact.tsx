import { FolderGit, Globe, Camera } from "lucide-react"
import { personal } from "@/data/personal"
import { ui } from "@/data/ui"
import SectionHeading from "./SectionHeading"
import ContactForm from "./ContactForm"

const socialLinks = [
  { label: ui.social.github, href: personal.github, icon: FolderGit },
  { label: ui.social.linkedin, href: personal.linkedin, icon: Globe },
  { label: ui.social.instagram, href: `https://instagram.com/${personal.instagram.replace("@", "")}`, icon: Camera },
]

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-[1200px] border-x border-line bg-solid px-5 py-14 text-on-solid sm:px-8 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading title={ui.sections.contact} tone="inverse" />
          <a href={`mailto:${personal.email}`} className="mt-6 inline-block max-w-full break-all border-b border-on-solid/50 pb-1 text-base font-semibold transition-colors hover:border-on-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-solid focus-visible:ring-offset-4 focus-visible:ring-offset-solid">{personal.email}</a>
          <div className="mt-6 flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-on-solid/40 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-on-solid hover:bg-on-solid hover:text-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-solid focus-visible:ring-offset-2 focus-visible:ring-offset-solid">
                <link.icon size={15} aria-hidden />{link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="reveal min-w-0" data-reveal><ContactForm /></div>
      </div>
    </section>
  )
}
