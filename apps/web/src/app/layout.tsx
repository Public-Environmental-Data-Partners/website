import './globals.css'
import './article-hero.css'
import './article-body.css'
import './article-figure.css'
import './article-audio.css'
import './article-list-block.css'
import './donate-info-box.css'
import './news-hub.css'
import './data-catalog.css'
import './similar-posts.css'
import './return-to-top-strip.css'
import './pedp-token-overrides.css'

import type {Metadata} from 'next'
import {Figtree, Geist_Mono, Source_Serif_4} from 'next/font/google'

import {DraftPreviewBanner} from '@/components/draft-preview-banner'
import {PostHogInit} from '@/components/posthog-init'
import {ReturnToTopStrip} from '@/components/return-to-top-strip'
import {SanityLiveRoot} from '@/components/sanity-live-root'
import {SiteJsonLd} from '@/components/seo/site-json-ld'
import {SiteEventBanner} from '@/components/site-event-banner'
import {SiteFooter} from '@/components/site-footer'
import {SiteHeader} from '@/components/site-header'
import {defaultOgImagePath, siteDescription, siteName, siteUrl} from '@/config/site'
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
    images: [
      {
        url: defaultOgImagePath,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: [defaultOgImagePath],
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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(
        'h-full bg-background antialiased font-sans',
        fontSans.variable,
        fontMono.variable,
        fontSerif.variable,
      )}
    >
      <body id="top" className="flex min-h-full flex-col bg-background text-foreground">
        <SiteJsonLd />
        <SiteEventBanner placement="aboveHeader" />
        <SiteHeader />
        <DraftPreviewBanner />
        <SiteEventBanner placement="belowHeader" />
        <main className="bg-white flex flex-1 flex-col">{children}</main>
        <ReturnToTopStrip />
        <SiteEventBanner placement="aboveFooter" />
        <SiteFooter />
        <SanityLiveRoot />
        <PostHogInit />
      </body>
    </html>
  )
}
