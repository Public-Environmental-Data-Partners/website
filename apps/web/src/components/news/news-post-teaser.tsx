import Image from 'next/image'
import Link from 'next/link'

import type {HeroImage} from '@/components/hero/hero-image'
import {cn} from '@/lib/utils'

/** Display frame for hub teaser images @ md+ (scales down in narrower media column). */
export const TEASER_IMAGE_WIDTH = 500
export const TEASER_IMAGE_HEIGHT = 400

export type NewsPostTeaserProps = {
  href: string
  title: string
  excerpt: string
  image: HeroImage
  publishedAt: string
  eyebrow?: string
  tags?: string[]
  titleId?: string
  className?: string
}

function imageDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

function formatPublishedDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return `Published: ${date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })}`
}

export function NewsPostTeaser({
  href,
  title,
  excerpt,
  image,
  publishedAt,
  eyebrow,
  tags,
  titleId,
  className,
}: NewsPostTeaserProps) {
  const publishedLabel = formatPublishedDate(publishedAt)
  const headingId = titleId ?? `news-teaser-${title.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <article data-slot="news-post-teaser" className={cn(className)} aria-labelledby={headingId}>
      <div data-slot="teaser-media">
        <div data-slot="teaser-image-row">
          <div data-slot="teaser-bleed-col" aria-hidden="true" />
          <div data-slot="teaser-image">
            <Image
              src={image.src}
              alt={image.alt}
              width={imageDimension(image.width, TEASER_IMAGE_WIDTH)}
              height={imageDimension(image.height, TEASER_IMAGE_HEIGHT)}
              className="h-full w-full object-cover"
              sizes="(max-width: 767px) 100vw, 500px"
            />
          </div>
        </div>
        <div data-slot="teaser-band" aria-hidden="true">
          <div data-slot="teaser-band-leading" />
          <div data-slot="teaser-band-trailing" />
        </div>
      </div>

      <div data-slot="teaser-content">
        {eyebrow ? (
          <p className="text-muted-foreground font-semibold uppercase tracking-wide">{eyebrow}</p>
        ) : null}
        <h2 id={headingId} data-slot="teaser-title" className="text-navy">
          {title}
        </h2>
        <p
          data-slot="teaser-excerpt"
          className="text-navy text-body-lg font-normal tracking-normal"
        >
          {excerpt}
        </p>
        {tags && tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2" aria-label="Tags">
            {tags.map((tag) => (
              <li
                key={tag}
                className="border-navy text-navy rounded-full border px-3 py-1 text-xs font-semibold"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-2 flex flex-col items-end gap-3">
          {publishedLabel ? (
            <p className="text-muted-foreground text-[0.8125rem]">{publishedLabel}</p>
          ) : null}
          <Link
            href={href}
            className={cn(
              'bg-navy inline-flex min-h-9 items-center justify-center rounded-md px-5',
              'text-[0.8125rem] font-semibold text-white',
              'hover:bg-navy/90 transition-colors',
              'focus-visible:ring-navy focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
          >
            Read
          </Link>
        </div>
      </div>
    </article>
  )
}
