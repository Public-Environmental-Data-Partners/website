'use client'

import {List} from 'lucide-react'
import Link from 'next/link'
import {useId} from 'react'

import {CarouselCard} from '@/components/cards/carousel-card'
import {ContentCarousel} from '@/components/cards/content-carousel'
import {ContentStack, SectionBand, SiteShell} from '@/components/layout'
import type {CardCarouselSectionProps} from '@/lib/mappers/card-carousel-section'
import {cn} from '@/lib/utils'

export type {CardCarouselSectionProps}

const NEWS_HUB_HREF = '/news-and-updates'
const MOBILE_TABLET_CARD_COUNT = 3

function ViewAllLink() {
  return (
    <Link
      href={NEWS_HUB_HREF}
      className="text-foreground inline-flex items-center justify-center gap-2 font-sans text-[1.375rem] leading-none font-semibold underline underline-offset-4 transition-opacity hover:opacity-80"
    >
      <List className="size-5 shrink-0" aria-hidden />
      VIEW ALL
    </Link>
  )
}

/**
 * `cardCarouselSection` CMS block.
 * Mobile/tablet: up to 3 cards in a static grid + VIEW ALL.
 * Desktop (`lg+`): carousel showing 3 at a time.
 */
export function CardCarouselSection({sectionHeading, cards}: CardCarouselSectionProps) {
  const reactId = useId()
  const headingId = `card-carousel-heading-${reactId.replace(/:/g, '')}`
  const previewCards = cards.slice(0, MOBILE_TABLET_CARD_COUNT)

  return (
    <SectionBand
      className="bg-light-beige border-border border-t dark:bg-background"
      aria-labelledby={headingId}
    >
      <SiteShell>
        <ContentStack className="gap-10 md:gap-12">
          <h2
            id={headingId}
            className="section-label-heading text-muted-foreground text-center md:text-left"
          >
            {sectionHeading}
          </h2>

          {/* Mobile / tablet static grid */}
          <div className="lg:hidden">
            <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
              {previewCards.map((card, index) => (
                <li
                  key={`${card._type}-${card.href}-${index}`}
                  className={cn(
                    index === 2
                      ? 'md:col-span-2 md:mx-auto md:w-full md:max-w-[calc((100%-2rem)/2)]'
                      : undefined,
                  )}
                >
                  <CarouselCard {...card} />
                </li>
              ))}
            </ul>
            <div className="mt-10 flex justify-center">
              <ViewAllLink />
            </div>
          </div>

          {/* Desktop carousel */}
          <div className="hidden lg:block">
            <ContentCarousel cards={cards} labelledBy={headingId} />
          </div>
        </ContentStack>
      </SiteShell>
    </SectionBand>
  )
}
