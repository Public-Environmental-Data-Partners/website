'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {isActiveNavPath} from '@/lib/nav-active'
import {cn} from '@/lib/utils'

const pill =
  'inline-flex min-h-10 shrink-0 items-center justify-center rounded-[4px] px-5 py-2 text-sm font-semibold transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none'

export function DonateLink({
  href,
  label,
  variant = 'header',
  className,
}: {
  href: string
  label: string
  /** `footer` uses footer background for focus ring offset so the halo matches the band. */
  variant?: 'header' | 'footer'
  className?: string
}) {
  const pathname = usePathname()
  const active = isActiveNavPath(pathname, href)
  const ringOffsetClass =
    variant === 'footer'
      ? 'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer)]'
      : 'focus-visible:ring-offset-2 focus-visible:ring-offset-light-beige'

  return (
    <Link
      href={href}
      className={cn(
        pill,
        ringOffsetClass,
        'focus-visible:ring-ring focus-visible:ring-2',
        active
          ? 'bg-pedp-green text-off-white ring-2 ring-off-white/40 ring-offset-2'
          : 'bg-pedp-green text-off-white hover:bg-pedp-green/90',
        className,
      )}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}
