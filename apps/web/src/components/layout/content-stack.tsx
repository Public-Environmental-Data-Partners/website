import type * as React from 'react'

import {cn} from '@/lib/utils'

/**
 * Vertical stack: section heading + main content slot (§01 contained-band).
 * Gap matches docs/layout-prototype.html `.contained-band__stack`.
 */
function ContentStack({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="content-stack"
      className={cn('flex flex-col gap-5 md:gap-7', className)}
      {...props}
    />
  )
}

export {ContentStack}
