import Image from 'next/image'
import Link from 'next/link'
import {Fragment} from 'react'

import {FooterNavLink} from '@/components/footer-nav-link'
import {FooterSocialLinks} from '@/components/footer-social-links'
import {SiteShell} from '@/components/layout'
import {siteName} from '@/config/site'
import {type FooterItem, getSiteFooter} from '@/lib/site-footer'

const copyrightYear = new Date().getFullYear()

function FooterCopyright({className}: {className?: string}) {
  return (
    <p
      className={
        className ??
        'font-sans text-base font-normal leading-none text-footer-foreground align-middle'
      }
    >
      {copyrightYear} © {siteName}.
      <br />
      All Rights Reserved
    </p>
  )
}

function FooterBrandMark({size}: {size: 'compact' | 'desktop'}) {
  const dim =
    size === 'compact'
      ? {width: 60, height: 50, className: 'h-[50px] w-[60px]'}
      : {width: 56, height: 46, className: 'h-[46px] w-[56px]'}

  return (
    <Image
      src="/brand/icon.webp"
      alt=""
      width={dim.width}
      height={dim.height}
      className={`${dim.className} shrink-0`}
    />
  )
}

function renderCmsFooterEntry(item: FooterItem, index: number) {
  if (item.kind === 'group') {
    return (
      <div key={`footer-group-${item.label}-${index}`} className="flex flex-col gap-3">
        <h3 className="footer-section-heading m-0 text-footer-foreground">{item.label}</h3>
        <ul className="flex flex-col gap-2">
          {item.items.map((sub) => (
            <li key={sub.href}>
              <FooterNavLink href={sub.href} label={sub.label} variant="sub" />
            </li>
          ))}
        </ul>
      </div>
    )
  }
  return (
    <div key={`footer-link-${item.href}-${index}`}>
      <FooterNavLink href={item.href} label={item.label} variant="primary" />
    </div>
  )
}

export async function SiteFooter() {
  const cmsFooter = await getSiteFooter()
  const column1Items = cmsFooter?.column1Items ?? []
  const column2Items = cmsFooter?.column2Items ?? []

  return (
    <footer data-site-footer className="bg-footer text-footer-foreground mt-auto w-full shrink-0">
      <SiteShell
        padding="none"
        className="flex min-h-[225px] flex-col justify-center px-[var(--site-padding-x)] py-8 md:min-h-[322px] xl:min-h-[450px] xl:justify-start xl:py-12"
      >
        <h2 className="sr-only">Footer</h2>

        {/* Compact: centered icon + socials + copyright (no nav, no wordmark) */}
        <div className="flex flex-col items-center gap-6 text-center xl:hidden">
          <Link
            href="/"
            className="focus-visible:ring-ring shrink-0 rounded-sm transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer)]"
            aria-label={siteName}
          >
            <FooterBrandMark size="compact" />
          </Link>
          <FooterSocialLinks />
          <FooterCopyright className="max-w-[317px] font-sans text-base font-normal leading-none text-footer-foreground" />
        </div>

        {/* Desktop: 12-col — brand 1–2, menu1 7–8, menu2 9–10 */}
        <div className="hidden xl:grid xl:grid-cols-12 xl:gap-x-6 xl:items-start">
          <div className="col-span-2 flex flex-col gap-6">
            <Link
              href="/"
              className="text-footer-foreground focus-visible:ring-ring w-fit shrink-0 rounded-sm no-underline transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer)]"
              aria-label={siteName}
            >
              <span className="flex flex-col gap-3">
                <FooterBrandMark size="desktop" />
                <span className="font-sans text-2xl font-medium leading-none">
                  Public
                  <br />
                  Environmental
                  <br />
                  Data Partners
                </span>
              </span>
            </Link>
            <FooterSocialLinks />
            <FooterCopyright />
          </div>

          <nav aria-label="Footer links" className="col-span-2 col-start-7 flex flex-col gap-8">
            {column1Items.map((item, index) => (
              <Fragment key={`cms-col1-${index}`}>{renderCmsFooterEntry(item, index)}</Fragment>
            ))}
          </nav>

          <nav
            aria-label="Footer secondary links"
            className="col-span-2 col-start-9 flex flex-col gap-8"
          >
            {column2Items.map((item, index) => (
              <Fragment key={`cms-col2-${index}`}>{renderCmsFooterEntry(item, index)}</Fragment>
            ))}
          </nav>
        </div>
      </SiteShell>
    </footer>
  )
}
