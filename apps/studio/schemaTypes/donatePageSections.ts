import {defineField, defineType} from 'sanity'

import {contentLinkAnnotation} from './contentLink'

const sectionPortableTextBlock = {
  type: 'block',
  marks: {
    annotations: [contentLinkAnnotation],
  },
} as const

/**
 * Left column: Donorbox donation form embed + legal copy beneath the widget.
 */
export const donateFormSection = defineType({
  name: 'donateFormSection',
  title: 'Donate form',
  type: 'object',
  fields: [
    defineField({
      name: 'donorboxCampaign',
      title: 'Donorbox campaign',
      type: 'string',
      description:
        'Paste the Donorbox donation form embed URL (the iframe src, e.g. ' +
        'https://donorbox.org/embed/your-campaign) to preserve its styling, or a bare campaign slug. ' +
        'Do not paste the full <script>/<iframe> HTML.',
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [sectionPortableTextBlock],
      description: 'Legal / tax copy shown under the donation form.',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {campaign: 'donorboxCampaign'},
    prepare({campaign}) {
      return {
        title: 'Donate form',
        subtitle: typeof campaign === 'string' ? campaign.trim() || undefined : undefined,
      }
    },
  },
})

/**
 * Right column: light-green info box with lead copy and icon rows.
 */
export const donateInfoSection = defineType({
  name: 'donateInfoSection',
  title: 'Donate info',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      description: 'Short uppercase section label (e.g. DONATE TO PEDP).',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [sectionPortableTextBlock],
      description: 'Lead paragraphs above the support list.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'prompt',
      title: 'Prompt',
      type: 'string',
      description: 'Invitational line above the icon list (e.g. YOUR SUPPORT WILL HELP PEDP:).',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'rows',
      title: 'Support rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'donateInfoRow',
          title: 'Row',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              description: 'Upload an SVG (preferred) or PNG icon.',
              options: {accept: 'image/svg+xml,image/png'},
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required().max(280),
            }),
          ],
          preview: {
            select: {title: 'label', media: 'icon'},
            prepare({title, media}) {
              return {
                title: typeof title === 'string' ? title.trim() || 'Row' : 'Row',
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
  ],
  preview: {
    select: {sectionHeading: 'sectionHeading', rows: 'rows'},
    prepare({sectionHeading, rows}) {
      const count = Array.isArray(rows) ? rows.length : 0
      return {
        title:
          typeof sectionHeading === 'string'
            ? sectionHeading.trim() || 'Donate info'
            : 'Donate info',
        subtitle: `${count} row${count === 1 ? '' : 's'}`,
      }
    },
  },
})

/**
 * Full-width dark band: section heading, Donorbox Donor Wall embed, EIN copy.
 */
export const donorWallSection = defineType({
  name: 'donorWallSection',
  title: 'Donor wall',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      title: 'Section heading',
      type: 'string',
      description: 'Short uppercase section label (e.g. THANK YOU TO OUR DONORS).',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'donorboxCampaign',
      title: 'Donorbox campaign',
      type: 'string',
      description:
        'Paste the Donorbox Donor Wall embed URL (the iframe src, e.g. ' +
        'https://donorbox.org/embed/your-campaign?donor_wall_color=%235d8962&only_donor_wall=true) ' +
        'to preserve its color styling, or a bare campaign slug. Do not paste the full <script>/<iframe> HTML.',
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [sectionPortableTextBlock],
      description: 'EIN / tax paragraph under the donor wall.',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {sectionHeading: 'sectionHeading', campaign: 'donorboxCampaign'},
    prepare({sectionHeading, campaign}) {
      return {
        title:
          typeof sectionHeading === 'string' ? sectionHeading.trim() || 'Donor wall' : 'Donor wall',
        subtitle: typeof campaign === 'string' ? campaign.trim() || undefined : undefined,
      }
    },
  },
})
