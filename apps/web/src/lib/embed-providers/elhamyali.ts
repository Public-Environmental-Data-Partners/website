import type {EmbedProvider} from '@/lib/embed-providers/types'

const ELHAMYALI_HOSTS = new Set(['elhamyali.com', 'www.elhamyali.com'])

/** True when `hostname` is an allowlisted Elham Ali story host. */
export function isElhamyaliHost(hostname: string): boolean {
  return ELHAMYALI_HOSTS.has(hostname.toLowerCase())
}

/**
 * True when `rawUrl` parses as an http(s) URL on an allowlisted Elham Ali host.
 * Used by Studio `hidden` callbacks and the web provider.
 */
export function isElhamyaliEmbedUrl(rawUrl: unknown): boolean {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return false
  }

  try {
    const parsed = new URL(rawUrl.trim())
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false
    }
    return isElhamyaliHost(parsed.hostname)
  } catch {
    return false
  }
}

export const elhamyaliEmbedProvider: EmbedProvider = {
  id: 'elhamyali',
  label: 'Elham Ali story',
  matches(url) {
    return isElhamyaliHost(url.hostname)
  },
  resolve(url) {
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null
    }

    // Prefer https for the iframe src when the editor pasted http.
    const src = new URL(url.href)
    src.protocol = 'https:'

    return {
      src: src.toString(),
      title: 'Embedded story',
      aspect: 'fixed',
      fixedHeight: '80vh',
    }
  },
}
