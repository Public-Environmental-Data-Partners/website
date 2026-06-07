import type * as React from 'react'

import {cn} from '@/lib/utils'

function ArticleDetailHeroGrid({className, ...props}: React.ComponentProps<'div'>) {
  return <div data-slot="article-detail-hero-grid" className={cn(className)} {...props} />
}

function ArticleDetailAccentColumn({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div data-slot="article-detail-accent-col" aria-hidden className={cn(className)} {...props} />
  )
}

function ArticleDetailTopBeigeBand({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div data-slot="article-detail-top-beige" aria-hidden className={cn(className)} {...props} />
  )
}

function ArticleDetailContentColumn({className, ...props}: React.ComponentProps<'div'>) {
  return <div data-slot="article-detail-content-col" className={cn(className)} {...props} />
}

function ArticleDetailBottomBand({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div data-slot="article-detail-bottom-band" aria-hidden className={cn(className)} {...props} />
  )
}

function ArticleDetailMobileBleed({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="article-detail-mobile-bleed"
      aria-hidden
      className={cn('md:hidden', className)}
      {...props}
    />
  )
}

function ArticleDetailImageColumn({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div data-slot="article-detail-image-row" className={className}>
      <ArticleDetailMobileBleed />
      <div data-slot="article-detail-image-col" {...props} />
    </div>
  )
}

function ArticleDetailImageFrame({className, ...props}: React.ComponentProps<'div'>) {
  return <div data-slot="article-detail-image-frame" className={cn(className)} {...props} />
}

export {
  ArticleDetailAccentColumn,
  ArticleDetailBottomBand,
  ArticleDetailContentColumn,
  ArticleDetailHeroGrid,
  ArticleDetailImageColumn,
  ArticleDetailImageFrame,
  ArticleDetailMobileBleed,
  ArticleDetailTopBeigeBand,
}
