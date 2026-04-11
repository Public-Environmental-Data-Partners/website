import Link from 'next/link'

import {donateNav, mainNav} from '@/config/nav'
import {siteName} from '@/config/site'

function NavGroup({
  id,
  label,
  items,
}: {
  id: string
  label: string
  items: {label: string; href: string}[]
}) {
  return (
    <details className="group relative">
      <summary className="text-muted-foreground hover:text-foreground cursor-pointer list-none font-sans text-sm font-medium [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-1">
          {label}
          <span aria-hidden className="text-xs">
            ▾
          </span>
        </span>
      </summary>
      <ul
        className="border-border bg-background absolute left-0 z-20 mt-1 min-w-[12rem] rounded-md border py-1 shadow-md"
        role="list"
      >
        {items.map((item) => (
          <li key={`${id}-${item.href}`}>
            <Link
              href={item.href}
              className="text-foreground hover:bg-muted/80 block px-3 py-2 text-sm font-medium"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  )
}

function NavLinkItem({label, href}: {label: string; href: string}) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground font-sans text-sm font-medium whitespace-nowrap"
    >
      {label}
    </Link>
  )
}

/** Global header; nav data from `config/nav`. §g: Radix/shadcn dropdown; §h: mobile sheet. */
export function SiteHeader() {
  return (
    <header className="border-border bg-background border-b">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-y-0">
        <Link
          href="/"
          className="font-sans min-w-0 shrink text-base font-semibold tracking-tight text-foreground hover:underline"
        >
          {siteName}
        </Link>

        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end lg:gap-x-6"
        >
          {mainNav.map((entry) =>
            entry.kind === 'group' ? (
              <NavGroup key={entry.id} id={entry.id} label={entry.label} items={entry.items} />
            ) : (
              <NavLinkItem key={entry.href} label={entry.label} href={entry.href} />
            ),
          )}

          <Link
            href={donateNav.href}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex shrink-0 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors"
          >
            {donateNav.label}
          </Link>
        </nav>
      </div>
    </header>
  )
}
