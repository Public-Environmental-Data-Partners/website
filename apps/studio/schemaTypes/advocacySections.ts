import {defineField, defineType} from 'sanity'

import {contentLinkAnnotation} from './contentLink'

const sectionPortableText = {
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [
    {title: 'Bullet', value: 'bullet'},
    {title: 'Numbered', value: 'number'},
  ],
  marks: {
    decorators: [
      {title: 'Strong', value: 'strong'},
      {title: 'Emphasis', value: 'em'},
    ],
    annotations: [contentLinkAnnotation],
  },
} as const

const simplePortableText = {
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
 * Advocacy hero: page-title eyebrow + heading + rich-text body; desktop shelf
 * image with a light-beige “Our Approach” card (Nominate-style, optional CTA).
 */
export const advocacyHero = defineType({
  name: 'advocacyHero',
  title: 'Advocacy hero',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [sectionPortableText],
      description: 'Intro copy and strategies. Use strong for labels (e.g. Policy development:).',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Desktop only (1024px+). Shown with the shelf under it.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
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
      name: 'imageShelf',
      title: 'Image shelf',
      type: 'imageShelfSettings',
      description:
        'Indented strip under the image. Defaults: off white, 25% indent, and 50px height.',
      initialValue: {
        color: 'lightGray',
        mobile: {indentPercent: 25, heightPx: 50},
        tablet: {indentPercent: 25, heightPx: 50},
        desktop: {indentPercent: 25, heightPx: 50},
      },
    }),
    defineField({
      name: 'cardHeading',
      title: 'Card heading',
      type: 'string',
      initialValue: 'Our Approach',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'cardBody',
      title: 'Card body',
      type: 'array',
      of: [simplePortableText],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'showCta',
      title: 'Show button',
      type: 'boolean',
      description: 'When on, the card shows a CTA button (Nominate-style).',
      initialValue: false,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      hidden: ({parent}) => !parent?.showCta,
      validation: (Rule) =>
        Rule.max(40).custom((value, context) => {
          const parent = context.parent as {showCta?: boolean} | undefined
          if (parent?.showCta && !(typeof value === 'string' && value.trim())) {
            return 'Button label is required when Show button is on.'
          }
          return true
        }),
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'contentLink',
      hidden: ({parent}) => !parent?.showCta,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {showCta?: boolean} | undefined
          if (!parent?.showCta) {
            return true
          }
          if (!value || typeof value !== 'object') {
            return 'Button link is required when Show button is on.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {heading: 'heading', cardHeading: 'cardHeading', media: 'image'},
    prepare({heading, cardHeading, media}) {
      const title = typeof heading === 'string' && heading.trim() ? heading.trim() : 'Advocacy hero'
      const subtitle =
        typeof cardHeading === 'string' && cardHeading.trim() ? cardHeading.trim() : 'Advocacy hero'
      return {title, subtitle, media}
    },
  },
})
