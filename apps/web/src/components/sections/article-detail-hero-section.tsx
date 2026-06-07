import Image from 'next/image'

import type {HeroImage} from '@/components/hero/hero-image'
import {
  ArticleDetailAccentColumn,
  ArticleDetailBottomBand,
  ArticleDetailContentColumn,
  ArticleDetailHeroGrid,
  ArticleDetailImageColumn,
  ArticleDetailImageFrame,
  ArticleDetailTopBeigeBand,
  SectionBand,
  SiteShell,
} from '@/components/layout'
import {TEASER_IMAGE_HEIGHT, TEASER_IMAGE_WIDTH} from '@/components/news/news-post-teaser'

export type ArticleDetailHeroSectionProps = {
  title: string
  image: HeroImage
  publishedAt: string
  eyebrow?: string
  author?: string
}

function imageDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

function formatDetailPublishedDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return `published ${date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })}`
}

export function ArticleDetailHeroSection({
  title,
  image,
  publishedAt,
  eyebrow,
  author,
}: ArticleDetailHeroSectionProps) {
  const publishedLabel = formatDetailPublishedDate(publishedAt)

  if (!title?.trim() || !image?.src) {
    return null
  }

  return (
    <SectionBand className="bg-light-beige overflow-x-hidden" aria-label={title}>
      <SiteShell padding="detailHero">
        <ArticleDetailHeroGrid>
          <ArticleDetailAccentColumn />
          <ArticleDetailTopBeigeBand />

          <ArticleDetailContentColumn>
            {eyebrow ? (
              <p className="text-muted-foreground font-semibold uppercase tracking-wide">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="hero-primary-heading text-foreground font-medium leading-tight tracking-tight">
              {title}
            </h1>
            {author ? (
              <p className="text-foreground text-body-lg leading-normal">{author}</p>
            ) : null}
            {publishedLabel ? (
              <p className="text-foreground text-body-lg italic leading-normal">{publishedLabel}</p>
            ) : null}
          </ArticleDetailContentColumn>

          <ArticleDetailImageColumn>
            <ArticleDetailImageFrame className="relative overflow-hidden bg-surface">
              <Image
                src={image.src}
                alt={image.alt}
                width={imageDimension(image.width, TEASER_IMAGE_WIDTH)}
                height={imageDimension(image.height, TEASER_IMAGE_HEIGHT)}
                className="h-full w-full object-cover"
                sizes="(max-width: 767px) 100vw, 500px"
                priority
              />
            </ArticleDetailImageFrame>
          </ArticleDetailImageColumn>

          <ArticleDetailBottomBand />
        </ArticleDetailHeroGrid>
      </SiteShell>
    </SectionBand>
  )
}
