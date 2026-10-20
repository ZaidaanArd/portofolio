# DESIGN.md — Focused Editorial Portfolio

The single reference for visual decisions. Keep real content in /data.

## Direction and layout

- Personal, honest editorial storytelling with fewer layers of text.
- Preserve the existing ink-blue palette, light/dark modes, Newsreader–Manrope pairing, 1200px framed canvas, technical grid, and layered project screenshots.
- No profile photo, stock imagery, decorative gradients, eyebrows, decorative numbering, ticker, or label-adjacent square marks.
- Homepage: Hero → About → Selected work → Skills → Contact.
- One short heading per section: About, Selected work, Skills, Let’s talk. Avoid slogans or paragraphs that simply explain the section.
- Maintain px-5 / sm:px-8 padding. Section rhythm is 56–80px; About uses 40–56px.
- Hero has no minimum height or empty status column. Prioritize reaching project proof quickly.
- Keep asymmetric layouts only when both sides contain useful content; removing labels must also remove their empty columns.

## Color — unchanged

Use semantic tokens from app/globals.css; no hardcoded hex values in components.

| Token | Light | Dark |
| --- | --- | --- |
| Canvas | #F5F3EE | #12151C |
| Paper | #FFFEFA | #171B24 |
| Raised | #FFFFFF | #1B202B |
| Ink | #172033 | #EDEFF5 |
| Muted | #5F6878 | #9AA4B5 |
| Line | #D8D5CE | #2A3140 |
| Soft | #EBE8E1 | #1D222D |
| Accent | #1D4E89 | #8AB4E8 |
| Accent strong | #1D4E89 | #2A5C99 |
| Accent soft | #DCE8F5 | #1D3048 |
| On accent | #FFFFFF | #FFFFFF |
| Solid | #172033 | #212836 |
| On solid | #FFFFFF | #F2F4F8 |

Retain solid project/contact surfaces and accent-soft screenshot spreads; the recognition band uses the canvas grid surface. Use on-solid text on solid surfaces, not accent text.
Preserve favicon, Apple icon, Open Graph image, and browser theme colors.

## Typography

- Newsreader via next/font: hero, project titles, and section headings.
- Manrope via next/font: body, Skills categories, metadata, navigation, forms.
- Hero 48–80px; project titles 40–64px; section headings 28–36px, all fluid via clamp().
- Body 16–18px. Functional labels/captions may be 14px; normal case and restrained tracking.
- Comfortable line-height: hero 1.08, project titles 1.12, section headings 1.2, body 1.75–2.
- Use font size to distinguish title, body, and metadata—not to create multiple competing headlines.

## Components and content

- Hero: “Hi, I’m Zaidaan.”, short role, one-sentence proposition, simple collaboration status, View work / Get in touch.
- At 1024px and wider, hero uses a 1.65:1 two-column composition with a decorative Newsreader ZA monogram on the right. Initials are 180–220px in a maximum 360×280px area; A is offset down 18px, with two quiet accent rules. No extra copy, border, gradient, or minimum hero height. Hide the monogram on smaller screens.
- About: one three-sentence biography. No large quotation, repeated role, or project/technology statistics.
- Project: keep the solid background and layered browser-frame screenshots. Title, one-sentence card summary, core stack, concise contribution and recognition, case-study link.
- LevelUp remains the featured project. Follow it with a compact Sthana Kampus card on paper, using ink text, a 28–36px serif title, layered browser-frame screenshots on a quiet surface (public landing with the user home overlapping bottom-left), core stack, and “Brand & UI Lead · Team project”. Show “In progress” as small normal-case text beside the title, not an eyebrow or decorative badge. Use independent demo/repository links; do not imply a finished case study or final outcomes.
- Capture Sthana’s public homepage at 1440×810 and the user home at 1920×1080, store them locally, and preserve the product’s original appearance. These are development UI snapshots, not evidence that every workflow is complete. Keep them free of real private data, and never fabricate a screen.
- Project status is optional; hide it when absent. Case studies are available by default, but projects explicitly opting out appear only on the homepage and are excluded from case-study routes and sitemap.
- On mobile, screenshots precede the description. Title, screenshots, and CTA are independent links inside an article; never nest anchors.
- Skills: compact category rows without numbers or uppercase-heavy metadata.
- Contact: one heading, email/social, and labeled form. No second form heading or introduction.
- Case study: title and summary, product spread with captions, contribution/context/stack, four story sections, recognition with certificate, final product links.
- Preserve complete project descriptions, team attribution, recognition facts, and Problem / Approach / Result / Learning in /data. Remove redundant story/CTA introduction headings.
- 404: clear short heading, useful explanation and navigation; no decorative error number.
- Keep browser chrome, real screenshots, sharp surfaces, and pill buttons.

## Motion, accessibility, and QA

- Manual light/dark changes interpolate the existing semantic color tokens over 350ms ease-in-out using inherited @property <color> registrations. Transition rules exist only on the root while a manual toggle is active, with shared cleanup for desktop/mobile controls. Preserve hover, reveal, and parallax transition rules; do not apply a global transition override or introduce an overlay, radial wipe, or animation library.
- Apply stored/system theme before the initial paint without animation. Repeated clicks reverse from the current colors and immediately update controls/storage. Reduced motion, print, hidden tabs, preference changes, and final subscriber cleanup remove the transition marker/timer. Older browsers without property registration switch directly. Keep palette endpoints and layout unchanged.
- Keep existing entrance/reveal and hover animations. Remove ticker-specific motion only.
- Homepage-only pointer parallax: hero initials move at most ±4px / ±7px and rules ±2px; layered project screenshots (featured and compact cards) move ±6px / ±12px on each axis. Text, CTA, background, and case-study screenshots stay still. No tilt, zoom, custom cursor, new dependency, or continuous loop.
- Enable only for mouse input on a fine, hover-capable pointer at 1024px and wider, without reduced motion. Use finite requestAnimationFrame smoothing with a 90ms time constant. Return to center on pointer leave/scroll; reset on focus, hidden tabs, blur, resize, print, preference changes, and unmount. Preserve static server-rendered fallback, click targets, focus rings, and mobile layout.
- All motion respects prefers-reduced-motion. Reveal animations never hide content if JavaScript fails.
- Clear focus states and accessible headings, theme control, mobile menu, field labels, and screenshot descriptions.
- Maintain WCAG AA text contrast and at least 3:1 for meaningful field boundaries/focus indicators.
- Test homepage, case study, and 404 at 390, 768, 1024, and 1440px in both themes, plus 200% zoom/reflow.
- Test form states without sending an external message.
- Prefer an existing server; stop every temporary QA server created by the agent.
