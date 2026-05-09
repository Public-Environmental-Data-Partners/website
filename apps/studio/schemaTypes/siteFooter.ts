import {defineField, defineType} from 'sanity'

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
  ],
  preview: {
    select: {
      c1: 'column1Items',
      c2: 'column2Items',
    },
    prepare({c1, c2}) {
      const n1 = Array.isArray(c1) ? c1.length : 0
      const n2 = Array.isArray(c2) ? c2.length : 0
      return {
        title: 'Site footer',
        subtitle: `Column 1: ${n1} item${n1 === 1 ? '' : 's'} · Column 2: ${n2} item${n2 === 1 ? '' : 's'}`,
      }
    },
  },
})
