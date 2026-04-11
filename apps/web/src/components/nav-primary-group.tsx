'use client'

import {ChevronDown} from 'lucide-react'
import Link from 'next/link'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type NavLeaf = {label: string; href: string}

export function NavPrimaryGroup({id, label, items}: {id: string; label: string; items: NavLeaf[]}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground data-[state=open]:text-foreground inline-flex items-center gap-1 rounded-sm font-sans text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <span>{label}</span>
        <ChevronDown aria-hidden className="size-4 shrink-0 opacity-90" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[12rem]">
        {items.map((item) => (
          <DropdownMenuItem key={`${id}-${item.href}`} asChild>
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
