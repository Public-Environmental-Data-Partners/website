import Image from 'next/image'

import {ContentLink} from '@/components/content-link'
import {Button} from '@/components/ui/button'
import type {ToolCardProps} from '@/lib/mappers/tools-development'
import {cn} from '@/lib/utils'

function imageDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

/**
 * Tools Development tool card: image, title, description, optional version / pill, CTA.
 */
export function ToolCard({
  title,
  description,
  version,
  pill,
  ctaLabel,
  href,
  external,
  image,
}: ToolCardProps) {
  return (
    <article
      className={cn(
        'bg-off-white flex h-full flex-col overflow-hidden',
        'col-span-12 md:col-span-6 lg:col-span-4',
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={image.src}
          alt={image.alt}
          width={imageDimension(image.width, 800)}
          height={imageDimension(image.height, 600)}
          className="h-full w-full object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col px-5 pt-8 pb-6 md:px-6">
        <h3 className="text-off-black font-sans text-[1.125rem] leading-none font-bold tracking-normal uppercase">
          {title}
        </h3>
        <p className="text-off-black mt-10 font-sans text-[1.5625rem] leading-none font-semibold tracking-normal">
          {description}
        </p>
        {version ? (
          <p className="text-muted-foreground mt-4 font-sans text-[1.25rem] leading-none font-normal italic tracking-normal">
            {version}
          </p>
        ) : null}
        {pill ? (
          <span className="bg-clay mt-5 inline-flex w-fit self-center rounded-full px-3 py-1 font-sans text-sm font-semibold tracking-normal text-white uppercase">
            {pill}
          </span>
        ) : null}
        <div className={cn('mt-auto flex justify-center', pill || version ? 'pt-5' : 'pt-8')}>
          <Button asChild variant="offBlack" size="cta" className="min-w-0 px-6">
            <ContentLink href={href} external={external}>
              {ctaLabel}
            </ContentLink>
          </Button>
        </div>
      </div>
    </article>
  )
}
