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
  date: string
  image: HeroImage
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
  date,
  image,
  seriesName,
  photoCredit,
  className,
}: ArticleHeroSectionProps) {
  if (!title?.trim() || !image?.src) {
    return null
  }

  const seriesLabel = seriesName?.trim()
  const creditLabel = photoCredit?.trim()

  return (
    <SectionBand className={cn('bg-surface overflow-x-clip', className)} aria-label={title}>
      <div data-slot="article-hero">
        <SiteShell padding="grid" className="relative z-[1]">
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
                    <h1
                      data-slot="article-hero-title"
                      className="text-foreground font-serif m-0 font-medium"
                    >
                      {title}
                    </h1>
                  </div>
                  <p data-slot="article-hero-date" className="text-foreground font-normal">
                    {date}
                  </p>
                </div>
              </Grid12>
            </div>
          </div>

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
        </SiteShell>
      </div>
    </SectionBand>
  )
}
