import Image from 'next/image'

import type {HeroImage} from '@/components/hero/hero-image'
import {Grid12, SectionBand, SiteShell} from '@/components/layout'
import {TEASER_IMAGE_HEIGHT, TEASER_IMAGE_WIDTH} from '@/components/news/news-post-teaser'
import {cn} from '@/lib/utils'

export type BlogHeroSectionProps = {
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
 * Blog article detail hero (v2). Step 3: responsive typography; desktop layout geometry.
 * @see docs/blog-components.md
 */
const heroMainCol = 'col-span-10 col-start-2 lg:col-span-8 lg:col-start-3'

export function BlogHeroSection({
  title,
  date,
  image,
  seriesName,
  photoCredit,
  className,
}: BlogHeroSectionProps) {
  if (!title?.trim() || !image?.src) {
    return null
  }

  const seriesLabel = seriesName?.trim()
  const creditLabel = photoCredit?.trim()

  return (
    <SectionBand className={cn('bg-surface overflow-x-clip', className)} aria-label={title}>
      <div data-slot="blog-hero">
        <SiteShell padding="grid" className="relative z-[1]">
          <div data-slot="blog-hero-text-row">
            <div data-slot="blog-hero-beige-left" aria-hidden="true" />
            <div data-slot="blog-hero-beige-right" aria-hidden="true" />
            <div data-slot="blog-hero-text-panel">
              <Grid12>
                <div className={cn(heroMainCol, 'flex flex-col items-center text-center')}>
                  <div className="flex flex-col items-center gap-8">
                    {seriesLabel ? (
                      <p
                        data-slot="blog-hero-series"
                        className="text-foreground m-0 font-normal uppercase"
                      >
                        {seriesLabel}
                      </p>
                    ) : null}
                    <h1
                      data-slot="blog-hero-title"
                      className="text-foreground font-serif m-0 font-medium"
                    >
                      {title}
                    </h1>
                  </div>
                  <p data-slot="blog-hero-date" className="text-foreground font-normal">
                    {date}
                  </p>
                </div>
              </Grid12>
            </div>
          </div>

          <Grid12 data-slot="blog-hero-image-grid">
            <figure data-slot="blog-hero-figure" className={cn(heroMainCol, 'm-0')}>
              <Image
                src={image.src}
                alt={image.alt}
                width={imageDimension(image.width, TEASER_IMAGE_WIDTH)}
                height={imageDimension(image.height, TEASER_IMAGE_HEIGHT)}
                className="h-full w-full object-cover"
                sizes="(max-width: 1023px) 83vw, 925px"
                priority
              />
            </figure>
            {creditLabel ? (
              <figcaption
                data-slot="blog-hero-credit"
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
