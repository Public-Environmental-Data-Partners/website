import {SanityLive} from '@/sanity/live'

/**
 * Sanity Live calls `router.refresh()` when Content Lake sends events or reconnects.
 * Under Turbopack that can devolve into rapid refreshes, Turbopack panics, and visible flicker.
 * Development skips the subscriber. Production revalidates cached pages when published content changes.
 */
export function SanityLiveRoot() {
  if (process.env.NODE_ENV === 'development') {
    return null
  }

  return <SanityLive />
}
