import {defineField, defineType} from 'sanity'

import {articleImageTextBodyPortableTextBlock} from './articlePortableText'

export const imageTextBlock = defineType({
  name: 'imageTextBlock',
  title: 'Image + text',
  type: 'object',
  fields: [
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      options: {
        list: [
          {title: 'Image left', value: 'left'},
          {title: 'Image right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
      description: 'Upload 4:3 at min 900px wide; use hotspot to adjust crop.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) =>
            Rule.required()
              .max(160)
              .warning('Keep alt text concise and descriptive (≤ 160 chars).'),
        }),
      ],
    }),
    defineField({
      name: 'photoCredit',
      title: 'Photo credit',
      type: 'string',
      description: 'Optional — shown as “PHOTO CREDIT: …” below the image.',
      validation: (Rule) => Rule.max(120).warning('Consider ≤ 120 chars.'),
    }),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [articleImageTextBodyPortableTextBlock],
    }),
  ],
  preview: {
    select: {
      media: 'image',
      imagePosition: 'imagePosition',
    },
    prepare({media, imagePosition}) {
      const side = imagePosition === 'right' ? 'Image right' : 'Image left'
      return {
        title: 'Image + text',
        subtitle: side,
        media,
      }
    },
  },
})
