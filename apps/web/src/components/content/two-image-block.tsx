import type {PortableTextBlock} from '@portabletext/react'

import {ArticleFigure} from '@/components/content/article-figure'
import type {HeroImage} from '@/components/hero/hero-image'
import {Grid12} from '@/components/layout'
import {ARTICLE_COL_6_PAIR_CLASS} from '@/lib/article-body-grid'
import {cn} from '@/lib/utils'

export type TwoImageBlockItemProps = {
  image: HeroImage
  photoCredit?: string
  caption?: PortableTextBlock[]
}

type TwoImageBlockProps = {
  items: TwoImageBlockItemProps[]
}

/** Two-up in-body figures — 6+6 @ md+, stacked @ mobile. */
export function TwoImageBlock({items}: TwoImageBlockProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <Grid12 data-slot="article-two-image-block" className="min-w-0">
      {items.map((item, index) => (
        <div
          key={`two-image-${index}`}
          className={cn(ARTICLE_COL_6_PAIR_CLASS, 'min-w-0')}
        >
          <ArticleFigure
            caption={item.caption}
            creditAlign="left"
            image={item.image}
            imageSize="duo6"
            photoCredit={item.photoCredit}
          />
        </div>
      ))}
    </Grid12>
  )
}
