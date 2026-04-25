import {PortableText} from '@portabletext/react'
import {getImageProps} from 'next/image'

import {cn} from '@/lib/utils'

type HeroImage = {
  src: string
  alt: string
  width?: number
  height?: number
}

export type HeroSectionProps = {
  eyebrow?: string
  title: string
  body?: unknown
  image?: HeroImage
  imageMobile?: HeroImage
  hideImageOnMobile?: boolean
}

type HeroImageBlockProps = {
  image?: HeroImage
  imageMobile?: HeroImage
  hideImageOnMobile?: boolean
}

function getDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

function HeroImageBlock({image, imageMobile, hideImageOnMobile}: HeroImageBlockProps) {
  const desktopImage = image ?? imageMobile
  if (!desktopImage) {
    return null
  }

  const desktopWidth = getDimension(desktopImage.width, 1600)
  const desktopHeight = getDimension(desktopImage.height, 900)
  const mobileSource = imageMobile ?? desktopImage
  const mobileWidth = getDimension(mobileSource.width, 1080)
  const mobileHeight = getDimension(mobileSource.height, 1350)
  const altText = mobileSource.alt || desktopImage.alt

  const desktopProps = getImageProps({
    src: desktopImage.src,
    alt: altText,
    width: desktopWidth,
    height: desktopHeight,
    sizes: '(max-width: 1023px) 100vw, 50vw',
    fetchPriority: 'high',
  }).props
  const {
    props: {srcSet: mobileSrcSet},
  } = getImageProps({
    src: mobileSource.src,
    alt: altText,
    width: mobileWidth,
    height: mobileHeight,
    sizes: '100vw',
  })

  return (
    <div
      className={cn(
        'relative overflow-hidden border border-border bg-surface',
        'aspect-[5/4] lg:aspect-[4/3]',
        hideImageOnMobile ? 'hidden lg:block' : undefined,
      )}
    >
      <picture>
        <source media="(max-width: 1023px)" srcSet={mobileSrcSet} />
        <img
          {...desktopProps}
          alt={altText}
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
      </picture>
    </div>
  )
}

export function HeroSection({
  eyebrow,
  title,
  body,
  image,
  imageMobile,
  hideImageOnMobile,
}: HeroSectionProps) {
  return (
    <section className="bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 md:px-12 lg:grid-cols-2 lg:gap-12 lg:py-16">
        <div className="flex flex-col gap-6">
          {eyebrow ? (
            <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-foreground text-4xl font-medium leading-tight tracking-tight md:text-5xl">
            {title}
          </h1>
          {body ? (
            <div className="text-foreground/90 max-w-none space-y-4 text-lg leading-relaxed">
              <PortableText value={body as never} />
            </div>
          ) : null}
        </div>
        <HeroImageBlock
          image={image}
          imageMobile={imageMobile}
          hideImageOnMobile={hideImageOnMobile}
        />
      </div>
    </section>
  )
}
