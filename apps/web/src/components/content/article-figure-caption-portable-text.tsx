import {defaultComponents, mergeComponents, type PortableTextComponents} from '@portabletext/react'

import {contentLinkMark} from '@/components/content/portable-text-link'

/** Caption copy under article figures — Figtree 24px / 100% LH (article-body-images plan). */
export const articleFigureCaptionComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="m-0 leading-none [&+p]:mt-3">{children}</p>
    ),
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark('text-accent underline underline-offset-[0.15em]'),
  },
}

export const articleFigureCaptionPortableTextComponents = mergeComponents(
  defaultComponents,
  articleFigureCaptionComponents,
)
