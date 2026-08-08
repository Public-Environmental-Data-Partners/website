import Image from 'next/image'

import {ContentLink} from '@/components/content-link'
import {Button} from '@/components/ui/button'
import type {CardCarouselCardProps} from '@/lib/mappers/card-carousel-section'
import {cn} from '@/lib/utils'

export type CarouselCardProps = CardCarouselCardProps

function imageDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

const storyCardShell = cn(
  'bg-off-white border-border flex h-full w-full flex-col overflow-hidden border',
)

/**
 * Homepage carousel story card. Button-only link.
 */
export function CarouselCard(props: CarouselCardProps) {
  return <StoryCard {...props} />
}

function StoryCard({title, photoCredit, href, external, image}: CarouselCardProps) {
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
          <Button asChild size="cta" variant="surface" className="border-border">
            <ContentLink href={href} external={external}>
              View Post
            </ContentLink>
          </Button>
        </div>
      </div>
    </article>
  )
}
