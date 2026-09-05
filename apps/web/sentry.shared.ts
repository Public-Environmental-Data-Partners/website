/**
 * Shared Sentry.init options for browser, Node, and edge.
 * DSN is public (it ships in the client bundle). Auth tokens stay in Vercel.
 */
export const sentryInitBase = {
  dsn: 'https://4351464780ee5569d9431fa4f516fb64@o4512031052595200.ingest.us.sentry.io/4512031057969152',
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  // Local `next dev` would otherwise count against the Developer error/span quota.
  enabled: process.env.NODE_ENV !== 'development',
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
  dataCollection: {
    userInfo: false,
    cookies: false,
    urlQueryParams: false,
    httpBodies: [] as Array<
      'incomingRequest' | 'outgoingRequest' | 'incomingResponse' | 'outgoingResponse'
    >,
  },
}
