import {defineArrayMember, defineField, defineType} from 'sanity'

import {articleBodyPortableTextBlock} from './articlePortableText'

/** Match Sanity client / Vision; used only for validation queries. */
const STUDIO_API_VERSION = '2024-01-01'

function siblingDocumentIds(documentId: string | undefined): string[] {
  if (!documentId) {
    return []
  }
  const base = documentId.startsWith('drafts.') ? documentId.slice(7) : documentId
  return Array.from(new Set([documentId, `drafts.${base}`, base]))
}

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
      description:
        'Required for the post to appear on the hub (newest first). Shown on the article hero and similar-post cards as MM.DD.YY. Not shown on hub listing cards.',
    }),
    defineField({
      name: 'postType',
      title: 'Post type',
      type: 'string',
      options: {
        list: [
          {title: 'Article', value: 'article'},
          {title: 'News', value: 'news'},
          {title: 'Blog', value: 'blog'},
          {title: 'Story', value: 'story'},
        ],
        layout: 'radio',
      },
      initialValue: 'article',
      validation: (Rule) => Rule.required(),
      description: 'Shown as the category label on News & Updates hub cards (e.g. ARTICLE, BLOG).',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      validation: (Rule) => Rule.max(40).warning('Keep this short (≤ 40 chars).'),
      description:
        'Shared on the article hero. This is also displayed as the Series Name when this post appears in Similar Posts.',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.max(120).warning('Consider ≤ 120 chars.'),
      description:
        'Optional. Used in article structured data / link metadata when set. Not shown as a byline on the article page.',
    }),
    defineField({
      name: 'image',
      title: 'Hero image',
      type: 'image',
      validation: (Rule) => Rule.required(),
      description:
        'Shared on hub listing and article detail. Upload at least 1900px wide at a 3:2 aspect ratio (e.g. 1900×1267). Use the hotspot to control the crop.',
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
        defineField({
          name: 'credit',
          title: 'Photo credit',
          type: 'string',
          description:
            'Optional. Article detail hero only — shown as “PHOTO CREDIT: …” below the image.',
          validation: (Rule) => Rule.max(120).warning('Consider ≤ 120 chars.'),
        }),
      ],
    }),
    defineField({
      name: 'teaser',
      title: 'Hub teaser',
      type: 'newsPostTeaserFields',
      validation: (Rule) => Rule.required(),
      description:
        'Listing-only excerpt for hub cards and default SEO description. Tags are optional and not currently shown on the site.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO & sharing',
      type: 'seoFields',
      options: {collapsible: true, collapsed: true},
      description:
        'Optional overrides for search and link previews (iMessage, Slack, etc.). Leave empty to use the title, hub excerpt, and hero image (or the PEDP logo card when no hero).',
    }),
    defineField({
      name: 'audio',
      title: 'Article audio',
      type: 'newsPostAudio',
      description:
        'Optional listen row below the hero on the article page. Leave the file empty to hide it. Requires SEO & sharing (meta description) or hub excerpt so the share control can render.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        articleBodyPortableTextBlock,
        defineArrayMember({type: 'quoteBlock'}),
        defineArrayMember({type: 'imageBlock'}),
        defineArrayMember({type: 'twoImageBlock'}),
        defineArrayMember({type: 'imageTextBlock'}),
        defineArrayMember({type: 'embedBlock'}),
        defineArrayMember({type: 'listBlock'}),
      ],
      description: 'Article content below the detail hero.',
    }),
    defineField({
      name: 'similarPosts',
      title: 'Similar posts',
      type: 'array',
      description:
        'Optional posts shown at the bottom of this article. Add as many as needed and drag to set their display order. Each selected post’s Eyebrow is displayed as its Series Name.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'newsPost'}],
          options: {
            filter: ({document}) => {
              const currentId = document?._id?.replace(/^drafts\./, '')
              if (!currentId) {
                return {}
              }
              return {
                filter: '_id != $publishedId && _id != $draftId',
                params: {
                  publishedId: currentId,
                  draftId: `drafts.${currentId}`,
                },
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.unique(),
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
