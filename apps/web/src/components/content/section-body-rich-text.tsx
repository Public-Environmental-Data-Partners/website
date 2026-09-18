import {defaultComponents, mergeComponents, type PortableTextComponents} from '@portabletext/react'
import type {ReactNode} from 'react'

import {contentLinkMark} from '@/components/content/portable-text-link'
import {BODY_LG_CLASS} from '@/lib/typography'
import {cn} from '@/lib/utils'

/**
 * Site-page section body copy — Figtree Regular 22 / 1.3, bold lead-ins at 700.
 * Shared by About intro, Text + image rows, and Simple section.
 */
export const sectionBodyPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({children}: {children?: ReactNode}) => (
      <p className={cn(BODY_LG_CLASS, 'text-off-black mb-6 font-normal last:mb-0')}>{children}</p>
    ),
  },
  list: {
    bullet: ({children}: {children?: ReactNode}) => (
      <ul
        className={cn(
          BODY_LG_CLASS,
          'text-off-black mb-6 list-disc space-y-3 ps-6 font-normal last:mb-0',
        )}
      >
        {children}
      </ul>
    ),
    number: ({children}: {children?: ReactNode}) => (
      <ol
        className={cn(
          BODY_LG_CLASS,
          'text-off-black mb-6 list-decimal space-y-3 ps-6 font-normal last:mb-0',
        )}
      >
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({children}: {children?: ReactNode}) => <li>{children}</li>,
    number: ({children}: {children?: ReactNode}) => <li>{children}</li>,
  },
  marks: {
    strong: ({children}: {children?: ReactNode}) => (
      <strong className="font-bold">{children}</strong>
    ),
    link: contentLinkMark('text-off-black'),
  },
}

export const sectionBodyRichTextComponents = mergeComponents(
  defaultComponents,
  sectionBodyPortableTextComponents,
)
