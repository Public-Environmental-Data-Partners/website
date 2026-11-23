import {defineArrayMember, defineField, defineType} from 'sanity'

const footerColumnItems = (name: string, title: string): ReturnType<typeof defineField> =>
  defineField({
    name,
    title,
    type: 'array',
    description:
      'Order shown top to bottom. Items must reference an existing Navigation group, Navigation link, or Page.',
    of: [
      {type: 'reference', to: [{type: 'siteNavGroup'}, {type: 'siteNavLink'}, {type: 'sitePage'}]},
    ],
    validation: (Rule) => Rule.required().min(1),
  })

export const siteFooter = defineType({
  name: 'siteFooter',
  title: 'Site footer',
  type: 'document',
  fields: [
    footerColumnItems('column1Items', 'Column 1 items'),
    footerColumnItems('column2Items', 'Column 2 items'),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      description:
        'Drag to set order. The site shows four icons per row, left aligned, and wraps extras onto the next row. An empty list shows no icons.',
      of: [
        defineArrayMember({
          name: 'footerSocialLink',
          title: 'Social link',
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              description:
                'Upload an SVG (preferred) or PNG. The file is shown as uploaded, at 20×20 inside the footer link.',
              options: {accept: 'image/svg+xml,image/png'},
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Accessible name for the icon link, e.g. PEDP on Bluesky.',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'contentLink',
              description: 'Profile URL or email address. External links open in a new tab.',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label', media: 'icon'},
            prepare({title, media}) {
              return {
                title: typeof title === 'string' && title.trim() ? title.trim() : 'Social link',
                media,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      c1: 'column1Items',
      c2: 'column2Items',
      socials: 'socialLinks',
    },
    prepare({c1, c2, socials}) {
      const n1 = Array.isArray(c1) ? c1.length : 0
      const n2 = Array.isArray(c2) ? c2.length : 0
      const nSocial = Array.isArray(socials) ? socials.length : 0
      const socialLabel = `Social: ${nSocial}`
      return {
        title: 'Site footer',
        subtitle: `Column 1: ${n1} item${n1 === 1 ? '' : 's'} · Column 2: ${n2} item${n2 === 1 ? '' : 's'} · ${socialLabel}`,
      }
    },
  },
})
