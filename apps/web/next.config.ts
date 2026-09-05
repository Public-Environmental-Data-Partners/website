import {withSentryConfig} from '@sentry/nextjs/config'
import type {NextConfig} from 'next'

/**
 * frame-src only: unspecified CSP directives remain unrestricted.
 * Includes Donorbox (donate embeds), YouTube (article embeds), and
 * elhamyali.com story embeds.
 * When a fuller CSP is added site-wide, keep these origins in frame-src and
 * add donorbox.org to script-src for widget.js.
 */
const FRAME_SRC = [
  "'self'",
  'https://donorbox.org',
  'https://*.donorbox.org',
  'https://www.youtube.com',
  'https://www.youtube-nocookie.com',
  'https://youtube.com',
  'https://elhamyali.com',
  'https://www.elhamyali.com',
].join(' ')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-src ${FRAME_SRC}`,
          },
        ],
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  org: 'pedp',
  project: 'pedp-web',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
})
