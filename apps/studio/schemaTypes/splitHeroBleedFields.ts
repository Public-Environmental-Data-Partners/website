import {defineField, defineType} from 'sanity'

const heroBodyBlock = {
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

/** Shared hero fields for split-hero-bleed (hub + future newsPost.hero). */
export const splitHeroBleedFields = defineType({
  name: 'splitHeroBleedFields',
  title: 'Split hero bleed',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      validation: (Rule) => Rule.max(40).warning('Keep this short (≤ 40 chars).'),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(160).warning('Consider ≤ 160 chars.'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [heroBodyBlock],
    }),
    defineField({
      name: 'image',
      title: 'Hero image (desktop/default)',
      type: 'image',
      validation: (Rule) => Rule.required(),
      description:
        'Preferred: JPG or WebP. For split-hero at 1440px+, target ~700×650px display; upload at least 1400px wide.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) =>
            Rule.required().max(160).warning('Keep alt text concise and descriptive (≤ 160 chars).'),
        }),
      ],
    }),
    defineField({
      name: 'imageMobile',
      title: 'Hero image (mobile override)',
      type: 'image',
      description: 'Optional. Falls back to desktop image when empty.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text (mobile override)',
          type: 'string',
          validation: (Rule) =>
            Rule.max(160).warning('Keep alt text concise and descriptive (≤ 160 chars).'),
        }),
      ],
    }),
    defineField({
      name: 'hideImageOnMobile',
      title: 'Hide hero image on mobile',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      eyebrow: 'eyebrow',
      media: 'image',
    },
    prepare({title, eyebrow, media}) {
      return {
        title: title?.trim() || 'Split hero bleed',
        subtitle: eyebrow?.trim() || undefined,
        media,
      }
    },
  },
})
