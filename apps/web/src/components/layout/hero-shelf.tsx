import type * as React from 'react'

import {cn} from '@/lib/utils'

function HeroShelf({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="hero-shelf"
      aria-hidden
      className={cn(className)}
      {...props}
    >
      <div data-slot="hero-shelf-leading-bleed" />
      <div data-slot="hero-shelf-segments">
        <div data-slot="hero-shelf-leading" />
        <div data-slot="hero-shelf-trailing" />
      </div>
    </div>
  )
}

export {HeroShelf}
