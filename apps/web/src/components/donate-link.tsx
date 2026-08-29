'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {Button} from '@/components/ui/button'
import {isActiveNavPath} from '@/lib/nav-active'
import {cn} from '@/lib/utils'

/** Header Donate — Figma: 121×65, radius 10. Overrides CTA min-width. */
const headerClass = 'w-[121px] min-w-[121px]'

const footerClass = 'h-auto min-h-10 rounded-[4px] px-5 py-2 text-sm font-semibold leading-5'

const sheetClass =
  'h-auto min-h-11 w-full rounded-[4px] px-5 py-3 text-[1.375rem] font-semibold leading-none'

export function DonateLink({
  href,
  label,
  variant = 'header',
  className,
  onNavigate,
}: {
  href: string
  label: string
  /** `footer` / `sheet` use the matching surface for focus ring offset. */
  variant?: 'header' | 'footer' | 'sheet'
  className?: string
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const active = isActiveNavPath(pathname, href)
  const ringOffsetClass =
    variant === 'footer'
      ? 'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer)]'
      : 'focus-visible:ring-offset-2 focus-visible:ring-offset-light-beige'

  return (
    <Button
      asChild
      variant="lightGreen"
      size={variant === 'header' ? 'cta' : 'default'}
      className={cn(
        variant === 'header' ? headerClass : variant === 'sheet' ? sheetClass : footerClass,
        ringOffsetClass,
        active && 'ring-2 ring-dark-green/40 ring-offset-2',
        className,
      )}
    >
      <Link href={href} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
        {label}
      </Link>
    </Button>
  )
}
