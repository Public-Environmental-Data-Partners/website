import {elhamyaliEmbedProvider} from '@/lib/embed-providers/elhamyali'
import type {EmbedProvider, ResolvedEmbed} from '@/lib/embed-providers/types'
import {youtubeEmbedProvider} from '@/lib/embed-providers/youtube'

/** Allowlisted iframe embed providers — add entries here as new hosts are supported. */
export const EMBED_PROVIDERS: EmbedProvider[] = [youtubeEmbedProvider, elhamyaliEmbedProvider]

export {isElhamyaliEmbedUrl, isElhamyaliHost} from '@/lib/embed-providers/elhamyali'

export function resolveEmbedUrl(rawUrl: string): ResolvedEmbed | null {
  const trimmed = rawUrl.trim()
  if (!trimmed) {
    return null
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return null
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null
  }

  for (const provider of EMBED_PROVIDERS) {
    if (!provider.matches(parsed)) {
      continue
    }

    const resolved = provider.resolve(parsed)
    if (!resolved) {
      return null
    }

    return {
      providerId: provider.id,
      providerLabel: provider.label,
      ...resolved,
    }
  }

  return null
}

export type {EmbedAspect, EmbedProvider, ResolvedEmbed} from '@/lib/embed-providers/types'
