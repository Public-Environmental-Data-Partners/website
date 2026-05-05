'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {isActiveNavPath} from '@/lib/nav-active'
import {cn} from '@/lib/utils'

const base =
  'font-sans font-medium leading-[1.35] transition-colors focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer)] text-base lg:text-lg'

export function FooterNavLink({
  href,
  label,
  className,
}: {
  href: string
  label: string
  className?: string
}) {
  const pathname = usePathname()
  const active = isActiveNavPath(pathname, href)

  return (
    <Link
      href={href}
      className={cn(
        base,
        className,
        active
          ? 'text-footer-foreground font-semibold underline decoration-footer-foreground/45 underline-offset-4'
          : 'text-footer-foreground/90 hover:text-footer-foreground',
      )}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}
