import Image from 'next/image'
import Link from 'next/link'

import {DonateLink} from '@/components/donate-link'
import {FooterNavLink} from '@/components/footer-nav-link'
import {FooterSocialLinks} from '@/components/footer-social-links'
import {donateNav, footerUtilityNavLinks, mainNavGroupById} from '@/config/nav'
import {siteName} from '@/config/site'

const sectionTitleClass = 'footer-section-heading m-0 text-footer-foreground'

export function SiteFooter() {
  const whatWeDo = mainNavGroupById('what-we-do')
  const whatsHappening = mainNavGroupById('whats-happening')
  const utilityLinks = footerUtilityNavLinks()

  return (
    <footer
      data-site-footer
      className="bg-footer text-footer-foreground mt-auto w-full shrink-0"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="sr-only">Footer</h2>
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-3 lg:items-start lg:gap-x-10">
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="focus-visible:ring-ring w-fit shrink-0 rounded-sm focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer)]"
              aria-label={siteName}
            >
              <Image
                src="/brand/logo-light.png"
                alt=""
                width={653}
                height={185}
                className="h-11 w-auto"
                sizes="(max-width: 1023px) 200px, 240px"
              />
            </Link>
            <FooterSocialLinks />
            <DonateLink href={donateNav.href} label={donateNav.label} variant="footer" className="w-fit" />
          </div>

          <nav aria-label="Programs and news" className="flex flex-col gap-8">
            {whatWeDo ? (
              <div className="flex flex-col gap-3">
                <h3 className={sectionTitleClass}>What We Do</h3>
                <ul className="flex flex-col gap-2">
                  {whatWeDo.items.map((item) => (
                    <li key={item.href}>
                      <FooterNavLink href={item.href} label={item.label} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {whatsHappening ? (
              <div className="flex flex-col gap-3">
                <h3 className={sectionTitleClass}>What&apos;s Happening</h3>
                <ul className="flex flex-col gap-2">
                  {whatsHappening.items.map((item) => (
                    <li key={item.href}>
                      <FooterNavLink href={item.href} label={item.label} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </nav>

          <nav aria-label="Site sections" className="flex flex-col gap-3">
            <ul className="flex flex-col gap-2">
              {utilityLinks.map((item) => (
                <li key={item.href}>
                  <FooterNavLink href={item.href} label={item.label} className="footer-utility-heading" />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
