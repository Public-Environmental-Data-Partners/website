import type {PortableTextMarkComponentProps} from '@portabletext/react'
import type {ReactNode} from 'react'

import {ContentLink} from '@/components/content-link'
import {type PortableTextLinkValue, resolvePortableTextLink} from '@/lib/content-link'

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

/** Factory for section-specific link classNames. */
export function contentLinkMark(className: string) {
  return function Mark(props: PortableTextMarkComponentProps<PortableTextLinkValue>) {
    return <ContentLinkMark {...props} className={className} />
  }
}
