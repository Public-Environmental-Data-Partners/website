import {PortableText, type PortableTextBlock} from '@portabletext/react'

import {articleRichTextComponents} from '@/components/content/article-portable-text'

type RichTextBlockProps = {
  value: PortableTextBlock[]
}

export function RichTextBlock({value}: RichTextBlockProps) {
  if (!value.length) {
    return null
  }

  return <PortableText components={articleRichTextComponents} value={value} />
}
