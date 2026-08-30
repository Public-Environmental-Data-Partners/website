import {defineField, defineType} from 'sanity'

const placements = [
  {title: 'Above the header', value: 'aboveHeader'},
  {title: 'Under the header', value: 'belowHeader'},
  {title: 'Above the footer', value: 'aboveFooter'},
] as const

export const siteEventBanner = defineType({
  name: 'siteEventBanner',
  title: 'Event banner',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'Upcoming event:',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main banner message, shown after the section heading.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Sign-up',
      validation: (Rule) => Rule.max(80),
      description: 'Optional. Button is hidden when the link below is empty.',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'contentLink',
      description:
        'Optional. Choose Internal (same tab) or External (new tab + icon). Button is hidden if left empty.',
    }),
    defineField({
      name: 'placement',
      title: 'Placement',
      type: 'string',
      options: {list: [...placements], layout: 'radio'},
      initialValue: 'belowHeader',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startsAt',
      title: 'Start',
      type: 'datetime',
      description: 'Banner is hidden on the site before this time.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endsAt',
      title: 'End',
      type: 'datetime',
      description: 'Banner is hidden on the site after this time.',
      validation: (Rule) =>
        Rule.required().custom((endsAt, context) => {
          const startsAt = (context.parent as {startsAt?: string} | undefined)?.startsAt
          if (typeof endsAt !== 'string' || typeof startsAt !== 'string') {
            return true
          }
          return Date.parse(endsAt) > Date.parse(startsAt) || 'End must be after start'
        }),
    }),
  ],
  preview: {
    select: {
      sectionHeading: 'sectionHeading',
      heading: 'heading',
    },
    prepare({sectionHeading, heading}) {
      const title =
        typeof sectionHeading === 'string' && sectionHeading.trim()
          ? sectionHeading.trim()
          : 'Event banner'
      return {
        title,
        subtitle: typeof heading === 'string' && heading.trim() ? heading.trim() : undefined,
      }
    },
  },
})
