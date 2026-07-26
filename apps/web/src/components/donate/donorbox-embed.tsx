'use client'

import Script from 'next/script'

import {donorboxWidgetScriptSrc} from '@/lib/donorbox'

type DonorboxEmbedProps = {
  title: string
  embedUrl: string
  isPlaceholder?: boolean
  /** Form embeds are taller; the donor wall is shorter. */
  variant: 'form' | 'wall'
}

/**
 * Donorbox iframe embed.
 *
 * Form: loads widget.js + name="donorbox" so Donorbox can auto-resize the form.
 * Wall: fixed height, not named "donorbox", scrolling enabled. That keeps ~2 rows
 * visible with a browser scrollbar, without widget.js expanding to the full list.
 */
export function DonorboxEmbed({title, embedUrl, isPlaceholder, variant}: DonorboxEmbedProps) {
  const isWall = variant === 'wall'
  // Donorbox's own wall snippet uses min-height ~345px; that yields ~2 visible rows.
  const frameHeight = isWall ? 345 : 720

  if (isPlaceholder) {
    return (
      <div
        data-slot="donorbox-embed"
        data-variant={variant}
        data-placeholder="true"
        className="border-border bg-muted text-muted-foreground flex w-full min-w-0 items-center justify-center rounded-md border px-4 py-16 font-sans text-sm leading-snug"
        style={{minHeight: frameHeight}}
        role="status"
      >
        Donorbox campaign not configured yet. Set the campaign slug in Studio to load the live
        widget.
      </div>
    )
  }

  return (
    <div data-slot="donorbox-embed" data-variant={variant} className="min-w-0 w-full">
      {/* widget.js auto-resizes iframes named "donorbox" — only wanted for the form */}
      {!isWall ? <Script src={donorboxWidgetScriptSrc()} strategy="lazyOnload" /> : null}
      <iframe
        title={title}
        src={embedUrl}
        name={isWall ? 'donorbox-wall' : 'donorbox'}
        allow="payment"
        seamless
        loading="lazy"
        // Wall: keep a fixed box and let the browser scroll inside it.
        // Form: scrolling="no" — widget.js resizes the frame instead.
        scrolling={isWall ? 'yes' : 'no'}
        className="w-full border-0 bg-transparent"
        style={{
          height: frameHeight,
          minHeight: frameHeight,
          // Lock wall height so a page-level widget.js (from the form) cannot grow it.
          maxHeight: isWall ? frameHeight : undefined,
          minWidth: isWall ? 310 : 250,
        }}
      />
    </div>
  )
}
