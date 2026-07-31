import {defineField, defineType} from 'sanity'

function isElhamyaliEmbedUrl(rawUrl: unknown): boolean {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return false
  }

  try {
    const parsed = new URL(rawUrl.trim())
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false
    }
    const host = parsed.hostname.toLowerCase()
    return host === 'elhamyali.com' || host === 'www.elhamyali.com'
  } catch {
    return false
  }
}

export const embedBlock = defineType({
  name: 'embedBlock',
  title: 'Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description:
        'Share link from a supported provider (YouTube, or a page on elhamyali.com / www.elhamyali.com).',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional line below the embed.',
      validation: (Rule) => Rule.max(200).warning('Consider ≤ 200 chars.'),
    }),
    defineField({
      name: 'showOpenLink',
      title: 'Show open link',
      type: 'boolean',
      description: 'Show a link below the embed to open the full page in a new tab.',
      initialValue: true,
      hidden: ({parent}) => !isElhamyaliEmbedUrl((parent as {url?: unknown} | undefined)?.url),
    }),
    defineField({
      name: 'openLinkLabel',
      title: 'Open link label',
      type: 'string',
      description: 'Label for the open link. Defaults to “Open full story”.',
      initialValue: 'Open full story',
      hidden: ({parent}) => {
        const p = parent as {url?: unknown; showOpenLink?: boolean} | undefined
        if (!isElhamyaliEmbedUrl(p?.url)) {
          return true
        }
        return p?.showOpenLink === false
      },
      validation: (Rule) => Rule.max(80).warning('Consider ≤ 80 chars.'),
    }),
  ],
  preview: {
    select: {
      url: 'url',
      caption: 'caption',
    },
    prepare({url, caption}) {
      const href = typeof url === 'string' ? url.trim() : ''
      const label = typeof caption === 'string' && caption.trim().length > 0 ? caption.trim() : href
      const isStory = isElhamyaliEmbedUrl(href)
      return {
        title: label || 'Embed',
        subtitle: href
          ? isStory
            ? 'Story / webpage embed'
            : 'Video / iframe embed'
          : 'Add a supported URL',
      }
    },
  },
})
