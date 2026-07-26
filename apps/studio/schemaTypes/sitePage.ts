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

export const contactCta = defineType({
  name: 'contactCta',
  title: 'CTA button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button label',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'link',
      title: 'Button link',
      type: 'contentLink',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {label: 'label'},
    prepare({label}) {
      return {title: label?.trim() || 'CTA button'}
    },
  },
})

/**
 * Contact page hero. The page title is the only heading; this block owns the
 * CMS-managed illustration.
 */
export const contactHero = defineType({
  name: 'contactHero',
  title: 'Contact hero',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Illustration',
      type: 'image',
      validation: (Rule) => Rule.required(),
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.required().max(160),
        }),
      ],
    }),
  ],
  preview: {
    select: {media: 'image'},
    prepare({media}) {
      return {title: 'Contact hero', media}
    },
  },
})

/**
 * About page intro. The page title is the only heading; this block owns the
 * body copy and CMS-managed illustration.
 */
export const aboutIntro = defineType({
  name: 'aboutIntro',
  title: 'About intro',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [sectionPortableTextBlock],
      description: 'Mission copy, bullets, and closing paragraphs.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'image',
      title: 'Illustration',
      type: 'image',
      validation: (Rule) => Rule.required(),
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.required().max(160),
        }),
      ],
    }),
  ],
  preview: {
    select: {media: 'image', body: 'body'},
    prepare({media, body}) {
      const blockCount = Array.isArray(body) ? body.length : 0
      return {
        title: 'About intro',
        subtitle: `${blockCount} block${blockCount === 1 ? '' : 's'}`,
        media,
      }
    },
  },
})

/**
 * Full-width contact card. Editors can place CTA button blocks anywhere in
 * the rich-text flow (for example, between support copy and a GitHub note).
 */
export const contactSection = defineType({
  name: 'contactSection',
  title: 'Contact section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      description: 'Short uppercase section label.',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [sectionPortableTextBlock, {type: 'contactCta'}],
      description: 'Add CTA button blocks wherever buttons should appear between paragraphs.',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {sectionHeading: 'sectionHeading', body: 'body'},
    prepare({sectionHeading, body}) {
      const blockCount = Array.isArray(body) ? body.length : 0
      return {
        title: sectionHeading?.trim() || 'Contact section',
        subtitle: `${blockCount} block${blockCount === 1 ? '' : 's'}`,
      }
    },
  },
})

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
        {type: 'aboutIntro'},
        {type: 'contactHero'},
        {type: 'contactSection'},
        {type: 'donateFormSection'},
        {type: 'donateInfoSection'},
        {type: 'donorWallSection'},
        {type: 'newsletterSection'},
        {type: 'byTheNumbersSection'},
        {type: 'testimonialSection'},
        {type: 'partnerLogosSection'},
        {type: 'sectionSpacer'},
      ],
      description:
        'Ordered sections that make up this page. About pages start with About intro; Contact pages start with Contact hero; Donate pages start with Donate form.',
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
            const aboutIntroIndexes = sections.flatMap((section, index) =>
              section &&
              typeof section === 'object' &&
              '_type' in section &&
              section._type === 'aboutIntro'
                ? [index]
                : [],
            )
            if (aboutIntroIndexes.length > 1) {
              return 'Use only one About intro per page.'
            }
            if (aboutIntroIndexes.length === 1 && aboutIntroIndexes[0] !== 0) {
              return 'About intro must be the first section on the page.'
            }
            const contactHeroIndexes = sections.flatMap((section, index) =>
              section &&
              typeof section === 'object' &&
              '_type' in section &&
              section._type === 'contactHero'
                ? [index]
                : [],
            )
            if (contactHeroIndexes.length > 1) {
              return 'Use only one Contact hero per page.'
            }
            if (contactHeroIndexes.length === 1 && contactHeroIndexes[0] !== 0) {
              return 'Contact hero must be the first section on the page.'
            }
            if (aboutIntroIndexes.length === 1 && contactHeroIndexes.length === 1) {
              return 'A page cannot include both About intro and Contact hero.'
            }
            const hasContactSections = sections.some(
              (section) =>
                section &&
                typeof section === 'object' &&
                '_type' in section &&
                section._type === 'contactSection',
            )
            if (hasContactSections && contactHeroIndexes.length === 0) {
              return 'Pages with Contact sections must start with a Contact hero.'
            }
            const donateFormIndexes = sections.flatMap((section, index) =>
              section &&
              typeof section === 'object' &&
              '_type' in section &&
              section._type === 'donateFormSection'
                ? [index]
                : [],
            )
            const hasDonateSections = sections.some(
              (section) =>
                section &&
                typeof section === 'object' &&
                '_type' in section &&
                (section._type === 'donateFormSection' ||
                  section._type === 'donateInfoSection' ||
                  section._type === 'donorWallSection'),
            )
            if (donateFormIndexes.length > 1) {
              return 'Use only one Donate form per page.'
            }
            if (hasDonateSections && donateFormIndexes.length === 0) {
              return 'Donate pages must start with a Donate form section.'
            }
            if (donateFormIndexes.length === 1 && donateFormIndexes[0] !== 0) {
              return 'Donate form must be the first section on the page.'
            }
            if (
              donateFormIndexes.length === 1 &&
              (aboutIntroIndexes.length === 1 || contactHeroIndexes.length === 1)
            ) {
              return 'A Donate page cannot also include About intro or Contact hero.'
            }
            return true
          }),
    }),
  ],
})
