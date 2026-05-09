import {defineField, defineType} from 'sanity'

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
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
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
      of: [{type: 'simpleSection'}],
      description:
        'Ordered sections that make up this page. Start with one section; you can add and reorder more over time.',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})
