import type {PortableTextBlock} from '@portabletext/react'
import Image from 'next/image'

import {ArticleFigureCaption} from '@/components/content/article-figure-caption'
import {
  ArticlePhotoCredit,
  type ArticlePhotoCreditAlign,
} from '@/components/content/article-photo-credit'
import type {HeroImage} from '@/components/hero/hero-image'
import {
  ARTICLE_FIGURE_ASPECT_HEIGHT,
  ARTICLE_FIGURE_ASPECT_WIDTH,
  ARTICLE_FIGURE_IMAGE_SIZES,
  type ArticleFigureImageSize,
} from '@/lib/mappers/article-figure'
import {cn} from '@/lib/utils'

export type ArticleFigureProps = {
  image: HeroImage
  photoCredit?: string | null
  creditAlign?: ArticlePhotoCreditAlign
  creditClassName?: string
  caption?: PortableTextBlock[] | null
  imageSize?: ArticleFigureImageSize
  priority?: boolean
  className?: string
}

export function ArticleFigure({
  image,
  photoCredit,
  creditAlign = 'left',
  creditClassName,
  caption,
  imageSize = 'single10',
  priority = false,
  className,
}: ArticleFigureProps) {
  const captionBlocks = Array.isArray(caption) ? caption : []
  const hasCaption = captionBlocks.length > 0
  const credit = photoCredit?.trim()

  return (
    <figure data-slot="article-figure" className={cn('m-0 min-w-0', className)}>
      <div data-slot="article-figure-image-frame">
        <Image
          alt={image.alt}
          src={image.src}
          fill
          className="object-cover"
          sizes={ARTICLE_FIGURE_IMAGE_SIZES[imageSize]}
          priority={priority}
        />
      </div>
      {credit ? (
        <ArticlePhotoCredit credit={credit} align={creditAlign} className={creditClassName} />
      ) : null}
      {hasCaption ? <ArticleFigureCaption value={captionBlocks} /> : null}
    </figure>
  )
}

export {
  ARTICLE_FIGURE_ASPECT_HEIGHT,
  ARTICLE_FIGURE_ASPECT_WIDTH,
  ARTICLE_FIGURE_IMAGE_SIZES,
  type ArticleFigureImageSize,
}
