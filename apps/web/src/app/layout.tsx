import './globals.css'
import './article-hero.css'
import './article-body.css'
import './article-figure.css'
import './article-audio.css'
import './hero-split-grid.css'
import './article-list-block.css'
import './news-post-teaser.css'
import './similar-posts.css'
import './pedp-token-overrides.css'

import type {Metadata} from 'next'
import {Figtree, Geist_Mono, Source_Serif_4} from 'next/font/google'
import Script from 'next/script'

import {DraftPreviewBanner} from '@/components/draft-preview-banner'
import {SanityLiveRoot} from '@/components/sanity-live-root'
import {SiteFooter} from '@/components/site-footer'
import {SiteHeader} from '@/components/site-header'
import {siteDescription, siteName, siteUrl} from '@/config/site'
import {cn} from '@/lib/utils'

const fontSans = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700', '800'],
})

const fontMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const fontSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif-4',
  style: ['normal', 'italic'],
  weight: ['500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: 'PEDP',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: 'summary',
    title: siteName,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    /*
     * Theme / hydration: the server may omit the `dark` class on the root element; the
     * beforeInteractive script syncs it from prefers-color-scheme, so the client DOM can
     * differ during hydration. suppressHydrationWarning silences that expected mismatch on
     * this node only; avoid using it on arbitrary components.
     */
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'h-full bg-background antialiased font-sans',
        fontSans.variable,
        fontMono.variable,
        fontSerif.variable,
      )}
    >
      <body id="top" className="flex min-h-full flex-col bg-background text-foreground">
        {/*
          beforeInteractive: runs early so the first paint can use the right theme.
          Syncs the `dark` class on document.documentElement with prefers-color-scheme and
          on OS theme changes. Pairs with the class-based `dark:` variant in globals.css.
          Minified IIFE; try/catch avoids throwing if matchMedia is unavailable.
        */}
        <Script id="pedp-theme" strategy="beforeInteractive">
          {`(function(){try{var m=window.matchMedia('(prefers-color-scheme: dark)');function s(){document.documentElement.classList.toggle('dark',m.matches);}s();m.addEventListener('change',s);}catch(e){}})();`}
        </Script>
        <SiteHeader />
        <DraftPreviewBanner />
        <main className="bg-white flex flex-1 flex-col">{children}</main>
        <SiteFooter />
        <SanityLiveRoot />
      </body>
    </html>
  )
}
