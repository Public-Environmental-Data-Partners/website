import Image from 'next/image'

import type {HeroImage} from '@/components/hero/hero-image'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {
  ARTICLE_HERO_IMAGE_HEIGHT,
  ARTICLE_HERO_IMAGE_SIZES,
  ARTICLE_HERO_IMAGE_WIDTH,
} from '@/lib/mappers/sanity-image'
import {cn} from '@/lib/utils'

export type ArticleHeroSectionProps = {
  title: string
  /** When false, render a visually hidden h1 only (story detail chrome). Default true. */
  showTitle?: boolean
  date?: string | null
  image?: HeroImage | null
  seriesName?: string
  photoCredit?: string
  className?: string
}

function imageDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

/**
 * Article detail hero (v2). Hotspot-aware Sanity CDN images.
 * @see docs/architecture/article-components.md
 */
const heroMainCol = 'col-span-10 col-start-2 lg:col-span-8 lg:col-start-3'

export function ArticleHeroSection({
  title,
  showTitle = true,
  date,
  image,
  seriesName,
  photoCredit,
  className,
}: ArticleHeroSectionProps) {
  const titleText = title?.trim()
  if (!titleText) {
    return null
  }

  const seriesLabel = seriesName?.trim()
  const dateLabel = date?.trim()
  const creditLabel = photoCredit?.trim()
  const showVisibleTitle = showTitle !== false
  const showVisibleImage = Boolean(image?.src)
  const showTextPanel = Boolean(seriesLabel || showVisibleTitle || dateLabel)
  const showVisibleChrome = showTextPanel || showVisibleImage
  const heroLayout =
    showTextPanel && showVisibleImage ? 'full' : showTextPanel ? 'text-only' : 'image-only'

  const heading = (
    <h1
      data-slot="article-hero-title"
      className={cn('text-foreground font-serif m-0 font-medium', !showVisibleTitle && 'sr-only')}
    >
      {titleText}
    </h1>
  )

  if (!showVisibleChrome) {
    return heading
  }

  return (
    <SectionBand className={cn('bg-surface overflow-x-clip', className)} aria-label={titleText}>
      <div data-hero-layout={heroLayout} data-slot="article-hero">
        <SiteShell padding="grid" className="relative z-[1]">
          {showTextPanel ? (
            <div data-slot="article-hero-text-row">
              <div data-slot="article-hero-beige-left" aria-hidden="true" />
              <div data-slot="article-hero-beige-right" aria-hidden="true" />
              <div data-slot="article-hero-text-panel">
                <Grid12>
                  <div className={cn(heroMainCol, 'flex flex-col items-center text-center')}>
                    <div className="flex flex-col items-center gap-8">
                      {seriesLabel ? (
                        <p
                          data-slot="article-hero-series"
                          className="text-foreground m-0 font-normal uppercase"
                        >
                          {seriesLabel}
                        </p>
                      ) : null}
                      {heading}
                    </div>
                    {dateLabel ? (
                      <p data-slot="article-hero-date" className="text-foreground font-normal">
                        {dateLabel}
                      </p>
                    ) : null}
                  </div>
                </Grid12>
              </div>
            </div>
          ) : (
            heading
          )}

          {showVisibleImage && image ? (
            <Grid12 data-slot="article-hero-image-grid">
              <figure data-slot="article-hero-figure" className={cn(heroMainCol, 'm-0')}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={imageDimension(image.width, ARTICLE_HERO_IMAGE_WIDTH)}
                  height={imageDimension(image.height, ARTICLE_HERO_IMAGE_HEIGHT)}
                  className="h-full w-full object-cover"
                  sizes={ARTICLE_HERO_IMAGE_SIZES}
                  priority
                />
              </figure>
              {creditLabel ? (
                <figcaption
                  data-slot="article-hero-credit"
                  className={cn(heroMainCol, 'text-foreground text-center font-normal uppercase')}
                >
                  {creditLabel}
                </figcaption>
              ) : null}
            </Grid12>
          ) : null}
        </SiteShell>
      </div>
    </SectionBand>
  )
}
