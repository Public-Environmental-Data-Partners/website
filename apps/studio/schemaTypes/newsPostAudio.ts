import {defineField, defineType} from 'sanity'

type NewsPostAudioParent = {
  file?: {asset?: {_ref?: string}} | null
}

function hasAudioFile(parent: NewsPostAudioParent | undefined): boolean {
  return Boolean(parent?.file?.asset?._ref)
}

/** Optional listen row on article detail — one per news post. */
export const newsPostAudio = defineType({
  name: 'newsPostAudio',
  title: 'Article audio',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  description:
    'Optional “Listen” row below the hero photo credit. Omit the file to hide the row on the site.',
  fields: [
    defineField({
      name: 'file',
      title: 'Audio file',
      type: 'file',
      description:
        'Upload MP3 or M4A (max ~20 MB). Optional — omit to hide the listen row on the article page.',
      options: {
        accept: 'audio/mpeg,audio/mp4,audio/x-m4a,.mp3,.m4a',
      },
    }),
    defineField({
      name: 'durationMinutes',
      title: 'Duration (minutes)',
      type: 'number',
      description: 'Whole minutes shown in the listen pill, e.g. 3 → “3 MINS” / “LISTEN: 3 MINS”.',
      validation: (Rule) =>
        Rule.integer()
          .min(1)
          .max(999)
          .custom((value, context) => {
            if (!hasAudioFile(context.parent as NewsPostAudioParent)) {
              return true
            }
            if (typeof value !== 'number' || !Number.isFinite(value)) {
              return 'Required when an audio file is uploaded.'
            }
            return true
          }),
    }),
    defineField({
      name: 'introSectionHeading',
      title: 'Intro section heading',
      type: 'string',
      description:
        'Section label beside the listen control (e.g. “Overview”). Shown only when audio is set.',
      validation: (Rule) =>
        Rule.max(80)
          .warning('Consider ≤ 80 chars.')
          .custom((value, context) => {
            if (!hasAudioFile(context.parent as NewsPostAudioParent)) {
              return true
            }
            const text = typeof value === 'string' ? value.trim() : ''
            if (!text) {
              return 'Required when an audio file is uploaded.'
            }
            return true
          }),
    }),
  ],
  preview: {
    select: {
      heading: 'introSectionHeading',
      durationMinutes: 'durationMinutes',
      fileName: 'file.asset.originalFilename',
    },
    prepare({heading, durationMinutes, fileName}) {
      const label = typeof heading === 'string' ? heading.trim() : ''
      const mins = typeof durationMinutes === 'number' ? durationMinutes : null
      const file = typeof fileName === 'string' ? fileName.trim() : ''
      const parts = [
        label || undefined,
        mins != null ? `${mins} min` : undefined,
        file || undefined,
      ].filter(Boolean)
      return {
        title: 'Article audio',
        subtitle: parts.length > 0 ? parts.join(' · ') : 'No file — hidden on site',
      }
    },
  },
})
