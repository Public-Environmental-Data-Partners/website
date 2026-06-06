import type * as React from 'react'

import {cn} from '@/lib/utils'

function HeroSplitGrid({className, ...props}: React.ComponentProps<'div'>) {
  return <div data-slot="hero-split-grid" className={cn(className)} {...props} />
}

function HeroSplitBleedColumn({className, ...props}: React.ComponentProps<'div'>) {
  return <div data-slot="hero-split-bleed-col" aria-hidden className={cn(className)} {...props} />
}

function HeroSplitContentColumn({className, ...props}: React.ComponentProps<'div'>) {
  return <div data-slot="hero-split-content-col" className={cn(className)} {...props} />
}

function HeroSplitWhiteBand({className, ...props}: React.ComponentProps<'div'>) {
  return <div data-slot="hero-split-white-band" aria-hidden className={cn(className)} {...props} />
}

function HeroSplitMobileBleed({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="hero-split-mobile-bleed"
      aria-hidden
      className={cn('md:hidden', className)}
      {...props}
    />
  )
}

function HeroSplitImageColumn({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div data-slot="hero-split-image-row" className={className}>
      <HeroSplitMobileBleed />
      <div data-slot="hero-split-image-col" {...props} />
    </div>
  )
}

/** Optional inner wrapper for image aspect-ratio / fill rules in hero-split-grid.css */
function HeroSplitImageFrame({className, ...props}: React.ComponentProps<'div'>) {
  return <div data-slot="hero-split-image-frame" className={cn(className)} {...props} />
}

function HeroSplitShelfRow({className, ...props}: React.ComponentProps<'div'>) {
  return <div data-slot="hero-split-shelf-row" className={cn(className)} {...props} />
}

export {
  HeroSplitBleedColumn,
  HeroSplitContentColumn,
  HeroSplitGrid,
  HeroSplitImageColumn,
  HeroSplitImageFrame,
  HeroSplitMobileBleed,
  HeroSplitShelfRow,
  HeroSplitWhiteBand,
}
