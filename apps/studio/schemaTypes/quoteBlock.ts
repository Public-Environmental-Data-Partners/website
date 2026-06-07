import {defineField, defineType} from 'sanity'

export const quoteBlock = defineType({
  name: 'quoteBlock',
  title: 'Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(1000).warning('Consider ≤ 1000 chars.'),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'Speaker name — shown uppercase with an em dash (e.g. Kameron Kerger).',
      validation: (Rule) => Rule.max(120).warning('Consider ≤ 120 chars.'),
    }),
  ],
  preview: {
    select: {
      quote: 'quote',
      attribution: 'attribution',
    },
    prepare({quote, attribution}) {
      const excerpt = typeof quote === 'string' ? quote.trim().slice(0, 60) : ''
      const byline =
        typeof attribution === 'string' && attribution.trim().length > 0
          ? ` — ${attribution.trim()}`
          : ''
      return {
        title: excerpt ? `"${excerpt}${quote && quote.length > 60 ? '…' : ''}"` : 'Quote',
        subtitle: byline.trim() || 'Pull quote',
      }
    },
  },
})
