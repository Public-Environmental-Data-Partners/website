import {ContentLink} from '@/components/content-link'
import {SiteShell} from '@/components/layout'
import {Button} from '@/components/ui/button'
import type {SiteEventBannerPlacement, SiteEventBannerProps} from '@/lib/mappers/site-event-banner'
import {getSiteEventBanner} from '@/lib/site-event-banner'

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

function EventBannerChrome({
  sectionHeading,
  heading,
  ctaLabel,
  ctaHref,
  ctaExternal,
}: SiteEventBannerProps) {
  return (
    <aside data-slot="site-event-banner" aria-label={sectionHeading}>
      <SiteShell padding="none" className="px-[var(--site-padding-x)] py-4">
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-dark-beige px-5 py-6 text-cream md:flex-row md:items-center md:justify-between md:gap-6 md:px-6 md:py-4">
          <p className="flex min-w-0 flex-col gap-2 font-sans font-normal leading-snug text-cream md:block">
            <span className="text-2xl font-semibold md:text-base">{sectionHeading}</span>
            <span className="hidden md:inline"> </span>
            <span className="text-xl md:text-base">{heading}</span>
          </p>
          {ctaHref && ctaLabel ? (
            <div className="shrink-0">
              <EventBannerCta href={ctaHref} label={ctaLabel} external={ctaExternal} />
            </div>
          ) : null}
        </div>
      </SiteShell>
    </aside>
  )
}

/**
 * Site-wide upcoming-event bar. Renders only when CMS copy is complete, the
 * current time is inside the start/end window, and `placement` matches.
 */
export async function SiteEventBanner({placement}: {placement: SiteEventBannerPlacement}) {
  const banner = await getSiteEventBanner()
  if (!banner || banner.placement !== placement) {
    return null
  }
  return <EventBannerChrome {...banner} />
}
