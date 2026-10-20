export const ui = {
  navigation: [
    { label: "About", href: "/#about" },
    { label: "Work", href: "/#projects" },
    { label: "Skills", href: "/#skills" },
  ],
  sections: { about: "About", projects: "Selected work", skills: "Skills", contact: "Let’s talk" },
  actions: {
    work: "View work", contact: "Get in touch", caseStudy: "Read case study",
    demo: "Live demo", code: "View code", teamRepo: "Team repo",
    backToWork: "Back to work", certificate: "View certificate", backHome: "Back home",
    backToTop: "Back to top", openMenu: "Open menu", closeMenu: "Close menu",
  },
  social: { github: "GitHub", linkedin: "LinkedIn", instagram: "Instagram", email: "Email" },
  project: {
    contribution: "Contribution", context: "Context", stack: "Stack",
    maintainedBy: "Repository maintained by", organizedBy: "Organised by",
    screenshotMissing: "Screenshot coming soon",
    dashboardCaption: "Product dashboard", landingCaption: "Product landing page",
    story: ["Problem", "Approach", "Result", "Learning"],
    status: { "in-progress": "In progress", completed: "Completed" },
  },
  contact: {
    fields: [
      { id: "name", label: "Your name", type: "text", autoComplete: "name" },
      { id: "email", label: "Email address", type: "email", autoComplete: "email" },
    ],
    message: "Message", send: "Send message", sending: "Sending...",
    honeypot: "Leave this field empty",
    feedback: {
      sending: "Sending your message...",
      sent: "Message sent. Thank you — I'll get back to you soon.",
      fallback: "Your email app should open with a prepared message.",
      error: "The form could not send. Please email me directly:",
    },
  },
  notFound: { title: "Page not found.", description: "The link may be broken, or the page has moved." },
}
