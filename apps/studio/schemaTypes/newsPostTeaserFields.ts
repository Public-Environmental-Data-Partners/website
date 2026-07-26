import {defineArrayMember, defineField, defineType} from 'sanity'

/** Hub listing-only fields — eyebrow, title, image, date live on the newsPost document. */
export const newsPostTeaserFields = defineType({
  name: 'newsPostTeaserFields',
  title: 'Hub teaser',
  type: 'object',
  fields: [
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
      description:
        'Shown on News & Updates hub cards. Also used as the default meta description when SEO is empty.',
      validation: (Rule) =>
        Rule.required().max(500).warning('Consider ≤ 500 chars for the hub listing.'),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description:
        'Optional. Stored in CMS but not currently displayed on hub cards or article pages.',
      validation: (Rule) => Rule.max(5).warning('Consider ≤ 5 tags.'),
      options: {layout: 'tags'},
    }),
  ],
  preview: {
    select: {
      title: 'excerpt',
    },
    prepare({title}) {
      return {
        title: title?.trim()?.slice(0, 60) || 'Hub teaser',
      }
    },
  },
})
