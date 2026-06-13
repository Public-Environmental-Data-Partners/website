import {defineArrayMember, defineField, defineType} from 'sanity'

import {isValidLucideIconName, lucideIconFieldDescription} from '../lib/lucide-icon-name'
import {listBlockVariantFromPath} from '../lib/list-block-from-path'
import {listRowPortableTextBlock} from './articlePortableText'

const LIST_BLOCK_VARIANTS = [
  {title: 'Unstyled short lines', value: 'unstyled'},
  {title: 'Divided paragraphs', value: 'dividedParagraph'},
  {title: 'Divided with icons', value: 'dividedIcon'},
  {title: 'Divided ordered (numbers)', value: 'dividedOrdered'},
  {title: 'Divided bulleted sections', value: 'dividedBulleted'},
] as const

const LIST_BLOCK_BACKGROUNDS = [
  {title: 'Green (light green)', value: 'lightGreen'},
  {title: 'Blue (light blue)', value: 'lightBlue'},
] as const

const VARIANT_LABELS: Record<string, string> = {
  unstyled: 'Unstyled lines',
  dividedParagraph: 'Divided paragraphs',
  dividedIcon: 'Divided + icons',
  dividedOrdered: 'Divided ordered',
  dividedBulleted: 'Divided bulleted',
}

const BACKGROUND_LABELS: Record<string, string> = {
  lightGreen: 'Green',
  lightBlue: 'Blue',
}

const UNSTYLED_LINE_MAX = 80

function variantIs(parent: {variant?: string} | undefined, value: string): boolean {
  return parent?.variant === value
}

function variantIsOneOf(parent: {variant?: string} | undefined, values: string[]): boolean {
  return typeof parent?.variant === 'string' && values.includes(parent.variant)
}

export const listBlock = defineType({
  name: 'listBlock',
  title: 'List',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Layout',
      type: 'string',
      options: {list: [...LIST_BLOCK_VARIANTS], layout: 'dropdown'},
      validation: (Rule) => Rule.required(),
      initialValue: 'dividedParagraph',
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {list: [...LIST_BLOCK_BACKGROUNDS], layout: 'radio'},
      validation: (Rule) => Rule.required(),
      initialValue: 'lightGreen',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(120).warning('Consider ≤ 120 chars.'),
    }),
    defineField({
      name: 'lines',
      title: 'Lines',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (Rule) =>
            Rule.max(UNSTYLED_LINE_MAX).warning(`Keep each line ≤ ${UNSTYLED_LINE_MAX} chars.`),
        }),
      ],
      hidden: ({parent}) => !variantIs(parent as {variant?: string}, 'unstyled'),
      description: 'Short plain-text lines — one per row.',
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'listBlockRow',
          title: 'Row',
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon name',
              type: 'string',
              description: lucideIconFieldDescription(),
              hidden: ({document, path}) => {
                const variant = listBlockVariantFromPath(document, path)
                // If path resolution fails, show the field rather than hide it incorrectly.
                if (!variant) {
                  return false
                }
                return variant !== 'dividedIcon'
              },
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const variant = listBlockVariantFromPath(context.document, context.path)
                  if (variant !== 'dividedIcon') {
                    return true
                  }
                  const name = typeof value === 'string' ? value.trim() : ''
                  if (!name) {
                    return 'Icon name is required for icon rows.'
                  }
                  if (!isValidLucideIconName(name)) {
                    return `“${name}” is not a valid Lucide icon. Use kebab-case names from lucide.dev/icons.`
                  }
                  return true
                }),
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [listRowPortableTextBlock],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {icon: 'icon', content: 'content'},
            prepare({icon, content}) {
              const block = Array.isArray(content) ? content[0] : undefined
              const text =
                block &&
                typeof block === 'object' &&
                'children' in block &&
                Array.isArray((block as {children?: unknown[]}).children)
                  ? (block as {children: Array<{text?: string}>}).children
                      .map((child) => child.text ?? '')
                      .join('')
                  : ''
              const excerpt = text.trim().slice(0, 48)
              const iconLabel = typeof icon === 'string' && icon.trim() ? icon.trim() : undefined
              return {
                title: excerpt || 'Row',
                subtitle: iconLabel ? `Icon: ${iconLabel}` : 'Paragraph row',
              }
            },
          },
        }),
      ],
      hidden: ({parent}) =>
        !variantIsOneOf(parent as {variant?: string}, [
          'dividedParagraph',
          'dividedIcon',
          'dividedOrdered',
        ]),
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'listBlockBulletedSection',
          title: 'Section',
          type: 'object',
          fields: [
            defineField({
              name: 'sectionTitle',
              title: 'Section title',
              type: 'string',
              validation: (Rule) => Rule.max(120).warning('Consider ≤ 120 chars.'),
            }),
            defineField({
              name: 'bullets',
              title: 'Bullets',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {sectionTitle: 'sectionTitle', bullets: 'bullets'},
            prepare({sectionTitle, bullets}) {
              const count = Array.isArray(bullets) ? bullets.length : 0
              const title =
                typeof sectionTitle === 'string' && sectionTitle.trim().length > 0
                  ? sectionTitle.trim()
                  : 'Section'
              return {
                title,
                subtitle: `${count} bullet${count === 1 ? '' : 's'}`,
              }
            },
          },
        }),
      ],
      hidden: ({parent}) => !variantIs(parent as {variant?: string}, 'dividedBulleted'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      variant: 'variant',
      background: 'background',
      lines: 'lines',
      rows: 'rows',
      sections: 'sections',
    },
    prepare({title, variant, background, lines, rows, sections}) {
      const variantLabel =
        typeof variant === 'string' ? (VARIANT_LABELS[variant] ?? variant) : 'List'
      const bgLabel =
        typeof background === 'string' ? (BACKGROUND_LABELS[background] ?? background) : ''
      const lineCount = Array.isArray(lines) ? lines.length : 0
      const rowCount = Array.isArray(rows) ? rows.length : 0
      const sectionCount = Array.isArray(sections) ? sections.length : 0
      const countLabel =
        variant === 'unstyled'
          ? `${lineCount} line${lineCount === 1 ? '' : 's'}`
          : variant === 'dividedBulleted'
            ? `${sectionCount} section${sectionCount === 1 ? '' : 's'}`
            : `${rowCount} row${rowCount === 1 ? '' : 's'}`
      const blockTitle =
        typeof title === 'string' && title.trim().length > 0 ? title.trim() : 'List block'
      return {
        title: blockTitle,
        subtitle: [variantLabel, bgLabel, countLabel].filter(Boolean).join(' · '),
      }
    },
  },
})
