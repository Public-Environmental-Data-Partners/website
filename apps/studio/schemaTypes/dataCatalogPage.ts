import {defineField, defineType} from 'sanity'

import {contentLinkAnnotation} from './contentLink'

const catalogIntroPortableText = {
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

export const dataCatalogCta = defineType({
  name: 'dataCatalogCta',
  title: 'Catalog CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'blurb',
      title: 'Blurb',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(280),
    }),
    defineField({
      name: 'label',
      title: 'Button label',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'link',
      title: 'Button link',
      type: 'contentLink',
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'blurb'},
  },
})

export const dataCatalogPage = defineType({
  name: 'dataCatalogPage',
  title: 'Data Catalog page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Data Catalog',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'array',
      of: [catalogIntroPortableText],
      description: 'Supporting copy under the page title. Links use the shared content link.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'dataGuide',
      title: 'Data Guide',
      type: 'dataCatalogCta',
    }),
    defineField({
      name: 'nominateData',
      title: 'Nominate Data',
      type: 'dataCatalogCta',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      options: {collapsible: true, collapsed: true},
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title?.trim() || 'Data Catalog'}
    },
  },
})
