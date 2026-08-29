import {contentLinkClass} from '@/components/content/portable-text-link'
import type {ResolvedEmbed} from '@/lib/embed-providers'
import {cn} from '@/lib/utils'

const DEFAULT_OPEN_LINK_LABEL = 'Open full story'

type EmbedBlockProps = {
  embed: ResolvedEmbed
  caption?: string | null
  showOpenLink?: boolean | null
  openLinkLabel?: string | null
}

export function EmbedBlock({embed, caption, showOpenLink, openLinkLabel}: EmbedBlockProps) {
  const trimmedCaption = caption?.trim()
  const title = trimmedCaption || embed.title
  const showLink = embed.providerId === 'elhamyali' && showOpenLink !== false
  const linkLabel = openLinkLabel?.trim() || DEFAULT_OPEN_LINK_LABEL

  return (
    <figure className="m-0 min-w-0" data-slot="article-embed-block">
      <div
        className={
          embed.aspect === 'video'
            ? 'relative aspect-video w-full overflow-hidden'
            : 'relative w-full overflow-hidden'
        }
        style={embed.fixedHeight != null ? {height: embed.fixedHeight} : undefined}
      >
        <iframe
          allow={
            embed.providerId === 'youtube'
              ? 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              : undefined
          }
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
      {showLink ? (
        <p className={`text-sm leading-relaxed ${trimmedCaption ? 'mt-2' : 'mt-3'}`}>
          <a
            className={cn('text-accent', contentLinkClass)}
            href={embed.src}
            rel="noopener noreferrer"
            target="_blank"
          >
            {linkLabel}
          </a>
        </p>
      ) : null}
    </figure>
  )
}
