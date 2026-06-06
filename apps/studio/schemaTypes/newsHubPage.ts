import {defineField, defineType} from 'sanity'

export const newsHubPage = defineType({
  name: 'newsHubPage',
  title: 'News & updates — Hub',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'splitHeroBleedFields',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({
          name: 'title',
          title: 'Page title',
          type: 'string',
          description: 'Browser tab / search title. Defaults to “News & updates” when empty.',
          validation: (Rule) => Rule.max(70).warning('Consider ≤ 70 chars for search results.'),
        }),
        defineField({
          name: 'description',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160).warning('Consider ≤ 160 chars.'),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      heroTitle: 'hero.title',
      heroEyebrow: 'hero.eyebrow',
    },
    prepare({heroTitle, heroEyebrow}) {
      return {
        title: 'News & updates — Hub',
        subtitle: heroTitle?.trim()
          ? [heroEyebrow?.trim(), heroTitle.trim()].filter(Boolean).join(' · ')
          : 'Hub page',
      }
    },
  },
})
