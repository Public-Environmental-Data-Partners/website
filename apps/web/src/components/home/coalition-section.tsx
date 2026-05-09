'use client'

import Image from 'next/image'
import type {ReactNode} from 'react'

import {usePrefersReducedMotion} from '@/lib/use-prefers-reduced-motion'

type CoalitionPartner = {
  name: string
  href: string
  ariaLabel: string
  logoSrc: string
  logoAlt: string
  logoWidth?: number
  logoHeight?: number
}

export type CoalitionSectionProps = {
  heading: string
  partners: CoalitionPartner[]
  /** CMS toggle; `prefers-reduced-motion` forces scroll fallback instead of marquee. */
  useMarquee: boolean
}

function logoDimension(value: number | undefined, fallback: number) {
  return typeof value === 'number' && value > 0 ? value : fallback
}

function CoalitionLogo({partner, decorative}: {partner: CoalitionPartner; decorative?: boolean}) {
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
  partners: CoalitionPartner[]
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
            className="inline-flex items-center justify-center"
          >
            <CoalitionLogo partner={partner} />
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
function MarqueeDuplicatePartnerRow({partners}: {partners: CoalitionPartner[]}) {
  return (
    <ul aria-hidden className="flex shrink-0 items-center gap-6 md:gap-8">
      {partners.map((partner) => (
        <li key={`${partner.href}-dup`}>
          <a
            href={partner.href}
            tabIndex={-1}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center"
          >
            <CoalitionLogo partner={partner} decorative />
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Static wrapping grid when marquee is off (CMS). */
function CoalitionWrappedPanel({partners}: {partners: CoalitionPartner[]}) {
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
              className="inline-flex items-center justify-center"
            >
              <CoalitionLogo partner={partner} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Horizontal strip when marquee is on but motion is reduced (no infinite animation). */
function CoalitionScrollPanel({partners}: {partners: CoalitionPartner[]}) {
  return (
    <div className="-mx-6 overflow-x-auto px-6 pb-2 md:mx-0 md:px-0">
      <InteractivePartnerRow layout="scroll" partners={partners} />
    </div>
  )
}

/** CSS marquee when CMS marquee is on and motion is OK; pause on hover/focus via globals.css. */
function CoalitionMarqueePanel({partners}: {partners: CoalitionPartner[]}) {
  return (
    <div className="coalition-marquee-root -mx-6 overflow-hidden px-6 pb-2 md:mx-0 md:px-0">
      <div className="coalition-marquee-track flex w-max gap-6 md:gap-8">
        <InteractivePartnerRow layout="marquee" partners={partners} />
        <MarqueeDuplicatePartnerRow partners={partners} />
      </div>
    </div>
  )
}

export function CoalitionSection({heading, partners, useMarquee}: CoalitionSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (partners.length === 0) {
    return null
  }

  const headingId = 'coalition-partners-heading'

  let strip: ReactNode
  if (useMarquee && !prefersReducedMotion) {
    strip = <CoalitionMarqueePanel partners={partners} />
  } else if (useMarquee && prefersReducedMotion) {
    strip = <CoalitionScrollPanel partners={partners} />
  } else {
    strip = <CoalitionWrappedPanel partners={partners} />
  }

  return (
    <section className="bg-white dark:bg-background" aria-labelledby={headingId}>
      <div className="mx-auto w-full max-w-site px-6 py-10 md:px-12 md:py-14">
        <h2 id={headingId} className="section-label-heading text-muted-foreground mb-5 md:mb-7">
          {heading}
        </h2>
        {strip}
      </div>
    </section>
  )
}
