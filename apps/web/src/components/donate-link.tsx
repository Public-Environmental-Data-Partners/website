'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {isActiveNavPath} from '@/lib/nav-active'
import {cn} from '@/lib/utils'

const base =
  'inline-flex shrink-0 items-center justify-center font-semibold transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none'

/** Header Donate — Figma: 121×65, radius 10, pad 16/8, light-green. */
const headerClass =
  'h-[65px] w-[121px] rounded-[10px] px-2 py-4 text-center align-middle text-[1.375rem] leading-5'

const footerClass = 'min-h-10 rounded-[4px] px-5 py-2 text-sm'

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
        base,
        variant === 'header' ? headerClass : footerClass,
        ringOffsetClass,
        'focus-visible:ring-ring focus-visible:ring-2',
        active
          ? 'bg-light-green text-dark-green ring-2 ring-dark-green/40 ring-offset-2'
          : 'bg-light-green text-dark-green hover:bg-light-green/90',
        className,
      )}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}
