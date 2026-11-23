import {cache} from 'react'

import {CONTENT_LINK_GROQ} from '@/lib/content-link'
import {
  mapSiteEventBannerSchedule,
  type SiteEventBannerFields,
  type SiteEventBannerSchedule,
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

async function loadSiteEventBanner(): Promise<SiteEventBannerSchedule | null> {
  const {data} = await sanityFetch({
    query: EVENT_BANNER_QUERY,
    perspective: 'published',
  })
  return mapSiteEventBannerSchedule(data as SiteEventBannerFields | null)
}

/** Site-wide event banner fields. The client hides the bar outside the date window. */
export const getSiteEventBanner = cache(loadSiteEventBanner)
