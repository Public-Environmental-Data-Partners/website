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
      /**
       * Grid / article hero: viewport inset below 1400px; full 1400 grid when shell is maxed.
       * See docs/layout-system.md — Grid box vs viewport inset.
       */
      grid: [
        'px-[var(--site-padding-x)]',
        'md:px-[var(--site-padding-x-md)]',
        'min-[87.5rem]:px-0',
        'py-0',
      ],
      /** §04 simple-grid-hero: leading inset; trailing flush @ md+ */
      heroTrailingFlush: [
        'px-[var(--site-padding-x)]',
        'py-[var(--section-padding-y)]',
        'md:py-[var(--section-padding-y-md)]',
        'md:pe-0',
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
