import {defineField, defineType} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      title: 'Homepage sections',
      type: 'array',
      description:
        'Ordered blocks for /. Add Hero, Section spacer, By the numbers, Highlight banner, Card carousel, Newsletter, Coalition, etc. Drag to reorder.',
      of: [
        {type: 'homeHero'},
        {type: 'sectionSpacer'},
        {type: 'byTheNumbersSection'},
        {type: 'highlightBannerSection'},
        {type: 'cardCarouselSection'},
        {type: 'newsletterSection'},
        {type: 'coalitionSection'},
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Home page',
        subtitle: 'Homepage sections',
      }
    },
  },
})
