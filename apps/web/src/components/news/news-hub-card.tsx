import Image from 'next/image'

import {ContentLink} from '@/components/content-link'
import type {HeroImage} from '@/components/hero/hero-image'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

export type NewsHubCardProps = {
  href: string
  title: string
  excerpt: string
  image: HeroImage
  postTypeLabel: string
  /** Hub CTA label. Defaults to “Read More” for on-site posts. */
  ctaLabel?: string
  /** When true, CTA opens in a new tab (News / external posts). */
  external?: boolean
  titleId?: string
  className?: string
  /** Eager-load above-the-fold images (first card(s) on the hub). */
  priority?: boolean
}

function imageDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

export function NewsHubCard({
  href,
  title,
  excerpt,
  image,
  postTypeLabel,
  ctaLabel = 'Read More',
  external = false,
  titleId,
  className,
  priority = false,
}: NewsHubCardProps) {
  const headingId = titleId ?? `news-hub-card-${title.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <article data-slot="news-hub-card" className={cn(className)} aria-labelledby={headingId}>
      <div data-slot="news-hub-card-image">
        <Image
          src={image.src}
          alt={image.alt}
          width={imageDimension(image.width, 900)}
          height={imageDimension(image.height, 776)}
          className="h-full w-full object-cover"
          sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) calc((100vw - 88px) / 2), 450px"
          priority={priority}
        />
      </div>

      <div data-slot="news-hub-card-body">
        <p data-slot="news-hub-card-type">{postTypeLabel}</p>
        <h2 id={headingId} data-slot="news-hub-card-title">
          {title}
        </h2>
        <p data-slot="news-hub-card-excerpt">{excerpt}</p>
        <Button asChild variant="surface" size="cta" className="mt-auto self-center">
          <ContentLink href={href} external={external}>
            {ctaLabel}
          </ContentLink>
        </Button>
      </div>
    </article>
  )
}
