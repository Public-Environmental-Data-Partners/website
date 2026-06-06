import type * as React from 'react'

import {cn} from '@/lib/utils'

type SectionBandProps = React.ComponentProps<'section'> & {
  /** Clip horizontal bleed children (default true for full-bleed archetypes). */
  overflowHidden?: boolean
}

/**
 * Full-viewport section wrapper (layout-system SectionBand).
 * Background and typography live in className / children — not layout geometry.
 */
function SectionBand({className, overflowHidden = true, ...props}: SectionBandProps) {
  return (
    <section
      data-slot="section-band"
      className={cn(overflowHidden && 'overflow-x-hidden', className)}
      {...props}
    />
  )
}

export {SectionBand}
