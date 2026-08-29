import type {PortableTextMarkComponentProps} from '@portabletext/react'
import type {ReactNode} from 'react'

import {ContentLink} from '@/components/content-link'
import {type PortableTextLinkValue, resolvePortableTextLink} from '@/lib/content-link'
import {cn} from '@/lib/utils'

/** Shared body-copy link chrome. Callers add color; do not use on Button CTAs. */
export const contentLinkClass = 'underline underline-offset-2 transition-opacity hover:opacity-80'

type ContentLinkMarkProps = PortableTextMarkComponentProps<PortableTextLinkValue> & {
  className?: string
}

/**
 * Shared Portable Text `link` mark → ContentLink (internal same tab / external new tab + icon).
 * Supports legacy `href`-only marks until editors re-save links.
 */
export function ContentLinkMark({children, value, className}: ContentLinkMarkProps) {
  const resolved = resolvePortableTextLink(value)
  if (!resolved) {
    return <>{children}</>
  }

  return (
    <ContentLink href={resolved.href} external={resolved.external} className={className}>
      {children as ReactNode}
    </ContentLink>
  )
}

/** Factory for section-specific link classNames (color / offset). Hover is shared. */
export function contentLinkMark(className?: string) {
  return function Mark(props: PortableTextMarkComponentProps<PortableTextLinkValue>) {
    return <ContentLinkMark {...props} className={cn(contentLinkClass, className)} />
  }
}
