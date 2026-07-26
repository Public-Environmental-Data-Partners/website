import type * as React from 'react'

import {cn} from '@/lib/utils'

/**
 * 12-column grid inside SiteShell (layout-system v2).
 * Geometry: docs/architecture/layout-system.md — 24px gutter via --grid-gutter.
 */
function Grid12({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="grid-12"
      className={cn('grid w-full grid-cols-12 gap-[var(--grid-gutter)]', className)}
      {...props}
    />
  )
}

export {Grid12}
