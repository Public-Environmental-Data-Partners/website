import {defineField} from 'sanity'

/** Plain paragraph block for news post body and list row rich text. */
export const articleBodyPortableTextBlock = {
  type: 'block',
  marks: {
    annotations: [
      {
        name: 'link',
        type: 'object',
        fields: [defineField({name: 'href', type: 'url'})],
      },
    ],
  },
} as const

/** Caption under article figures — paragraphs, bold, links. */
export const articleCaptionPortableTextBlock = {
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks: {
    decorators: [{title: 'Strong', value: 'strong'}],
    annotations: [
      {
        name: 'link',
        type: 'object',
        fields: [defineField({name: 'href', type: 'url'})],
      },
    ],
  },
} as const

/** Row / paragraph content inside listBlock divided variants. */
export const listRowPortableTextBlock = {
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks: {
    decorators: [{title: 'Strong', value: 'strong'}],
    annotations: [
      {
        name: 'link',
        type: 'object',
        fields: [defineField({name: 'href', type: 'url'})],
      },
    ],
  },
} as const
