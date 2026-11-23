import {defineLive} from 'next-sanity/live'

import {client} from '@/sanity/client'

export const {sanityFetch, SanityLive} = defineLive({
  client,
  /** Read token for published content on a private dataset. */
  serverToken: process.env.SANITY_API_READ_TOKEN || false,
  browserToken: false,
})
