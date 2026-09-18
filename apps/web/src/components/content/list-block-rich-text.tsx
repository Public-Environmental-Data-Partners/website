import {defaultComponents, mergeComponents, type PortableTextComponents} from '@portabletext/react'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {BODY_LG_CLASS} from '@/lib/typography'
import {cn} from '@/lib/utils'

/** Rich text inside list-block rows — Figtree 22px / 1.3 leading. */
export const listBlockRichTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className={cn(BODY_LG_CLASS, 'm-0 [&+p]:mt-3')}>{children}</p>
    ),
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: contentLinkMark('underline-offset-[0.15em]'),
  },
}

export const listBlockPortableTextComponents = mergeComponents(
  defaultComponents,
  listBlockRichTextComponents,
)
