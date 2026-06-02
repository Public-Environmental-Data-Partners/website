'use client'

import {useId} from 'react'

import {ContentCarousel} from '@/components/cards/content-carousel'
import {ContentStack, SectionBand, SiteShell} from '@/components/layout'
import type {CardCarouselSectionProps} from '@/lib/mappers/card-carousel-section'

export type {CardCarouselSectionProps}

/** `cardCarouselSection` CMS block: heading + story/tool cards (carousel when 2+ items). */
export function CardCarouselSection({sectionHeading, cards}: CardCarouselSectionProps) {
  const reactId = useId()
  const headingId = `card-carousel-heading-${reactId.replace(/:/g, '')}`

  return (
    <SectionBand
      className="bg-light-beige border-border border-t dark:bg-background"
      aria-labelledby={headingId}
    >
      <SiteShell>
        <ContentStack>
          <h2 id={headingId} className="section-label-heading text-muted-foreground">
            {sectionHeading}
          </h2>
          <ContentCarousel cards={cards} labelledBy={headingId} />
        </ContentStack>
      </SiteShell>
    </SectionBand>
  )
}
