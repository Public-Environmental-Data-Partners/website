import Link from 'next/link'

import {HeaderDonateLink, HeaderNavLink} from '@/components/header-nav-link'
import {MobilePrimaryNavSheet} from '@/components/mobile-primary-nav-sheet'
import {NavPrimaryGroup} from '@/components/nav-primary-group'
import {donateNav, mainNav} from '@/config/nav'
import {siteName} from '@/config/site'

/** Global header; nav data from `config/nav`. Desktop: inline nav + dropdown; mobile: sheet. */
export function SiteHeader() {
  return (
    <header className="border-border bg-background border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-sans min-w-0 shrink text-base font-semibold tracking-tight text-foreground hover:underline"
        >
          {siteName}
        </Link>

        <div className="flex min-w-0 items-center justify-end gap-3 lg:flex-1">
          <nav
            aria-label="Primary"
            className="hidden flex-wrap items-center justify-end gap-x-4 gap-y-2 lg:flex lg:gap-x-6"
          >
            {mainNav.map((entry) =>
              entry.kind === 'group' ? (
                <NavPrimaryGroup
                  key={entry.id}
                  id={entry.id}
                  label={entry.label}
                  items={entry.items}
                />
              ) : (
                <HeaderNavLink key={entry.href} label={entry.label} href={entry.href} />
              ),
            )}

            <HeaderDonateLink href={donateNav.href} label={donateNav.label} />
          </nav>

          <div className="lg:hidden">
            <MobilePrimaryNavSheet />
          </div>
        </div>
      </div>
    </header>
  )
}
