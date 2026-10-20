import Image from "next/image"

interface BrowserFrameProps {
  src: string
  alt: string
  url?: string
  priority?: boolean
  sizes?: string
  className?: string
}

export default function BrowserFrame({
  src,
  alt,
  url,
  priority = false,
  sizes = "(min-width: 1024px) 640px, calc(100vw - 2.5rem)",
  className = "",
}: BrowserFrameProps) {
  return (
    <div className={`border border-line bg-paper shadow-2xl shadow-ink/10 ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2 sm:px-4">
        <span className="h-2 w-2 rounded-full bg-line" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-line" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-line" aria-hidden />
        {url && (
          <span className="ml-3 hidden truncate text-[10px] font-semibold tracking-[0.04em] text-muted sm:block">
            {url}
          </span>
        )}
      </div>
      <div className="relative aspect-video">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-top"
        />
      </div>
    </div>
  )
}
