import {defineField, defineType} from 'sanity'

function loadCountFields(prefix: string) {
  return [
    defineField({
      name: 'desktop',
      title: 'Desktop',
      type: 'number',
      description: `${prefix} count at ≥1024px (3-column grid).`,
      initialValue: 9,
      validation: (Rule) => Rule.required().min(1).integer().max(48),
    }),
    defineField({
      name: 'tablet',
      title: 'Tablet',
      type: 'number',
      description: `${prefix} count at 768–1023px (2-column grid).`,
      initialValue: 6,
      validation: (Rule) => Rule.required().min(1).integer().max(48),
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile',
      type: 'number',
      description: `${prefix} count below 768px (1-column list).`,
      initialValue: 3,
      validation: (Rule) => Rule.required().min(1).integer().max(48),
    }),
  ]
}

export const newsHubPage = defineType({
  name: 'newsHubPage',
  title: 'News & updates — Hub',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Centered page heading, e.g. “News & Updates”.',
      validation: (Rule) => Rule.required().max(80).warning('Consider ≤ 80 chars.'),
      initialValue: 'News & Updates',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 4,
      description: 'Centered supporting paragraph under the title.',
      validation: (Rule) => Rule.required().max(500).warning('Consider ≤ 500 chars.'),
    }),
    defineField({
      name: 'initialLoad',
      title: 'Initial load counts',
      type: 'object',
      description: 'How many posts to show on first paint, per breakpoint.',
      fields: loadCountFields('Initial'),
      options: {columns: 3},
    }),
    defineField({
      name: 'loadMore',
      title: 'Load more counts',
      type: 'object',
      description:
        'How many additional posts to fetch each time Load More is clicked, per breakpoint.',
      fields: loadCountFields('Load more'),
      options: {columns: 3},
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      options: {collapsible: true, collapsed: true},
      description:
        'Optional overrides for search and link previews. Leave empty to use the hub title and site default description; shares use the PEDP logo card.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: 'News & updates — Hub',
        subtitle: title?.trim() || 'Hub page',
      }
    },
  },
})
