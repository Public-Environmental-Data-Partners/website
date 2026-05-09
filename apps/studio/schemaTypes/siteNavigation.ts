import {defineField, defineType} from 'sanity'

const navLinkTargetValidation = (fields: unknown) => {
  if (!fields || typeof fields !== 'object') {
    return true
  }
  const hasPage = !!(fields as {sitePage?: unknown}).sitePage
  const p =
    typeof (fields as {path?: string}).path === 'string'
      ? (fields as {path: string}).path.trim()
      : ''
  if (!hasPage && !p) {
    return 'Choose a Site page or enter an internal path'
  }
  if (hasPage && p) {
    return 'Use either Site page or internal path, not both'
  }
  if (p && !p.startsWith('/')) {
    return 'Internal path must start with /'
  }
  return true
}

/** Reusable navigation link entity, referenced by groups and primary navigation. */
export const siteNavLink = defineType({
  name: 'siteNavLink',
  title: 'Navigation link',
  type: 'document',
  validation: (Rule) => Rule.custom(navLinkTargetValidation),
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'sitePage',
      title: 'Site page',
      type: 'reference',
      to: [{type: 'sitePage'}],
      description: 'Use for pages managed under "Pages". URL will be /{slug}.',
    }),
    defineField({
      name: 'path',
      title: 'Internal path',
      type: 'string',
      description:
        'Use when the target is not a Site page document (e.g. /donate, /whats-happening/blog). Must start with /.',
    }),
  ],
  preview: {
    select: {
      label: 'label',
      path: 'path',
    },
    prepare({label, path}) {
      return {
        title: label || 'Nav link',
        subtitle: path || 'Site page',
      }
    },
  },
})

/** Reusable navigation group entity, referenced by primary navigation. */
export const siteNavGroup = defineType({
  name: 'siteNavGroup',
  title: 'Navigation group',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Nav group label',
      type: 'string',
      description:
        'Text shown in the primary navigation: the desktop dropdown label and the section heading above links in the mobile menu.',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'items',
      title: 'Links in this group',
      type: 'array',
      description: 'References to reusable navigation links. Drag to reorder.',
      of: [{type: 'reference', to: [{type: 'siteNavLink'}]}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      label: 'label',
    },
    prepare({label}) {
      return {
        title: label || 'Nav group',
        subtitle: 'Nav group (dropdown)',
      }
    },
  },
})

export const siteNavigation = defineType({
  name: 'siteNavigation',
  title: 'Primary navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'entries',
      title: 'Navigation entries',
      type: 'array',
      description:
        'Order matches the header (desktop and mobile). Choose a Navigation group or Navigation link reference.',
      of: [{type: 'reference', to: [{type: 'siteNavGroup'}, {type: 'siteNavLink'}]}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      entries: 'entries',
    },
    prepare({entries}) {
      const list = Array.isArray(entries) ? entries : []
      const n = list.length
      return {
        title: 'Primary navigation',
        subtitle:
          n === 0
            ? 'No top-level items yet'
            : `${n} top-level ${n === 1 ? 'item' : 'items'} (nav links and groups)`,
      }
    },
  },
})
