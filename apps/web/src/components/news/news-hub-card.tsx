import Image from 'next/image'
import Link from 'next/link'

import type {HeroImage} from '@/components/hero/hero-image'
import {cn} from '@/lib/utils'

export type NewsHubCardProps = {
  href: string
  title: string
  excerpt: string
  image: HeroImage
  postTypeLabel: string
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
        <Link href={href} data-slot="news-hub-card-cta">
          Read More
        </Link>
      </div>
    </article>
  )
}
