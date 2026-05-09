'use client'

import {useId} from 'react'

import {ContentCarousel} from '@/components/cards/content-carousel'
import type {CardCarouselSectionProps} from '@/lib/mappers/card-carousel-section'

export type {CardCarouselSectionProps}

/** `cardCarouselSection` wrapper: heading + story/tool cards (carousel when 2+ items). */
export function CardCarouselSection({sectionHeading, cards}: CardCarouselSectionProps) {
  const reactId = useId()
  const headingId = `card-carousel-heading-${reactId.replace(/:/g, '')}`

  return (
    <section
      className="bg-light-beige border-border border-t dark:bg-background"
      aria-labelledby={headingId}
    >
      <div className="mx-auto w-full max-w-site px-6 py-10 md:px-12 md:py-14">
        <h2 id={headingId} className="section-label-heading text-muted-foreground mb-5 md:mb-7">
          {sectionHeading}
        </h2>
        <ContentCarousel cards={cards} labelledBy={headingId} />
      </div>
    </section>
  )
}
