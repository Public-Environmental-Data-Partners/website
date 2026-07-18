'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {isActiveNavPath} from '@/lib/nav-active'
import {cn} from '@/lib/utils'

const base =
  'font-sans text-[1.375rem] leading-none whitespace-nowrap underline-offset-4 transition-colors hover:underline'

export function HeaderNavLink({href, label}: {href: string; label: string}) {
  const pathname = usePathname()
  const active = isActiveNavPath(pathname, href)

  return (
    <Link
      href={href}
      className={cn(
        base,
        active
          ? 'text-foreground font-semibold underline decoration-foreground'
          : 'text-muted-foreground font-normal hover:text-foreground',
      )}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}
