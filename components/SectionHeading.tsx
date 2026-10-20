interface SectionHeadingProps {
  title: string
  tone?: "default" | "inverse"
}

export default function SectionHeading({ title, tone = "default" }: SectionHeadingProps) {
  return (
    <h2 className={`reveal display-section font-display ${tone === "inverse" ? "text-on-solid" : "text-ink"}`} data-reveal>
      {title}
    </h2>
  )
}
