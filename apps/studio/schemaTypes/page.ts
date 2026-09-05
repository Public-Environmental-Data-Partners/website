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
        'Ordered blocks for /. Add Hero, What We Do, Testimonial, Section spacer, By the numbers, Highlight banner, Card carousel, Newsletter, Partner logos, Simple section, etc. Drag to reorder.',
      of: [
        {type: 'homeHero'},
        {type: 'whatWeDoSection'},
        {type: 'testimonialSection'},
        {type: 'sectionSpacer'},
        {type: 'byTheNumbersSection'},
        {type: 'highlightBannerSection'},
        {type: 'cardCarouselSection'},
        {type: 'newsletterSection'},
        {type: 'partnerLogosSection'},
        {type: 'simpleSection'},
      ],
      options: {
        insertMenu: {
          filter: true,
          groups: [
            {
              name: 'pageSpecific',
              title: 'Page-specific',
              of: ['homeHero', 'whatWeDoSection', 'highlightBannerSection'],
            },
            {
              name: 'shared',
              title: 'Shared',
              of: [
                'byTheNumbersSection',
                'cardCarouselSection',
                'newsletterSection',
                'partnerLogosSection',
                'sectionSpacer',
                'simpleSection',
                'testimonialSection',
              ],
            },
          ],
        },
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      options: {collapsible: true, collapsed: true},
      description:
        'Optional overrides for search and link previews. Leave empty to use the site name and default description; shares use the PEDP logo card.',
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
