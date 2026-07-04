import {defineField, defineType} from 'sanity'

import {articleCaptionPortableTextBlock} from './articlePortableText'

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
      description:
        'Upload 4:3 at min 1400px wide. Set hotspot in Studio to control the crop in the 4:3 frame.',
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
      name: 'caption',
      title: 'Caption',
      type: 'array',
      of: [articleCaptionPortableTextBlock],
      description: 'Optional copy below the photo credit.',
    }),
  ],
  preview: {
    select: {
      media: 'image',
      photoCredit: 'photoCredit',
    },
    prepare({media, photoCredit}) {
      const credit = typeof photoCredit === 'string' ? photoCredit.trim() : ''
      return {
        title: 'Image block',
        subtitle: credit ? `PHOTO CREDIT: ${credit}` : 'Article image',
        media,
      }
    },
  },
})
