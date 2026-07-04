import type {PortableTextBlock} from '@portabletext/react'

import {ArticleFigure} from '@/components/content/article-figure'
import {ArticleFigureCaption} from '@/components/content/article-figure-caption'
import type {HeroImage} from '@/components/hero/hero-image'
import {Grid12} from '@/components/layout'
import {ARTICLE_COL_4_CENTERED_CLASS, ARTICLE_COL_10_CENTERED_CLASS} from '@/lib/article-body-grid'
import {cn} from '@/lib/utils'

type ImageBlockProps = {
  image: HeroImage
  photoCredit?: string | null
  caption?: PortableTextBlock[]
}

/** Single in-body image — 10-col figure, optional 4-col centered caption @ desktop. */
export function ImageBlock({image, photoCredit, caption}: ImageBlockProps) {
  const captionBlocks = caption ?? []
  const hasCaption = captionBlocks.length > 0

  return (
    <Grid12 data-slot="article-image-block" className="min-w-0">
      <div className={cn(ARTICLE_COL_10_CENTERED_CLASS, 'min-w-0')}>
        <ArticleFigure
          creditClassName="text-left md:text-center"
          image={image}
          imageSize="single10"
          photoCredit={photoCredit}
        />
      </div>
      {hasCaption ? (
        <div className={cn(ARTICLE_COL_4_CENTERED_CLASS, 'min-w-0')}>
          <ArticleFigureCaption value={captionBlocks} />
        </div>
      ) : null}
    </Grid12>
  )
}
