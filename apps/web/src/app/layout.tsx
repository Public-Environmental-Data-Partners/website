import './globals.css'
import './pedp-token-overrides.css'

import type {Metadata} from 'next'
import {Figtree, Geist_Mono} from 'next/font/google'
import Script from 'next/script'

import {SiteFooter} from '@/components/site-footer'
import {SiteHeader} from '@/components/site-header'
import {siteDescription, siteName, siteUrl} from '@/config/site'
import {cn} from '@/lib/utils'
import {SanityLive} from '@/sanity/live'

const fontSans = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
})

const fontMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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

export default function RootLayout({
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
        'h-full antialiased font-sans',
        fontSans.variable,
        fontMono.variable,
      )}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
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
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
        <SanityLive />
      </body>
    </html>
  )
}
