import {draftMode} from 'next/headers'

import {SanityLive} from '@/sanity/live'

/**
 * Sanity Live calls `router.refresh()` when Content Lake sends events or reconnects.
 * Under Turbopack that can devolve into rapid refreshes, Turbopack panics, and visible flicker.
 * In development we only mount the subscriber when draft preview is on; refresh manually or
 * enable preview otherwise. Production keeps live updates for published content.
 */
export async function SanityLiveRoot() {
  const {isEnabled: isDraftMode} = await draftMode()

  if (process.env.NODE_ENV === 'development' && !isDraftMode) {
    return null
  }

  return <SanityLive />
}
