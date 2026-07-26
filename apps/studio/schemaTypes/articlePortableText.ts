import {contentLinkAnnotation} from './contentLink'

/**
 * Article body Portable Text — Option A styles.
 * H1/H5 omitted (hero owns page H1; H5 ≤ body). Pull quotes use `quoteBlock`.
 * Spec: docs/architecture/article-components.md
 */
export const articleBodyPortableTextBlock = {
  type: 'block',
  styles: [
    {title: 'Normal', value: 'normal'},
    {title: 'Heading 2', value: 'h2'},
    {title: 'Heading 3', value: 'h3'},
    {title: 'Heading 4', value: 'h4'},
  ],
  marks: {
    annotations: [contentLinkAnnotation],
  },
} as const

/** Caption under article figures — paragraphs, bold, links. */
export const articleCaptionPortableTextBlock = {
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks: {
    decorators: [{title: 'Strong', value: 'strong'}],
    annotations: [contentLinkAnnotation],
  },
} as const

/** imageTextBlock body — paragraphs, bold, links. */
export const articleImageTextBodyPortableTextBlock = {
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks: {
    decorators: [{title: 'Strong', value: 'strong'}],
    annotations: [contentLinkAnnotation],
  },
} as const

/** Row / paragraph content inside listBlock divided variants. */
export const listRowPortableTextBlock = {
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks: {
    decorators: [{title: 'Strong', value: 'strong'}],
    annotations: [contentLinkAnnotation],
  },
} as const

export {contentLinkAnnotation}
