'use client'

import Image from 'next/image'
import type {ReactNode} from 'react'

import {ContentStack, SectionBand, SiteShell} from '@/components/layout'
import {usePrefersReducedMotion} from '@/lib/use-prefers-reduced-motion'

type PartnerLogo = {
  name: string
  href: string
  ariaLabel: string
  logoSrc: string
  logoAlt: string
  logoWidth?: number
  logoHeight?: number
}

export type PartnerLogosSectionProps = {
  sectionHeading: string
  partners: PartnerLogo[]
  /** CMS toggle; `prefers-reduced-motion` forces scroll fallback instead of marquee. */
  useMarquee: boolean
  /** Unique heading id when multiple partner logo bands appear on one page. */
  headingId?: string
}

function logoDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

function PartnerLogoImage({partner, decorative}: {partner: PartnerLogo; decorative?: boolean}) {
  const width = logoDimension(partner.logoWidth, 240)
  const height = logoDimension(partner.logoHeight, 120)

  return (
    <Image
      src={partner.logoSrc}
      alt={decorative ? '' : partner.logoAlt}
      width={width}
      height={height}
      className="h-11 w-auto max-w-none object-contain md:h-14"
      aria-hidden={decorative ? true : undefined}
    />
  )
}

function InteractivePartnerRow({
  partners,
  layout,
}: {
  partners: PartnerLogo[]
  layout: 'scroll' | 'marquee'
}) {
  const rowClass =
    layout === 'scroll'
      ? 'flex w-max min-w-full shrink-0 items-center gap-6 md:justify-center md:gap-8'
      : 'flex shrink-0 items-center gap-6 md:gap-8'

  return (
    <ul className={rowClass}>
      {partners.map((partner) => (
        <li key={partner.href}>
          <a
            href={partner.href}
            aria-label={partner.ariaLabel}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center transition-opacity hover:opacity-80"
          >
            <PartnerLogoImage partner={partner} />
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * Second marquee loop: real links so pointer users always hit a target; `tabIndex={-1}` skips
 * duplicates in tab order; `aria-hidden` hides the strip from SR (names live on the first row).
 */
function MarqueeDuplicatePartnerRow({partners}: {partners: PartnerLogo[]}) {
  return (
    <ul aria-hidden className="flex shrink-0 items-center gap-6 md:gap-8">
      {partners.map((partner) => (
        <li key={`${partner.href}-dup`}>
          <a
            href={partner.href}
            tabIndex={-1}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center transition-opacity hover:opacity-80"
          >
            <PartnerLogoImage partner={partner} decorative />
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Static wrapping grid when marquee is off (CMS). */
function PartnerLogosWrappedPanel({partners}: {partners: PartnerLogo[]}) {
  return (
    <div className="pb-2">
      <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:gap-x-10 md:gap-y-8">
        {partners.map((partner) => (
          <li key={partner.href}>
            <a
              href={partner.href}
              aria-label={partner.ariaLabel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center transition-opacity hover:opacity-80"
            >
              <PartnerLogoImage partner={partner} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Horizontal strip when marquee is on but motion is reduced (no infinite animation). */
function PartnerLogosScrollPanel({partners}: {partners: PartnerLogo[]}) {
  return (
    <div className="-mx-[var(--site-padding-x)] overflow-x-auto px-[var(--site-padding-x)] pb-2 md:mx-0 md:px-0">
      <InteractivePartnerRow layout="scroll" partners={partners} />
    </div>
  )
}

/** CSS marquee when CMS marquee is on and motion is OK; pause on hover/focus via globals.css. */
function PartnerLogosMarqueePanel({partners}: {partners: PartnerLogo[]}) {
  return (
    <div className="partner-logos-marquee-root -mx-[var(--site-padding-x)] overflow-hidden px-[var(--site-padding-x)] pb-2 md:mx-0 md:px-0">
      <div className="partner-logos-marquee-track flex w-max gap-6 md:gap-8">
        <InteractivePartnerRow layout="marquee" partners={partners} />
        <MarqueeDuplicatePartnerRow partners={partners} />
      </div>
    </div>
  )
}

/** `partnerLogosSection` CMS block: partner org logos (grid, scroll, or marquee). */
export function PartnerLogosSection({
  sectionHeading,
  partners,
  useMarquee,
  headingId = 'partner-logos-heading',
}: PartnerLogosSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (partners.length === 0) {
    return null
  }

  let strip: ReactNode
  if (useMarquee && !prefersReducedMotion) {
    strip = <PartnerLogosMarqueePanel partners={partners} />
  } else if (useMarquee && prefersReducedMotion) {
    strip = <PartnerLogosScrollPanel partners={partners} />
  } else {
    strip = <PartnerLogosWrappedPanel partners={partners} />
  }

  return (
    <SectionBand className="bg-cream" aria-labelledby={headingId}>
      <SiteShell>
        <ContentStack className="gap-10 md:gap-12">
          <h2
            id={headingId}
            className="section-label-heading text-muted-foreground text-center md:text-left"
          >
            {sectionHeading}
          </h2>
          {strip}
        </ContentStack>
      </SiteShell>
    </SectionBand>
  )
}
