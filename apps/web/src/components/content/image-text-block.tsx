import type {PortableTextBlock} from '@portabletext/react'

import {ArticleFigure} from '@/components/content/article-figure'
import {RichTextBlock} from '@/components/content/rich-text-block'
import type {HeroImage} from '@/components/hero/hero-image'
import {Grid12} from '@/components/layout'
import {ARTICLE_COL_10_CENTERED_CLASS} from '@/lib/article-body-grid'
import {cn} from '@/lib/utils'

export type ImageTextBlockPosition = 'left' | 'right'

type ImageTextBlockProps = {
  image: HeroImage
  photoCredit?: string | null
  body: PortableTextBlock[]
  imagePosition?: ImageTextBlockPosition
}

const IMAGE_COL_MOBILE_TABLET = 'col-span-6 order-1 min-w-0'
const TEXT_COL_MOBILE_TABLET = 'col-span-6 order-2 min-w-0'

/** In-body image + text — 4+6 in 10-col band @ desktop; 6+6 @ tablet/mobile; image first on small screens. */
export function ImageTextBlock({
  image,
  photoCredit,
  body,
  imagePosition = 'left',
}: ImageTextBlockProps) {
  const imageRight = imagePosition === 'right'

  const imageColClass = cn(
    IMAGE_COL_MOBILE_TABLET,
    imageRight
      ? 'lg:col-span-4 lg:col-start-7 lg:order-2'
      : 'lg:col-span-4 lg:col-start-1 lg:order-1',
  )

  const textColClass = cn(
    TEXT_COL_MOBILE_TABLET,
    imageRight
      ? 'lg:col-span-6 lg:col-start-1 lg:order-1'
      : 'lg:col-span-6 lg:col-start-5 lg:order-2',
  )

  return (
    <Grid12 data-slot="article-image-text-block" className="min-w-0">
      <div className={cn(ARTICLE_COL_10_CENTERED_CLASS, 'min-w-0')}>
        <div className="grid grid-cols-12 items-start gap-[var(--grid-gutter)] lg:grid-cols-10">
          <div className={imageColClass}>
            <ArticleFigure
              creditAlign="left"
              image={image}
              imageSize="imageText4"
              photoCredit={photoCredit}
            />
          </div>
          <div className={textColClass}>
            <RichTextBlock value={body} />
          </div>
        </div>
      </div>
    </Grid12>
  )
}
