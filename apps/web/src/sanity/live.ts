import {defineLive} from 'next-sanity/live'

import {client} from '@/sanity/client'

export const {sanityFetch, SanityLive} = defineLive({
  client,
  /** Required for `perspective: 'drafts'` in server components (draft preview). */
  serverToken: process.env.SANITY_API_READ_TOKEN || false,
  browserToken: false,
})
