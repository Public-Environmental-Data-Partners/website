import {getImageProps} from 'next/image'

import {cn} from '@/lib/utils'

export type HeroImage = {
  src: string
  alt: string
  width?: number
  height?: number
}

export type HeroImageVariant = 'home' | 'default' | 'split'

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

function getDesktopSizes(variant: HeroImageVariant) {
  if (variant === 'home') {
    return '(max-width: 1023px) 100vw, 40vw'
  }
  if (variant === 'split') {
    return '(max-width: 767px) 100vw, (max-width: 87.5rem) 50vw, 700px'
  }
  return '(max-width: 1023px) 100vw, 50vw'
}

function getMobileMedia(variant: HeroImageVariant) {
  return variant === 'split' ? '(max-width: 767px)' : '(max-width: 1023px)'
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
  const desktopWidth = getDimension(desktopImage.width, variant === 'split' ? 700 : 1600)
  const desktopHeight = getDimension(desktopImage.height, variant === 'split' ? 650 : 900)
  const mobileWidth = getDimension(mobileSource.width, 1080)
  const mobileHeight = getDimension(mobileSource.height, 1350)

  const desktopProps = getImageProps({
    src: desktopImage.src,
    alt: altText,
    width: desktopWidth,
    height: desktopHeight,
    sizes: getDesktopSizes(variant),
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
      <source media={getMobileMedia(variant)} srcSet={mobileSrcSet} />
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
    variant === 'split' && 'h-full w-full',
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

  if (variant === 'split') {
    return frame
  }

  return (
    <div className={cn(fillContainer && 'h-full w-full', visibilityClass, className)}>{frame}</div>
  )
}

export {HeroImageBlock}
