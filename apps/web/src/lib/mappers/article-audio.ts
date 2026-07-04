import type {NewsPostAudioFields} from '@/lib/mappers/news-post'

/** Props for ArticleAudioSection (Phase 4). */
export type ArticleAudioSectionProps = {
  audioSrc: string
  durationMinutes: number
  introSectionHeading: string
}

export function mapArticleAudioSectionProps(
  audio: NewsPostAudioFields | null | undefined,
): ArticleAudioSectionProps | null {
  const audioSrc = audio?.file?.asset?.url?.trim()
  if (!audioSrc) {
    return null
  }

  const durationMinutes = audio?.durationMinutes
  if (
    typeof durationMinutes !== 'number' ||
    !Number.isFinite(durationMinutes) ||
    durationMinutes < 1
  ) {
    return null
  }

  const introSectionHeading = audio?.introSectionHeading?.trim()
  if (!introSectionHeading) {
    return null
  }

  return {
    audioSrc,
    durationMinutes: Math.trunc(durationMinutes),
    introSectionHeading,
  }
}
