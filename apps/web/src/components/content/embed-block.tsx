import type {ResolvedEmbed} from '@/lib/embed-providers'

type EmbedBlockProps = {
  embed: ResolvedEmbed
  caption?: string | null
}

export function EmbedBlock({embed, caption}: EmbedBlockProps) {
  const trimmedCaption = caption?.trim()
  const title = trimmedCaption || embed.title

  return (
    <figure className="my-8">
      <div
        className={
          embed.aspect === 'video'
            ? 'relative aspect-video w-full overflow-hidden'
            : 'relative w-full overflow-hidden'
        }
        style={embed.fixedHeight ? {height: embed.fixedHeight} : undefined}
      >
        <iframe
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={embed.src}
          title={title}
        />
      </div>
      {trimmedCaption ? (
        <figcaption className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {trimmedCaption}
        </figcaption>
      ) : null}
    </figure>
  )
}
