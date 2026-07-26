import {defineField, defineType} from 'sanity'

import {contentLinkAnnotation} from './contentLink'

const sectionPortableTextBlock = {
  type: 'block',
  marks: {
    annotations: [contentLinkAnnotation],
  },
} as const

const calloutPortableText = {
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks: {
    decorators: [
      {title: 'Strong', value: 'strong'},
      {title: 'Emphasis', value: 'em'},
    ],
    annotations: [contentLinkAnnotation],
  },
} as const

/**
 * Get Involved page intro: light-blue callout (heading, rich text + CTA buttons,
 * illustration) beside the page title and main body. Page title is the sitePage
 * document title, rendered as the page h1.
 */
export const getInvolvedIntro = defineType({
  name: 'getInvolvedIntro',
  title: 'Get Involved intro',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Callout heading (e.g. Get Involved With PEDP).',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'callout',
      title: 'Callout body',
      type: 'array',
      of: [calloutPortableText, {type: 'contactCta'}],
      description:
        'Callout copy and CTA button blocks. Place buttons wherever they should appear between paragraphs.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'image',
      title: 'Illustration',
      type: 'image',
      description: 'Group illustration at the bottom of the blue callout.',
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
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [sectionPortableTextBlock],
      description:
        'Main column copy. Use Heading 2 for section labels (e.g. HOW TO JOIN) and bulleted lists for working groups.',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {heading: 'heading', media: 'image'},
    prepare({heading, media}) {
      return {
        title: 'Get Involved intro',
        subtitle: typeof heading === 'string' ? heading.trim() || undefined : undefined,
        media,
      }
    },
  },
})

export const otherWaysCard = defineType({
  name: 'otherWaysCard',
  title: 'Other ways card',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description: 'Upload an SVG (preferred) or PNG icon.',
      options: {accept: 'image/svg+xml,image/png', hotspot: true},
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Optional. Leave blank for decorative icons.',
          validation: (Rule) => Rule.max(160),
        }),
      ],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [sectionPortableTextBlock],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'contentLink',
      description:
        'Optional. Choose Internal (same tab) or External (new tab + icon). Button is hidden if left empty.',
    }),
  ],
  preview: {
    select: {title: 'title', media: 'icon'},
    prepare({title, media}) {
      return {
        title: typeof title === 'string' && title.trim() ? title.trim() : 'Other ways card',
        media,
      }
    },
  },
})

/** Three-up CTA cards band (Nominate / Donate / Contribute). */
export const otherWaysSection = defineType({
  name: 'otherWaysSection',
  title: 'Other ways to get involved',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'OTHER WAYS TO GET INVOLVED',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [{type: 'otherWaysCard'}],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(3)
          .error('Add one to three cards (e.g. Nominate, Donate, Contribute).'),
    }),
  ],
  preview: {
    select: {sectionHeading: 'sectionHeading', cards: 'cards'},
    prepare({sectionHeading, cards}) {
      const n = Array.isArray(cards) ? cards.length : 0
      return {
        title: 'Other ways to get involved',
        subtitle: sectionHeading?.trim()
          ? `${sectionHeading.trim()} · ${n} card${n === 1 ? '' : 's'}`
          : `${n} card${n === 1 ? '' : 's'}`,
      }
    },
  },
})
