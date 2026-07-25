import {ArrowUpRight} from 'lucide-react'
import Link from 'next/link'
import type {ComponentPropsWithoutRef, ReactNode} from 'react'

type ContentLinkProps = {
  href: string
  /** When true: new tab, noopener, and trailing external icon (unless disabled). */
  external?: boolean
  children: ReactNode
  /**
   * Omit the trailing icon while keeping new-tab behavior.
   * Use when the icon is placed next to an inner label (e.g. whole-card links).
   */
  showExternalIcon?: boolean
  className?: string
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'target' | 'rel' | 'children' | 'className'>

/** Shared external affordance — keep identical across CTAs and inline links. */
export function ContentLinkExternalIcon() {
  return (
    <>
      <span className="whitespace-nowrap">
        {'\u00a0'}
        <ArrowUpRight className="inline-block size-5 align-[-0.2em]" aria-hidden />
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </>
  )
}

/**
 * Shared CMS/app link renderer.
 * Internal → Next.js `Link` (same tab). External → `<a target="_blank">` + icon.
 */
export function ContentLink({
  href,
  external = false,
  children,
  showExternalIcon = true,
  className,
  ...rest
}: ContentLinkProps) {
  const body = (
    <>
      {children}
      {external && showExternalIcon ? <ContentLinkExternalIcon /> : null}
    </>
  )

  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
        {body}
      </a>
    )
  }

  return (
    <Link href={href} className={className} {...rest}>
      {body}
    </Link>
  )
}
