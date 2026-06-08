import {defineField, defineType} from 'sanity'

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
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(500).warning('Consider ≤ 500 chars.'),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Credit line — shown as “Source: …” in serif italic.',
      validation: (Rule) => Rule.max(120).warning('Consider ≤ 120 chars.'),
    }),
  ],
  preview: {
    select: {
      caption: 'caption',
      media: 'image',
      source: 'source',
    },
    prepare({caption, media, source}) {
      const excerpt = typeof caption === 'string' ? caption.trim().slice(0, 60) : ''
      const credit =
        typeof source === 'string' && source.trim().length > 0 ? `Source: ${source.trim()}` : ''
      return {
        title: excerpt || 'Image block',
        subtitle: credit || 'Article image',
        media,
      }
    },
  },
})
