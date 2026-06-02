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
  /** Embedded image + 3fr/2fr grid (homepage). When false, default inner-page hero. */
  homePageStyle?: boolean
}

type HeroImageVariant = 'home' | 'default'

type HeroImageBlockProps = {
  variant: HeroImageVariant
  image?: HeroImage
  imageMobile?: HeroImage
  hideImageOnMobile?: boolean
  className?: string
  fillContainer?: boolean
}

function getDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

function HeroImagePicture({
  desktopImage,
  mobileSource,
  altText,
  variant,
}: {
  desktopImage: HeroImage
  mobileSource: HeroImage
  altText: string
  variant: HeroImageVariant
}) {
  const desktopWidth = getDimension(desktopImage.width, 1600)
  const desktopHeight = getDimension(desktopImage.height, 900)
  const mobileWidth = getDimension(mobileSource.width, 1080)
  const mobileHeight = getDimension(mobileSource.height, 1350)

  const desktopProps = getImageProps({
    src: desktopImage.src,
    alt: altText,
    width: desktopWidth,
    height: desktopHeight,
    sizes: variant === 'home' ? '(max-width: 1023px) 100vw, 40vw' : '(max-width: 1023px) 100vw, 50vw',
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
  )
}

function HeroImageBlock({
  variant,
  image,
  imageMobile,
  hideImageOnMobile,
  className,
  fillContainer = false,
}: HeroImageBlockProps) {
  const desktopImage = image ?? imageMobile
  if (!desktopImage) {
    return null
  }

  const mobileSource = imageMobile ?? desktopImage
  const altText = mobileSource.alt || desktopImage.alt

  const visibilityClass = hideImageOnMobile ? 'hidden lg:block' : undefined

  const frameClassName = cn(
    'relative overflow-hidden bg-surface',
    variant === 'home' && ['z-10 border border-border', 'aspect-[5/4] lg:aspect-[4/3]'],
    variant === 'default' && (fillContainer ? 'h-full w-full' : 'h-full min-h-[16rem] w-full'),
  )

  const frame = (
    <div className={frameClassName}>
      <HeroImagePicture
        desktopImage={desktopImage}
        mobileSource={mobileSource}
        altText={altText}
        variant={variant}
      />
    </div>
  )

  if (variant === 'home') {
    return (
      <div className={cn('relative w-full', visibilityClass, className)}>
        <div className="flex w-full flex-col">
          {frame}
          <div aria-hidden className="flex h-[50px] w-full shrink-0">
            <div className="bg-background w-[15%] shrink-0" />
            <div className="bg-light-beige min-w-0 flex-1" />
          </div>
        </div>
      </div>
    )
  }

  return <div className={cn(fillContainer && 'h-full w-full', visibilityClass, className)}>{frame}</div>
}

function DefaultHeroShelf() {
  return (
    <div aria-hidden className="relative h-[50px] w-full shrink-0 overflow-visible">
      <div className="absolute inset-y-0 left-[calc(50%-50vw)] w-[calc(50vw+15%)] bg-background" />
      <div className="relative flex h-full w-full">
        <div className="w-[65%] shrink-0" />
        <div className="bg-light-beige w-[35%] shrink-0" />
      </div>
    </div>
  )
}

function DefaultHeroSection({
  eyebrow,
  title,
  body,
  image,
  imageMobile,
  hideImageOnMobile,
}: Omit<HeroSectionProps, 'homePageStyle'>) {
  return (
    <section className="relative bg-light-beige">
      <div className="relative mx-auto w-full max-w-site overflow-visible">
        <div className="relative overflow-visible">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[calc(50%-50vw)] z-10 hidden w-[calc(50vw-50%+1.25rem)] bg-beige lg:block"
          />
          <div className="relative px-6 py-12 md:px-12 lg:py-16 lg:pr-0">
          <div className="flex flex-col gap-6 lg:max-w-[calc(50%-1.5rem)] lg:pl-2">
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
          </div>

          <div
            className={cn(
              'relative mt-8 min-h-[16rem] w-full lg:mt-0',
              hideImageOnMobile ? 'hidden' : 'lg:hidden',
            )}
          >
            <HeroImageBlock variant="default" image={image} imageMobile={imageMobile} />
          </div>
        </div>

          <HeroImageBlock
            variant="default"
            image={image}
            imageMobile={imageMobile}
            hideImageOnMobile={hideImageOnMobile}
            fillContainer
            className="absolute top-0 right-0 bottom-0 hidden w-1/2 lg:block"
          />
        </div>

        <DefaultHeroShelf />
      </div>
    </section>
  )
}

function HomeHeroSection({
  eyebrow,
  title,
  body,
  image,
  imageMobile,
  hideImageOnMobile,
}: Omit<HeroSectionProps, 'homePageStyle'>) {
  return (
    <section className="relative bg-background">
      <div className="mx-auto grid w-full max-w-site gap-8 px-6 py-12 md:px-12 lg:grid-cols-[3fr_2fr] lg:gap-12 lg:py-16">
        <div className="flex flex-col gap-6">
          {eyebrow ? (
            <p className="text-muted-foreground font-semibold uppercase tracking-wide">{eyebrow}</p>
          ) : null}
          <h1 className="hero-primary-heading text-foreground font-medium leading-tight tracking-tight">
            {title}
          </h1>
          {body ? (
            <div className="text-foreground/90 max-w-none space-y-4 leading-relaxed">
              <PortableText value={body as never} />
            </div>
          ) : null}
        </div>
        <HeroImageBlock
          variant="home"
          image={image}
          imageMobile={imageMobile}
          hideImageOnMobile={hideImageOnMobile}
        />
      </div>
    </section>
  )
}

export function HeroSection({homePageStyle = false, ...props}: HeroSectionProps) {
  if (homePageStyle) {
    return <HomeHeroSection {...props} />
  }
  return <DefaultHeroSection {...props} />
}
