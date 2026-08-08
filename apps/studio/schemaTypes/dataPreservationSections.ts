import {defineField, defineType} from 'sanity'

import {brandSvgTitle} from '../lib/brand-svgs'
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
 * Data Preservation hero: eyebrow + heading + body + CTA; desktop-only dual images
 * with cream / beige inside the shell and an off-white left bleed outside the shell.
 */
export const dataPreservationHero = defineType({
  name: 'dataPreservationHero',
  title: 'Data Preservation hero',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description:
        'Optional label above the heading (e.g. DATA PRESERVATION). Falls back to the page title.',
      validation: (Rule) => Rule.max(60),
    }),
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
      of: [simplePortableText],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Browse Archived Data',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'contentLink',
      description: 'Optional. Button is hidden if left empty.',
    }),
    defineField({
      name: 'fileListImage',
      title: 'File list image',
      type: 'image',
      description: 'Desktop only (~3 columns). List of archived filenames.',
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
      name: 'collageImage',
      title: 'Collage image',
      type: 'image',
      description: 'Desktop only (~3 columns). Abstract map / collage graphic.',
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
    select: {heading: 'heading', eyebrow: 'eyebrow'},
    prepare({heading, eyebrow}) {
      const title =
        typeof heading === 'string' && heading.trim() ? heading.trim() : 'Data Preservation hero'
      const subtitle =
        typeof eyebrow === 'string' && eyebrow.trim() ? eyebrow.trim() : 'Data Preservation hero'
      return {title, subtitle}
    },
  },
})

export const focusOnAccessItem = defineType({
  name: 'focusOnAccessItem',
  title: 'Focus on Access item',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'brandSvg',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [simplePortableText],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {heading: 'heading', icon: 'icon'},
    prepare({heading, icon}) {
      return {
        title: typeof heading === 'string' && heading.trim() ? heading.trim() : 'Focus item',
        subtitle: brandSvgTitle(icon) ?? 'Choose icon',
      }
    },
  },
})

/** Full-bleed light-green band with reorderable icon + text columns. */
export const focusOnAccessSection = defineType({
  name: 'focusOnAccessSection',
  title: 'Focus on Access',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'FOCUS ON ACCESS',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'focusOnAccessItem'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {sectionHeading: 'sectionHeading', items: 'items'},
    prepare({sectionHeading, items}) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: 'Focus on Access',
        subtitle:
          typeof sectionHeading === 'string' && sectionHeading.trim()
            ? `${sectionHeading.trim()} · ${count} item${count === 1 ? '' : 's'}`
            : `${count} item${count === 1 ? '' : 's'}`,
      }
    },
  },
})

/**
 * Understanding what is at risk: rich text + required light-blue nominate card.
 */
export const riskNominateSection = defineType({
  name: 'riskNominateSection',
  title: 'Risk + nominate card',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'UNDERSTANDING WHAT IS AT RISK',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [sectionPortableText],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'cardHeading',
      title: 'Card heading',
      type: 'string',
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
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Nomination Form',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'contentLink',
      description: 'Optional. Button is hidden if left empty.',
    }),
  ],
  preview: {
    select: {sectionHeading: 'sectionHeading', cardHeading: 'cardHeading'},
    prepare({sectionHeading, cardHeading}) {
      return {
        title: 'Risk + nominate card',
        subtitle:
          typeof sectionHeading === 'string' && sectionHeading.trim()
            ? sectionHeading.trim()
            : typeof cardHeading === 'string'
              ? cardHeading.trim()
              : undefined,
      }
    },
  },
})

/**
 * Metadata standards: image + text with light-green / light-blue split bleeds and CTA.
 */
export const metadataStandardsSection = defineType({
  name: 'metadataStandardsSection',
  title: 'Metadata standards',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'DEVELOPING OUR METADATA STANDARDS',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [sectionPortableText],
      description: 'Supports paragraphs and bulleted lists.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description:
        'Upload at least 688×872 for desktop. Use the hotspot to control the crop. Section is hidden on the site until an image is set.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) =>
            Rule.custom((alt, context) => {
              const parent = context.parent as {asset?: unknown} | undefined
              if (parent?.asset && !(typeof alt === 'string' && alt.trim())) {
                return 'Alternative text is required when an image is set.'
              }
              return true
            }).max(160),
        }),
      ],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'View Schema',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'contentLink',
      description: 'Optional. Button is hidden if left empty.',
    }),
  ],
  preview: {
    select: {sectionHeading: 'sectionHeading', media: 'image'},
    prepare({sectionHeading, media}) {
      return {
        title: 'Metadata standards',
        subtitle:
          typeof sectionHeading === 'string' && sectionHeading.trim()
            ? sectionHeading.trim()
            : undefined,
        media,
      }
    },
  },
})
