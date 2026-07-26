import {defineField, defineType} from 'sanity'

import {ContentLinkInput} from '../components/content-link-input'
import {validateContentLinkValue} from '../lib/content-link'

/**
 * Shared CTA / Portable Text link target.
 * Editors choose Internal or External; the custom input writes the matching fields.
 * See: docs/ops/content-links-cleanup.md
 */
export const contentLink = defineType({
  name: 'contentLink',
  title: 'Link',
  type: 'object',
  components: {input: ContentLinkInput},
  validation: (Rule) => Rule.custom(validateContentLinkValue),
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal', value: 'internal'},
          {title: 'External', value: 'external'},
          {title: 'Email', value: 'email'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'internalReference',
      title: 'Internal page or post',
      type: 'reference',
      to: [{type: 'sitePage'}, {type: 'newsPost'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
      description: 'Prefer references so links stay valid when slugs change.',
    }),
    defineField({
      name: 'internalPath',
      title: 'Internal path',
      type: 'string',
      hidden: ({parent}) => parent?.linkType !== 'internal',
      description:
        'Used for established routes that are not Site page / News post documents (e.g. /news-and-updates, /donate).',
      validation: (Rule) =>
        Rule.custom((path, context) => {
          const parent = context.parent as {linkType?: string} | undefined
          if (parent?.linkType !== 'internal') {
            return true
          }
          if (typeof path !== 'string' || !path.trim()) {
            return true
          }
          return path.trim().startsWith('/') || 'Internal path must start with /'
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      description: 'Full http(s) URL. Opens in a new tab with an external-link icon.',
    }),
    defineField({
      name: 'emailAddress',
      title: 'Email address',
      type: 'string',
      hidden: ({parent}) => parent?.linkType !== 'email',
      description: 'Opens the visitor’s default email app.',
    }),
  ],
  preview: {
    select: {
      linkType: 'linkType',
      path: 'internalPath',
      externalUrl: 'externalUrl',
      emailAddress: 'emailAddress',
      pageTitle: 'internalReference.title',
    },
    prepare({linkType, path, externalUrl, emailAddress, pageTitle}) {
      if (linkType === 'external') {
        return {
          title: externalUrl?.trim() || 'External link',
          subtitle: 'External · new tab',
        }
      }
      if (linkType === 'email') {
        return {
          title: emailAddress?.trim() || 'Email link',
          subtitle: 'Email · opens mail app',
        }
      }
      const internalLabel =
        (typeof pageTitle === 'string' && pageTitle.trim()) ||
        (typeof path === 'string' && path.trim()) ||
        'Internal link'
      return {
        title: internalLabel,
        subtitle: 'Internal · same tab',
      }
    },
  },
})

/**
 * Portable Text annotation that reuses the `contentLink` object type.
 * Mark def `_type` stays `link` so existing PT mark renderers keep working.
 * Requires Sanity ≥ Jan 2026 custom-object annotation support.
 */
export const contentLinkAnnotation = {
  name: 'link',
  title: 'Link',
  type: 'contentLink',
} as const
