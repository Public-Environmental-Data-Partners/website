import {defineArrayMember, defineField, defineType} from 'sanity'

export const twoImageBlock = defineType({
  name: 'twoImageBlock',
  title: 'Two images',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Images',
      type: 'array',
      validation: (Rule) => Rule.required().min(2).max(2).error('Add exactly two images.'),
      of: [defineArrayMember({type: 'articleFigureItem'})],
    }),
  ],
  preview: {
    select: {
      leftMedia: 'items.0.image',
      rightMedia: 'items.1.image',
    },
    prepare({leftMedia, rightMedia}) {
      return {
        title: 'Two images',
        subtitle: 'Side by side @ desktop/tablet; stacked @ mobile',
        media: leftMedia ?? rightMedia,
      }
    },
  },
})
