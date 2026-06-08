import {defineField, defineType} from 'sanity'

export const embedBlock = defineType({
  name: 'embedBlock',
  title: 'Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Share link from a supported provider (v1: YouTube watch or youtu.be links).',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional line below the embed.',
      validation: (Rule) => Rule.max(200).warning('Consider ≤ 200 chars.'),
    }),
  ],
  preview: {
    select: {
      url: 'url',
      caption: 'caption',
    },
    prepare({url, caption}) {
      const href = typeof url === 'string' ? url.trim() : ''
      const label = typeof caption === 'string' && caption.trim().length > 0 ? caption.trim() : href
      return {
        title: label || 'Embed',
        subtitle: href ? 'Video / iframe embed' : 'Add a supported URL',
      }
    },
  },
})
