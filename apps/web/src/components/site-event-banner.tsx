import {SiteEventBannerClient} from '@/components/site-event-banner-client'
import type {SiteEventBannerPlacement} from '@/lib/mappers/site-event-banner'
import {getSiteEventBanner} from '@/lib/site-event-banner'

/**
 * Site-wide upcoming-event bar. Renders when CMS copy is complete and
 * `placement` matches. The client shows it only inside the start/end window.
 */
export async function SiteEventBanner({placement}: {placement: SiteEventBannerPlacement}) {
  const banner = await getSiteEventBanner()
  if (!banner || banner.placement !== placement) {
    return null
  }
  return <SiteEventBannerClient banner={banner} />
}
