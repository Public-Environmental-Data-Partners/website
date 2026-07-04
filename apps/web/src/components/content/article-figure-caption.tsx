import {PortableText, type PortableTextBlock} from '@portabletext/react'

import {articleFigureCaptionPortableTextComponents} from '@/components/content/article-figure-caption-portable-text'

type ArticleFigureCaptionProps = {
  value: PortableTextBlock[]
}

export function ArticleFigureCaption({value}: ArticleFigureCaptionProps) {
  if (!value.length) {
    return null
  }

  return (
    <div data-slot="article-figure-caption">
      <PortableText components={articleFigureCaptionPortableTextComponents} value={value} />
    </div>
  )
}
