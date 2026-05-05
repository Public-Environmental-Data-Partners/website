import Image from 'next/image'
import Link from 'next/link'

import {DonateLink} from '@/components/donate-link'
import {HeaderNavLink} from '@/components/header-nav-link'
import {MobilePrimaryNavSheet} from '@/components/mobile-primary-nav-sheet'
import {NavPrimaryGroup} from '@/components/nav-primary-group'
import {donateNav, mainNav} from '@/config/nav'
import {siteName} from '@/config/site'

/** Global header; nav data from `config/nav`. Desktop: inline nav + dropdown; mobile: sheet. */
export function SiteHeader() {
  return (
    <header className="border-border bg-light-beige border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          aria-label={siteName}
          className="text-foreground focus-visible:ring-ring shrink-0 rounded-sm transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-light-beige focus-visible:outline-none"
        >
          <Image
            src="/brand/logo.webp"
            alt=""
            width={1500}
            height={458}
            priority
            className="hidden h-10 w-auto lg:block"
            sizes="(min-width: 1024px) 280px, 0px"
          />
          <Image
            src="/brand/icon.webp"
            alt=""
            width={60}
            height={50}
            priority
            className="h-9 w-auto lg:hidden"
            sizes="(max-width: 1023px) 36px, 0px"
          />
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

            <DonateLink href={donateNav.href} label={donateNav.label} variant="header" />
          </nav>

          <div className="lg:hidden">
            <MobilePrimaryNavSheet />
          </div>
        </div>
      </div>
    </header>
  )
}
