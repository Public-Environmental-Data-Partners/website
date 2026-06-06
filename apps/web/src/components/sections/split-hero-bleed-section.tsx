import {PortableText} from '@portabletext/react'

import type {HeroImage} from '@/components/hero/hero-image'
import {HeroImageBlock} from '@/components/hero/hero-image'
import {
  HeroShelf,
  HeroSplitBleedColumn,
  HeroSplitContentColumn,
  HeroSplitGrid,
  HeroSplitImageColumn,
  HeroSplitImageFrame,
  HeroSplitShelfRow,
  HeroSplitWhiteBand,
  SectionBand,
  SiteShell,
} from '@/components/layout'
import {cn} from '@/lib/utils'

export type SplitHeroBleedSectionProps = {
  eyebrow?: string
  title: string
  body?: unknown
  image: HeroImage
  imageMobile?: HeroImage
  hideImageOnMobile?: boolean
}

export function SplitHeroBleedSection({
  eyebrow,
  title,
  body,
  image,
  imageMobile,
  hideImageOnMobile,
}: SplitHeroBleedSectionProps) {
  if (!title?.trim() || !image?.src) {
    return null
  }

  return (
    <SectionBand className="bg-light-beige" aria-label={title}>
      <SiteShell padding="splitHero">
        <HeroSplitGrid>
          <HeroSplitBleedColumn />
          <HeroSplitContentColumn>
            {eyebrow ? (
              <p className="text-muted-foreground font-semibold uppercase tracking-wide">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="hero-primary-heading text-foreground font-medium leading-tight tracking-tight">
              {title}
            </h1>
            {body ? (
              <div className="text-foreground/90 max-w-none space-y-4 leading-relaxed">
                <PortableText value={body as never} />
              </div>
            ) : null}
          </HeroSplitContentColumn>
          <HeroSplitWhiteBand />
          <HeroSplitImageColumn
            className={cn(hideImageOnMobile && 'max-md:hidden')}
          >
            <HeroSplitImageFrame className="relative overflow-hidden bg-surface">
              <HeroImageBlock
                variant="split"
                image={image}
                imageMobile={imageMobile}
              />
            </HeroSplitImageFrame>
          </HeroSplitImageColumn>
          <HeroSplitShelfRow>
            <HeroShelf />
          </HeroSplitShelfRow>
        </HeroSplitGrid>
      </SiteShell>
    </SectionBand>
  )
}
