import type {EmbedProvider} from '@/lib/embed-providers/types'

function parseYouTubeVideoId(url: URL): string | null {
  const host = url.hostname.toLowerCase()

  if (host === 'youtu.be') {
    const id = url.pathname.split('/').filter(Boolean)[0]
    return id && /^[\w-]{11}$/.test(id) ? id : null
  }

  if (host !== 'youtube.com' && !host.endsWith('.youtube.com')) {
    return null
  }

  if (url.pathname.startsWith('/watch')) {
    const id = url.searchParams.get('v')
    return id && /^[\w-]{11}$/.test(id) ? id : null
  }

  const segments = url.pathname.split('/').filter(Boolean)
  const embedPrefixes = ['embed', 'shorts', 'live']
  if (segments.length >= 2 && embedPrefixes.includes(segments[0])) {
    const id = segments[1]
    return id && /^[\w-]{11}$/.test(id) ? id : null
  }

  return null
}

function isYouTubeHost(hostname: string): boolean {
  const host = hostname.toLowerCase()
  if (host === 'youtu.be') {
    return true
  }
  return host === 'youtube.com' || host.endsWith('.youtube.com')
}

export const youtubeEmbedProvider: EmbedProvider = {
  id: 'youtube',
  label: 'YouTube',
  matches(url) {
    return isYouTubeHost(url.hostname)
  },
  resolve(url) {
    const videoId = parseYouTubeVideoId(url)
    if (!videoId) {
      return null
    }

    return {
      src: `https://www.youtube-nocookie.com/embed/${videoId}`,
      title: 'YouTube video',
      aspect: 'video',
    }
  },
}
