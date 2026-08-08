import {defineField, defineType} from 'sanity'

import {brandSvgTitle} from '../lib/brand-svgs'
import {contentLinkAnnotation} from './contentLink'

const sectionPortableText = {
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks: {
    decorators: [{title: 'Strong', value: 'strong'}],
    annotations: [contentLinkAnnotation],
  },
} as const

export const focusAreaItem = defineType({
  name: 'focusAreaItem',
  title: 'Focus area item',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'brandSvg',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    }),
  ],
  preview: {
    select: {title: 'title', icon: 'icon'},
    prepare({title, icon}) {
      return {
        title: typeof title === 'string' && title.trim() ? title.trim() : 'Focus area item',
        subtitle: brandSvgTitle(icon) ?? 'Choose icon',
      }
    },
  },
})

/**
 * Tools Development page hero: copy + Focus areas panel.
 */
export const toolsDevelopmentHero = defineType({
  name: 'toolsDevelopmentHero',
  title: 'Tools Development hero',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'TOOLS DEVELOPMENT',
      validation: (Rule) => Rule.required().max(60),
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
      of: [sectionPortableText],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'focusAreasHeading',
      title: 'Focus areas heading',
      type: 'string',
      initialValue: 'Areas of Focus',
      description: 'Title of the green Focus areas panel.',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'focusAreas',
      title: 'Focus areas',
      type: 'array',
      of: [{type: 'focusAreaItem'}],
      validation: (Rule) => Rule.required().min(1).max(12),
    }),
  ],
  preview: {
    select: {
      sectionHeading: 'sectionHeading',
      heading: 'heading',
      focusAreas: 'focusAreas',
    },
    prepare({sectionHeading, heading, focusAreas}) {
      const n = Array.isArray(focusAreas) ? focusAreas.length : 0
      return {
        title: 'Tools Development hero',
        subtitle: [sectionHeading?.trim(), heading?.trim(), n ? `${n} focus areas` : null]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})

/**
 * Repeatable tool category band (EJ Tools, Investment Mapping, Other Tools, …).
 */
export const toolCategorySection = defineType({
  name: 'toolCategorySection',
  title: 'Tool category',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'body',
      title: 'Intro',
      type: 'array',
      of: [sectionPortableText],
      description: 'Opening paragraph for this tool category.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'guidePrompt',
      title: 'Guide prompt',
      type: 'text',
      rows: 2,
      description: 'Optional. Shown beside the guide button when set (e.g. first category).',
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'guideCtaLabel',
      title: 'Guide button label',
      type: 'string',
      initialValue: 'View Guide',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'guideCtaLink',
      title: 'Guide button link',
      type: 'contentLink',
      description:
        'Optional. Hidden unless both label and link are set. Internal = same tab; External = new tab + icon.',
    }),
    defineField({
      name: 'cards',
      title: 'Tool cards',
      type: 'array',
      of: [{type: 'toolCard'}],
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: {
      sectionHeading: 'sectionHeading',
      cards: 'cards',
    },
    prepare({sectionHeading, cards}) {
      const n = Array.isArray(cards) ? cards.length : 0
      return {
        title: 'Tool category',
        subtitle: sectionHeading?.trim()
          ? `${sectionHeading.trim()} · ${n} card${n === 1 ? '' : 's'}`
          : `${n} card${n === 1 ? '' : 's'}`,
      }
    },
  },
})
