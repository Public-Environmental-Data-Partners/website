import Image from 'next/image'
import Link from 'next/link'

import {DonateLink} from '@/components/donate-link'
import {HeaderNavLink} from '@/components/header-nav-link'
import {SiteShell} from '@/components/layout'
import {MobilePrimaryNavSheet} from '@/components/mobile-primary-nav-sheet'
import {NavPrimaryGroup} from '@/components/nav-primary-group'
import {donateNav} from '@/config/nav'
import {siteName} from '@/config/site'
import {getMainNav} from '@/lib/main-nav'
import {footerItemsNotInPrimaryNav} from '@/lib/mobile-nav-footer'
import {getSiteFooter} from '@/lib/site-footer'

/** Global header; primary nav from CMS (`getMainNav`). Desktop: dropdown; mobile sheet adds leftover footer links. */
export async function SiteHeader() {
  const [primaryNav, footer] = await Promise.all([getMainNav(), getSiteFooter()])
  const mobileNav = [...primaryNav, ...footerItemsNotInPrimaryNav(primaryNav, footer)]

  return (
    <header className="bg-light-beige">
      <SiteShell
        padding="none"
        className="flex min-h-[93px] items-center justify-between gap-3 px-[var(--site-padding-x)] xl:min-h-[170px]"
      >
        <Link
          href="/"
          aria-label={siteName}
          className="text-foreground focus-visible:ring-ring shrink-0 rounded-sm no-underline transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-light-beige focus-visible:outline-none"
        >
          {/* Desktop: icon + 3-line wordmark */}
          <span className="hidden items-center gap-3 xl:inline-flex">
            <Image
              src="/brand/icon.webp"
              alt=""
              width={56}
              height={46}
              priority
              className="h-[46px] w-[56px] shrink-0"
            />
            <span className="font-sans text-2xl font-medium leading-none">
              Public
              <br />
              Environmental
              <br />
              Data Partners
            </span>
          </span>

          {/* Mobile / tablet: 2-line wordmark, no icon */}
          <span className="inline-block font-sans text-xl font-extrabold leading-none align-middle xl:hidden">
            Public Environmental
            <br />
            Data Partners
          </span>
        </Link>

        <div className="flex min-w-0 items-center justify-end gap-3 xl:flex-1">
          <nav
            aria-label="Primary"
            className="hidden flex-wrap items-center justify-end gap-x-6 gap-y-2 xl:flex"
          >
            {primaryNav.map((entry, index) =>
              entry.kind === 'group' ? (
                <NavPrimaryGroup
                  key={entry.id}
                  id={entry.id}
                  label={entry.label}
                  items={entry.items}
                />
              ) : (
                <HeaderNavLink
                  key={`nav-link-${index}-${entry.href}`}
                  label={entry.label}
                  href={entry.href}
                />
              ),
            )}

            <DonateLink href={donateNav.href} label={donateNav.label} variant="header" />
          </nav>

          <div className="xl:hidden">
            <MobilePrimaryNavSheet mainNav={mobileNav} />
          </div>
        </div>
      </SiteShell>
    </header>
  )
}
