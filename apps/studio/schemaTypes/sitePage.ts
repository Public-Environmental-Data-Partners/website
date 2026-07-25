import {defineField, defineType} from 'sanity'

import {contentLinkAnnotation} from './contentLink'

/** Match Sanity client / Vision; used only for validation queries. */
const STUDIO_API_VERSION = '2024-01-01'

/** Published id + drafts.* pair for the document being edited (validation context). */
function siblingDocumentIds(documentId: string | undefined): string[] {
  if (!documentId) {
    return []
  }
  const base = documentId.startsWith('drafts.') ? documentId.slice(7) : documentId
  return Array.from(new Set([documentId, `drafts.${base}`, base]))
}

const sectionPortableTextBlock = {
  type: 'block',
  marks: {
    annotations: [contentLinkAnnotation],
  },
} as const

export const simpleSection = defineType({
  name: 'simpleSection',
  title: 'Simple section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [sectionPortableTextBlock],
      validation: (Rule) => Rule.required(),
    }),
  ],
})

/**
 * Legal / policy document body (Privacy Policy, Terms, etc.).
 * Page title is the only heading — Figtree Bold 22, centered, uppercase on the site.
 */
export const legalDocumentSection = defineType({
  name: 'legalDocumentSection',
  title: 'Legal document section',
  type: 'object',
  fields: [
    defineField({
      name: 'lastUpdated',
      title: 'Last updated',
      type: 'date',
      description: 'Shown under the page title (e.g. “LAST UPDATED: March 17, 2025”).',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [sectionPortableTextBlock],
      description: 'Policy copy. Use Email / External / Internal links as needed.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      lastUpdated: 'lastUpdated',
      body: 'body',
    },
    prepare({lastUpdated, body}) {
      const blockCount = Array.isArray(body) ? body.length : 0
      return {
        title: 'Legal document',
        subtitle: lastUpdated
          ? `Updated ${lastUpdated} · ${blockCount} block${blockCount === 1 ? '' : 's'}`
          : `${blockCount} block${blockCount === 1 ? '' : 's'}`,
      }
    },
  },
})

export const sitePage = defineType({
  name: 'sitePage',
  title: 'Site page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      description:
        'Browser tab title and on-page heading. For legal document pages, rendered centered in all caps (e.g. PRIVACY POLICY).',
      validation: (Rule) =>
        Rule.required()
          .max(160)
          .custom(async (title, context) => {
            const t = typeof title === 'string' ? title.trim() : ''
            if (!t) {
              return true
            }
            const {document, getClient} = context
            const client = getClient({apiVersion: STUDIO_API_VERSION})
            const exclude = siblingDocumentIds(document?._id)
            const count = await client.fetch<number>(
              `count(*[_type == "sitePage" && lower(title) == lower($title) && !(_id in $exclude)])`,
              {title: t, exclude},
            )
            return count === 0 || 'Another page already uses this title (titles are unique).'
          }),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
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
            `count(*[_type == "sitePage" && slug.current == $slug && !(_id in $exclude)])`,
            {slug: current, exclude},
          )
          return count === 0 || 'Another page already uses this slug (URLs must be unique).'
        }),
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {type: 'simpleSection'},
        {type: 'legalDocumentSection'},
        {type: 'byTheNumbersSection'},
        {type: 'testimonialSection'},
      ],
      description:
        'Ordered sections that make up this page. Use Legal document section for Privacy Policy, Terms, and similar pages.',
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((sections) => {
            if (!Array.isArray(sections)) {
              return true
            }
            const legalCount = sections.filter(
              (section) =>
                section &&
                typeof section === 'object' &&
                '_type' in section &&
                section._type === 'legalDocumentSection',
            ).length
            if (legalCount > 1) {
              return 'Use only one Legal document section per page.'
            }
            if (legalCount === 1 && sections.length > 1) {
              return 'A Legal document section must be the only section on the page.'
            }
            return true
          }),
    }),
  ],
})
