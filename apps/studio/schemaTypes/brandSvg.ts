import {defineType} from 'sanity'

import {BrandSvgPicker} from '../components/brand-svg-picker'
import {BRAND_SVGS, isBrandSvgPath} from '../lib/brand-svgs'

/**
 * Reusable brand SVG field. Editors pick from `apps/web/public/brand` via BrandSvgPicker.
 * Stored value is the public path (e.g. `/brand/coalition/data-db.svg`).
 */
export const brandSvg = defineType({
  name: 'brandSvg',
  title: 'Brand SVG',
  type: 'string',
  description: 'SVG from the site brand folder (`apps/web/public/brand`).',
  options: {
    list: BRAND_SVGS.map(({title, value}) => ({title, value})),
  },
  components: {input: BrandSvgPicker},
  validation: (Rule) =>
    Rule.custom((value) => {
      if (value === undefined || value === null || value === '') {
        return true
      }
      if (typeof value === 'string' && isBrandSvgPath(value)) {
        return true
      }
      return 'Choose a brand SVG from the list'
    }),
})
