'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {isActiveNavPath} from '@/lib/nav-active'
import {cn} from '@/lib/utils'

const focusRing =
  'focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer)]'

/** Primary footer links / group titles — Figtree Bold 24px / 100%. */
const primaryClass = cn('font-sans text-2xl font-bold leading-none transition-colors', focusRing)

/** What We Do sublinks — Figtree Medium 18px / 100%. */
const subClass = cn('font-sans text-lg font-medium leading-none transition-colors', focusRing)

export function FooterNavLink({
  href,
  label,
  variant = 'primary',
  className,
}: {
  href: string
  label: string
  variant?: 'primary' | 'sub'
  className?: string
}) {
  const pathname = usePathname()
  const active = isActiveNavPath(pathname, href)

  return (
    <Link
      href={href}
      className={cn(
        variant === 'sub' ? subClass : primaryClass,
        className,
        active
          ? 'text-footer-foreground underline decoration-footer-foreground underline-offset-4'
          : 'text-footer-foreground hover:underline',
      )}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}
