'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {isActiveNavPath} from '@/lib/nav-active'
import {cn} from '@/lib/utils'

const base = 'font-sans text-sm font-medium whitespace-nowrap transition-colors'

export function HeaderNavLink({href, label}: {href: string; label: string}) {
  const pathname = usePathname()
  const active = isActiveNavPath(pathname, href)

  return (
    <Link
      href={href}
      className={cn(
        base,
        active
          ? 'text-foreground font-semibold underline decoration-foreground/40 underline-offset-4'
          : 'text-muted-foreground hover:text-foreground',
      )}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}

export function HeaderDonateLink({href, label}: {href: string; label: string}) {
  const pathname = usePathname()
  const active = isActiveNavPath(pathname, href)

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors',
        active
          ? 'bg-primary text-primary-foreground ring-2 ring-primary-foreground/35 ring-offset-2 ring-offset-background'
          : 'bg-primary text-primary-foreground hover:bg-primary/90',
      )}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}
