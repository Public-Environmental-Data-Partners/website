'use client'

import {useSyncExternalStore} from 'react'

import {ContentLink} from '@/components/content-link'
import {SiteShell} from '@/components/layout'
import {Button} from '@/components/ui/button'
import {isWithinEventWindow, type SiteEventBannerSchedule} from '@/lib/mappers/site-event-banner'

function EventBannerCta({
  label,
  href,
  external,
}: {
  label: string
  href: string
  external?: boolean
}) {
  return (
    <Button
      asChild
      variant="offWhite"
      size="cta"
      className="rounded-full px-6 font-semibold text-off-black focus-visible:ring-offset-2 focus-visible:ring-offset-dark-beige md:min-h-9 md:min-w-0 md:px-5 md:py-2 md:text-sm md:leading-tight"
    >
      <ContentLink href={href} external={external}>
        {label}
      </ContentLink>
    </Button>
  )
}

function subscribeToClock(onStoreChange: () => void) {
  return () => {
    void onStoreChange
  }
}

/**
 * Shows the banner only while the visitor's clock is inside the CMS window.
 * The server render stays empty so a cached page does not flash a stale bar.
 */
export function SiteEventBannerClient({banner}: {banner: SiteEventBannerSchedule}) {
  const visible = useSyncExternalStore(
    subscribeToClock,
    () => isWithinEventWindow(banner.startsAt, banner.endsAt, new Date()),
    () => false,
  )

  if (!visible) {
    return null
  }

  return (
    <aside
      data-slot="site-event-banner"
      aria-label={banner.sectionHeading}
      className="bg-dark-beige text-cream"
    >
      <SiteShell padding="none" className="px-[var(--site-padding-x)] py-6 md:py-4">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-6">
          <p className="flex min-w-0 flex-col gap-2 font-sans font-normal leading-snug md:block">
            <span className="text-2xl font-semibold md:text-base">{banner.sectionHeading}</span>
            <span className="hidden md:inline"> </span>
            <span className="text-xl md:text-base">{banner.heading}</span>
          </p>
          {banner.ctaHref && banner.ctaLabel ? (
            <div className="shrink-0">
              <EventBannerCta
                href={banner.ctaHref}
                label={banner.ctaLabel}
                external={banner.ctaExternal}
              />
            </div>
          ) : null}
        </div>
      </SiteShell>
    </aside>
  )
}
