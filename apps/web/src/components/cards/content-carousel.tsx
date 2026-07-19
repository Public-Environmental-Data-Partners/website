'use client'

import {type KeyboardEvent, useEffect, useId, useMemo, useState} from 'react'

import {CarouselCard} from '@/components/cards/carousel-card'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import type {CardCarouselCardProps} from '@/lib/mappers/card-carousel-section'
import {usePrefersReducedMotion} from '@/lib/use-prefers-reduced-motion'
import {cn} from '@/lib/utils'

export type ContentCarouselProps = {
  cards: CardCarouselCardProps[]
  labelledBy?: string
}

function carouselKey(card: CardCarouselCardProps, index: number) {
  return `${card._type}-${card.href}-${index}`
}

/**
 * Desktop card carousel: shows ~3 cards at a time; navigates through the rest.
 * Single card is static (no chrome).
 */
export function ContentCarousel({cards, labelledBy}: ContentCarouselProps) {
  const reduceMotion = usePrefersReducedMotion()
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)
  const regionId = useId()
  const showNav = cards.length > 3

  const opts = useMemo(
    () => ({
      align: 'start' as const,
      slidesToScroll: 1,
      duration: reduceMotion ? 0 : 25,
    }),
    [reduceMotion],
  )

  useEffect(() => {
    if (!api) {
      return
    }
    const sync = () => setActiveIndex(api.selectedScrollSnap())
    sync()
    api.on('select', sync)
    api.on('reInit', sync)
    return () => {
      api.off('select', sync)
      api.off('reInit', sync)
    }
  }, [api])

  const handleCarouselKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!api) {
      return
    }
    if (e.key === 'Home') {
      e.preventDefault()
      api.scrollTo(0)
    }
    if (e.key === 'End') {
      e.preventDefault()
      api.scrollTo(Math.max(0, cards.length - 1))
    }
  }

  if (cards.length === 0) {
    return null
  }

  if (cards.length <= 3) {
    return (
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {cards.map((card, i) => (
          <li
            key={carouselKey(card, i)}
            className={cn(
              i === 2 && cards.length === 3
                ? 'md:col-span-2 md:mx-auto md:w-full md:max-w-[calc((100%-2rem)/2)] lg:col-span-1 lg:max-w-none'
                : undefined,
            )}
          >
            <CarouselCard {...card} />
          </li>
        ))}
      </ul>
    )
  }

  const controlBtnClass =
    'border-border bg-background text-foreground inline-flex size-11 shrink-0 items-center justify-center rounded-[4px] border shadow-sm hover:bg-muted focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none [&_svg]:size-5'

  const navBtnLayout = 'relative inset-auto translate-x-0 translate-y-0 rounded-[4px] shadow-sm'

  return (
    <div className="space-y-5">
      <div
        className="focus-visible:ring-ring rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        role="presentation"
      >
        <Carousel
          id={regionId}
          aria-labelledby={labelledBy}
          opts={opts}
          setApi={setApi}
          tabIndex={0}
          className="flex min-w-0 flex-nowrap items-center gap-3 md:gap-4"
          onKeyDown={handleCarouselKeyDown}
        >
          <CarouselPrevious
            type="button"
            variant="outline"
            aria-controls={regionId}
            className={cn(controlBtnClass, navBtnLayout)}
          />
          <div className="min-w-0 flex-1 pb-2">
            <CarouselContent className="-ml-0 lg:-ml-6">
              {cards.map((card, i) => (
                <CarouselItem
                  key={carouselKey(card, i)}
                  aria-label={`Slide ${i + 1} of ${cards.length}`}
                  className="basis-full pl-0 lg:basis-1/3 lg:pl-6"
                >
                  <CarouselCard {...card} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
          <CarouselNext
            type="button"
            variant="outline"
            aria-controls={regionId}
            className={cn(controlBtnClass, navBtnLayout)}
          />
        </Carousel>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {cards.map((card, i) => (
          <button
            key={carouselKey(card, i)}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === activeIndex ? 'true' : undefined}
            className={cn(
              'h-2 shrink-0 rounded-full motion-reduce:transition-none',
              i === activeIndex
                ? 'bg-foreground w-6'
                : 'bg-muted-foreground/35 hover:bg-muted-foreground/55 w-2',
            )}
            onClick={() => api?.scrollTo(i)}
          />
        ))}
      </div>
    </div>
  )
}
