import {defineField, defineType} from 'sanity'

/** Shared optional SEO title + description for pages and posts. */
export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      description: 'Browser tab / search title. Leave empty to use the document title.',
      validation: (Rule) => Rule.max(70).warning('Consider ≤ 70 chars for search results.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description:
        'Search snippet and link-preview text. Leave empty to use the site default (or hub excerpt on news posts).',
      validation: (Rule) => Rule.max(160).warning('Consider ≤ 160 chars.'),
    }),
  ],
})
