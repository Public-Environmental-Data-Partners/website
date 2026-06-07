import {cva, type VariantProps} from 'class-variance-authority'
import type * as React from 'react'

import {cn} from '@/lib/utils'

/**
 * Fixed site column (layout-system SiteShell).
 * Geometry: docs/layout-system.md — max width + padding from CSS vars in globals.css.
 */
const siteShellVariants = cva('mx-auto w-full max-w-site', {
  variants: {
    padding: {
      default: [
        'px-[var(--site-padding-x)]',
        'py-[var(--section-padding-y)]',
        'md:py-[var(--section-padding-y-md)]',
      ],
      none: 'p-0',
      /** §04 simple-grid-hero: leading inset; trailing flush @ md+ */
      heroTrailingFlush: [
        'px-[var(--site-padding-x)]',
        'py-[var(--section-padding-y)]',
        'md:py-[var(--section-padding-y-md)]',
        'md:pe-0',
      ],
      /** §05 split-hero-bleed: hero-scoped leading inset; trailing flush @ md+ */
      splitHero: [
        'ps-[var(--hero-shell-padding-x,var(--site-padding-x))]',
        'pe-[var(--hero-shell-padding-x,var(--site-padding-x))]',
        'py-0',
        'md:pe-0',
      ],
      /** §07 article-detail-hero: same shell geometry as splitHero */
      detailHero: [
        'ps-[var(--hero-shell-padding-x,var(--site-padding-x))]',
        'pe-[var(--hero-shell-padding-x,var(--site-padding-x))]',
        'py-0',
        'md:pe-0',
      ],
      /** §06 hub listing: equal inset @ < md; leading flush + trailing inset @ md+ */
      hubListing: [
        'px-[var(--site-padding-x)]',
        'py-[var(--section-padding-y)]',
        'md:px-0',
        'md:py-[var(--section-padding-y-md)]',
        'md:pe-[var(--site-padding-x)]',
      ],
    },
  },
  defaultVariants: {
    padding: 'default',
  },
})

function SiteShell({
  className,
  padding,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof siteShellVariants>) {
  return (
    <div
      data-slot="site-shell"
      data-padding={padding ?? 'default'}
      className={cn(siteShellVariants({padding, className}))}
      {...props}
    />
  )
}

export {SiteShell, siteShellVariants}
