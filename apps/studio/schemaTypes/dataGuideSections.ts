import {defineField, defineType} from 'sanity'

import {contentLinkAnnotation} from './contentLink'

const heroPortableText = {
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

const bodyPortableText = {
  type: 'block',
  marks: {
    annotations: [contentLinkAnnotation],
  },
} as const

/**
 * Data Guide hero: page title (sitePage.title) plus intro copy. No image.
 */
export const dataGuideHero = defineType({
  name: 'dataGuideHero',
  title: 'Data Guide hero',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [heroPortableText],
      description:
        'Intro copy under the page title. Use links for repositories, GitHub, and Let us know.',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Data Guide hero'}
    },
  },
})

/**
 * Data Guide body: How to use, term definitions, metadata, and schema as one
 * Portable Text field (Heading 2 for section titles).
 */
export const dataGuideBody = defineType({
  name: 'dataGuideBody',
  title: 'Data Guide body',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [bodyPortableText],
      description:
        'Page copy. Use Heading 2 for How to use, Term definitions, Metadata, and Schema.',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Data Guide body'}
    },
  },
})
