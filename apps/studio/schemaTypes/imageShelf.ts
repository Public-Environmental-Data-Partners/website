import {defineField, defineType} from 'sanity'

import {ImageShelfColorInput} from '../components/image-shelf-color-input'

const DEFAULT_INDENT_PERCENT = 25
const DEFAULT_HEIGHT_PX = 50
const DEFAULT_COLOR = 'offWhite'

/**
 * PEDP brand palette for image shelf.
 * Hex values mirror `apps/web/src/app/pedp-token-overrides.css` light tokens.
 */
export const IMAGE_SHELF_BRAND_COLORS = [
  {title: 'Cream', value: 'cream', hex: '#fffcf8'},
  {title: 'Off white', value: 'offWhite', hex: '#f4f1ec'},
  {title: 'Off black', value: 'offBlack', hex: '#42413d'},
  {title: 'Light beige', value: 'lightBeige', hex: '#ebe4db'},
  {title: 'Beige', value: 'beige', hex: '#d4cbbf'},
  {title: 'Dark beige', value: 'darkBeige', hex: '#6d6659'},
  {title: 'Light gray', value: 'lightGray', hex: '#d9d9d9'},
  {title: 'Light green', value: 'lightGreen', hex: '#c4edac'},
  {title: 'PEDP green', value: 'pedpGreen', hex: '#7ac473'},
  {title: 'Green 4', value: 'green4', hex: '#558457'},
  {title: 'Dark green', value: 'darkGreen', hex: '#324a3d'},
  {title: 'Light blue', value: 'lightBlue', hex: '#c5e8ff'},
  {title: 'PEDP blue', value: 'pedpBlue', hex: '#98c0f4'},
  {title: 'Dark blue', value: 'darkBlue', hex: '#2b3e6f'},
] as const

/** Per-breakpoint shelf: left indent (% of image width) + height (px). */
export const imageShelfBreakpoint = defineType({
  name: 'imageShelfBreakpoint',
  title: 'Image shelf (breakpoint)',
  type: 'object',
  options: {columns: 2},
  fields: [
    defineField({
      name: 'indentPercent',
      title: 'Indent (%)',
      type: 'number',
      description:
        'Left inset as a percent of image width. Shelf is right-aligned; 25 means the shelf spans the right 75%.',
      initialValue: DEFAULT_INDENT_PERCENT,
      validation: (Rule) => Rule.required().min(0).max(100).integer(),
    }),
    defineField({
      name: 'heightPx',
      title: 'Height (px)',
      type: 'number',
      description: 'How far the shelf protrudes below the image, in pixels.',
      initialValue: DEFAULT_HEIGHT_PX,
      validation: (Rule) => Rule.required().min(0).max(200).integer(),
    }),
  ],
  preview: {
    select: {
      indentPercent: 'indentPercent',
      heightPx: 'heightPx',
    },
    prepare({indentPercent, heightPx}) {
      return {
        title: `${indentPercent ?? DEFAULT_INDENT_PERCENT}% indent · ${heightPx ?? DEFAULT_HEIGHT_PX}px`,
      }
    },
  },
})

/**
 * Reusable image shelf controls (mobile / tablet / desktop).
 * Breakpoints: mobile &lt;768px, tablet 768–1023px, desktop ≥1024px.
 */
export const imageShelfSettings = defineType({
  name: 'imageShelfSettings',
  title: 'Image shelf',
  type: 'object',
  description:
    'Indented strip under an image (right-flush). Defaults: off white, 25% indent, 50px height.',
  fields: [
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Brand palette color for the shelf strip.',
      options: {
        list: IMAGE_SHELF_BRAND_COLORS.map(({title, value, hex}) => ({
          title: `${title} (${hex})`,
          value,
        })),
        layout: 'radio',
      },
      initialValue: DEFAULT_COLOR,
      components: {input: ImageShelfColorInput},
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (
            typeof value === 'string' &&
            IMAGE_SHELF_BRAND_COLORS.some((entry) => entry.value === value)
          ) {
            return true
          }
          return 'Choose a brand palette color'
        }),
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile',
      type: 'imageShelfBreakpoint',
      description: 'Below 768px.',
      initialValue: {
        indentPercent: DEFAULT_INDENT_PERCENT,
        heightPx: DEFAULT_HEIGHT_PX,
      },
    }),
    defineField({
      name: 'tablet',
      title: 'Tablet',
      type: 'imageShelfBreakpoint',
      description: '768px–1023px.',
      initialValue: {
        indentPercent: DEFAULT_INDENT_PERCENT,
        heightPx: DEFAULT_HEIGHT_PX,
      },
    }),
    defineField({
      name: 'desktop',
      title: 'Desktop',
      type: 'imageShelfBreakpoint',
      description: '1024px and up.',
      initialValue: {
        indentPercent: DEFAULT_INDENT_PERCENT,
        heightPx: DEFAULT_HEIGHT_PX,
      },
    }),
  ],
  preview: {
    select: {color: 'color'},
    prepare({color}) {
      const entry = IMAGE_SHELF_BRAND_COLORS.find((item) => item.value === color)
      const label = entry ? `${entry.title} (${entry.hex})` : 'Off white (#f4f1ec)'
      return {title: 'Image shelf', subtitle: label}
    },
  },
})
