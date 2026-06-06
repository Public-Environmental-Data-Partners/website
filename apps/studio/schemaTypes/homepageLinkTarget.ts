import {defineField, defineType} from 'sanity'

/**
 * Homepage CTA/card link: exactly one of site page reference, internal path, or external URL.
 * Mirrors nav link semantics with an added external URL option for banners/partnerships.
 */
export const homepageLinkTarget = defineType({
  name: 'homepageLinkTarget',
  title: 'Link target',
  type: 'object',
  validation: (Rule) =>
    Rule.custom((fields) => {
      if (!fields || typeof fields !== 'object') {
        return true
      }
      const f = fields as {
        sitePage?: unknown
        path?: string
        externalUrl?: string | null
      }
      const hasPage = !!f.sitePage
      const p = typeof f.path === 'string' ? f.path.trim() : ''
      const ext = typeof f.externalUrl === 'string' ? f.externalUrl.trim() : ''
      const n = [hasPage, !!p, !!ext].filter(Boolean).length
      if (n === 0) {
        return 'Choose a Site page, internal path, or external URL'
      }
      if (n > 1) {
        return 'Use only one: Site page, internal path, or external URL'
      }
      if (p && !p.startsWith('/')) {
        return 'Internal path must start with /'
      }
      return true
    }),
  fields: [
    defineField({
      name: 'sitePage',
      title: 'Site page',
      type: 'reference',
      to: [{type: 'sitePage'}],
      description: 'URL will be /{slug}.',
    }),
    defineField({
      name: 'path',
      title: 'Internal path',
      type: 'string',
      description: 'Must start with / (e.g. /donate, /news-and-updates/my-post).',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Use for links outside this site.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Link target'}
    },
  },
})
