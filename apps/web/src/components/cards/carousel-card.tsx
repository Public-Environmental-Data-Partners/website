import Image from 'next/image'
import Link from 'next/link'

import {Button} from '@/components/ui/button'
import type {CardCarouselCardProps} from '@/lib/mappers/card-carousel-section'
import {cn} from '@/lib/utils'

export type CarouselCardProps = CardCarouselCardProps

function imageDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href)
}

const storyCardShell = cn(
  'bg-off-white border-border flex h-full w-full flex-col overflow-hidden border',
)

const toolCardShell = cn(
  'group bg-off-white border-border dark:bg-surface flex h-full w-[min(100%,22.5rem)] min-h-[35rem] shrink-0 flex-col overflow-hidden border',
  'max-md:min-h-[min(35rem,calc(100dvh_-_30rem))]',
  'max-md:max-h-[min(35rem,calc(100dvh_-_30rem))]',
  'transition-shadow hover:shadow-md',
  'focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
)

const carouselCompactBodyScroll =
  'max-md:min-h-0 max-md:overflow-y-auto max-md:overscroll-y-contain'

/** 40% / 60% flex split on image vs body at all breakpoints (stable cross-width). */
const carouselImageBand = cn(
  'relative w-full min-h-0 shrink grow-[2] basis-0 overflow-hidden bg-muted',
)

const carouselBodyBand = (opts?: {fillWhenNoImage?: boolean}) =>
  cn(
    'flex min-h-0 flex-col px-4 pt-4 pb-4',
    opts?.fillWhenNoImage ? 'flex-1' : 'shrink grow-[3] basis-0',
  )

/**
 * Shared carousel item: `storyCard` vs `toolCard` (mapper props, page-agnostic).
 * Story: button-only link. Tool: entire surface is one link.
 */
export function CarouselCard(props: CarouselCardProps) {
  if (props._type === 'storyCard') {
    return <StoryCard {...props} />
  }
  return <ToolCard {...props} />
}

function StoryCard({title, photoCredit, href, image}: Extract<CarouselCardProps, {_type: 'storyCard'}>) {
  const external = isExternalHref(href)

  return (
    <article className={storyCardShell}>
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-muted">
        <Image
          src={image.src}
          alt={image.alt}
          width={imageDimension(image.width, 1200)}
          height={imageDimension(image.height, 900)}
          className="h-full w-full object-cover"
          sizes="(max-width: 1023px) 90vw, 360px"
        />
      </div>
      <div className="flex flex-1 flex-col px-6 pt-4 pb-8">
        {photoCredit ? (
          <p className="mt-5 mb-8 font-sans text-[1.25rem] leading-none font-normal tracking-normal text-foreground uppercase">
            {photoCredit}
          </p>
        ) : null}
        <h3
          className={cn(
            'font-serif text-[1.875rem] leading-[2.1875rem] font-semibold italic text-foreground',
            photoCredit ? 'mt-0' : 'mt-2',
          )}
        >
          {title}
        </h3>
        <div className="mt-auto flex justify-center pt-8">
          <Button
            asChild
            size="cta"
            variant="surface"
            className="border-border"
          >
            {external ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                View Post
              </a>
            ) : (
              <Link href={href}>View Post</Link>
            )}
          </Button>
        </div>
      </div>
    </article>
  )
}

function ToolCard(props: Extract<CarouselCardProps, {_type: 'toolCard'}>) {
  const {href} = props
  const external = isExternalHref(href)
  const content = <ToolCardInner {...props} />

  if (external) {
    return (
      <a href={href} className={toolCardShell} rel="noopener noreferrer" target="_blank">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={toolCardShell}>
      {content}
    </Link>
  )
}

function ToolCardInner({
  chip,
  title,
  description,
  image,
}: Extract<CarouselCardProps, {_type: 'toolCard'}>) {
  return (
    <>
      {image ? (
        <div className={cn(carouselImageBand, 'border-border border-b lg:border-b-0')}>
          <Image
            src={image.src}
            alt={image.alt}
            width={imageDimension(image.width, 1200)}
            height={imageDimension(image.height, 900)}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            sizes="(max-width: 1023px) 90vw, 360px"
          />
        </div>
      ) : null}
      <div className={cn(carouselBodyBand({fillWhenNoImage: !image}), carouselCompactBodyScroll)}>
        <p className="text-muted-foreground text-[0.65rem] font-semibold uppercase tracking-widest">
          {chip}
        </p>
        <h3 className="text-foreground mt-1 font-sans text-lg font-semibold leading-tight">
          {title}
        </h3>
        {description ? (
          <p className="text-muted-foreground mt-2 line-clamp-4 text-sm leading-relaxed">
            {description}
          </p>
        ) : null}
        <div className="flex-1" aria-hidden />
        <div className="flex justify-end pt-4">
          <span
            className={cn(
              'inline-flex min-h-9 items-center justify-center rounded-[4px]',
              'bg-foreground px-5 py-2 text-xs font-semibold text-background',
              'transition-colors group-hover:bg-foreground/90',
            )}
          >
            Explore
          </span>
        </div>
      </div>
    </>
  )
}
