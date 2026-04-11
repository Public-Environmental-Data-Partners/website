import './globals.css'

import type {Metadata} from 'next'
import {Geist_Mono, Inter, Playfair_Display} from 'next/font/google'

import {SanityLive} from '@/sanity/live'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

const fontSerif = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
})

const fontMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const siteName = 'Public Environmental Data Partners'
const siteDescription =
  'PEDP is a coalition working to preserve environmental data and tools, strengthen standards, and support communities through advocacy and open infrastructure.'

/** TODO: Update with the actual domain when the site is live */
const siteUrl = 'https://pedp-website.vercel.app'

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
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SanityLive />
      </body>
    </html>
  )
}
