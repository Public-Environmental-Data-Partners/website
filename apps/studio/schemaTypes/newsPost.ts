import {defineField, defineType} from 'sanity'

/** Match Sanity client / Vision; used only for validation queries. */
const STUDIO_API_VERSION = '2024-01-01'

function siblingDocumentIds(documentId: string | undefined): string[] {
  if (!documentId) {
    return []
  }
  const base = documentId.startsWith('drafts.') ? documentId.slice(7) : documentId
  return Array.from(new Set([documentId, `drafts.${base}`, base]))
}

const newsPostBodyBlock = {
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

export const newsPost = defineType({
  name: 'newsPost',
  title: 'News post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(160).warning('Consider ≤ 160 chars.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Short URL segment only — the site adds /news-and-updates/. Set before publish date; locked once both are filled.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      readOnly: ({document, value}) => {
        const publishedAt = document?.publishedAt
        const hasPublishedAt = typeof publishedAt === 'string' && publishedAt.trim().length > 0
        const slugCurrent =
          value && typeof value === 'object' && 'current' in value
            ? String((value as {current?: string | null}).current ?? '').trim()
            : ''
        return hasPublishedAt && slugCurrent.length > 0
      },
      validation: (Rule) =>
        Rule.required().custom(async (slug, context) => {
          const current =
            slug && typeof slug === 'object' && 'current' in slug
              ? String((slug as {current?: string | null}).current ?? '').trim()
              : ''
          if (!current) {
            return true
          }
          const {document, getClient} = context
          const client = getClient({apiVersion: STUDIO_API_VERSION})
          const exclude = siblingDocumentIds(document?._id)
          const count = await client.fetch<number>(
            `count(*[_type == "newsPost" && slug.current == $slug && !(_id in $exclude)])`,
            {slug: current, exclude},
          )
          return count === 0 || 'Another post already uses this slug.'
        }),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      description: 'Hub sort order; detail “published …” line; listing “Published: …”.',
    }),
    defineField({
      name: 'postType',
      title: 'Post type',
      type: 'string',
      options: {
        list: [{title: 'Article', value: 'article'}],
        layout: 'radio',
      },
      initialValue: 'article',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      validation: (Rule) => Rule.max(40).warning('Keep this short (≤ 40 chars).'),
      description: 'Shared on hub listing row and article detail hero.',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.max(120).warning('Consider ≤ 120 chars.'),
      description: 'Article detail only — e.g. “by Jane Doe”.',
    }),
    defineField({
      name: 'image',
      title: 'Hero image',
      type: 'image',
      validation: (Rule) => Rule.required(),
      description:
        'Shared on hub listing and article detail. Target ~500×400px display; upload at least 1000px wide.',
      options: {hotspot: true},
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
      name: 'teaser',
      title: 'Hub teaser',
      type: 'newsPostTeaserFields',
      validation: (Rule) => Rule.required(),
      description: 'Listing-only copy — excerpt and tags.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [newsPostBodyBlock],
      description: 'Article content below the detail hero.',
    }),
  ],
  orderings: [
    {
      title: 'Published date, newest',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      media: 'image',
    },
    prepare({title, publishedAt, media}) {
      const date =
        typeof publishedAt === 'string'
          ? new Date(publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : undefined
      return {
        title: title?.trim() || 'News post',
        subtitle: date ? `Published ${date}` : 'Draft',
        media,
      }
    },
  },
})
