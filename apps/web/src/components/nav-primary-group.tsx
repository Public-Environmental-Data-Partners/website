'use client'

import {ChevronDown} from 'lucide-react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {isActiveNavPath} from '@/lib/nav-active'
import {cn} from '@/lib/utils'

type NavLeaf = {label: string; href: string}

export function NavPrimaryGroup({id, label, items}: {id: string; label: string; items: NavLeaf[]}) {
  const pathname = usePathname()
  const groupHasActive = items.some((item) => isActiveNavPath(pathname, item.href))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'data-[state=open]:text-foreground inline-flex items-center gap-1 rounded-sm font-sans text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          groupHasActive
            ? 'text-foreground font-semibold underline decoration-foreground/40 underline-offset-4'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <span>{label}</span>
        <ChevronDown aria-hidden className="size-4 shrink-0 opacity-90" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[12rem]">
        {items.map((item) => {
          const active = isActiveNavPath(pathname, item.href)
          return (
            <DropdownMenuItem key={`${id}-${item.href}`} asChild>
              <Link
                href={item.href}
                className={cn(active && 'bg-accent/50 font-semibold')}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
