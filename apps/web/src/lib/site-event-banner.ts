import {draftMode} from 'next/headers'
import {connection} from 'next/server'
import {cache} from 'react'

import {CONTENT_LINK_GROQ} from '@/lib/content-link'
import {
  mapSiteEventBannerToProps,
  type SiteEventBannerFields,
  type SiteEventBannerProps,
} from '@/lib/mappers/site-event-banner'
import {sanityFetch} from '@/sanity/live'

const EVENT_BANNER_QUERY = `*[_type == "siteEventBanner" && _id == "siteEventBanner"][0]{
  sectionHeading,
  heading,
  placement,
  startsAt,
  endsAt,
  ctaLabel,
  ctaLink${CONTENT_LINK_GROQ}
}`

async function loadSiteEventBanner(): Promise<SiteEventBannerProps | null> {
  await connection()
  const {isEnabled: isDraftMode} = await draftMode()
  const {data} = await sanityFetch({
    query: EVENT_BANNER_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
  })
  return mapSiteEventBannerToProps(data as SiteEventBannerFields | null, new Date())
}

/** Site-wide event banner; null when missing, incomplete, or outside the date window. */
export const getSiteEventBanner = cache(loadSiteEventBanner)
