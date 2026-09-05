'use client'

import posthog from 'posthog-js'

/**
 * Client-only PostHog helpers.
 *
 * Init runs after mount (`PostHogInit` / `global-error.tsx`), not in
 * `instrumentation-client.ts`. The SDK injects extra script tags during init;
 * doing that before React hydrates mismatches the first `<script>` nodes in
 * the root layout (JSON-LD and the theme script). Capture calls queue until
 * init finishes.
 */
export type AnalyticsEventName =
  | 'article_audio_started'
  | 'article_shared'
  | 'data_catalog_searched'
  | 'data_catalog_sorted'
  | 'dataset_expanded'
  | 'newsletter_subscribed'

const productionHosts = new Set(['publicenvirodata.org', 'www.publicenvirodata.org'])

let didInit = false

export function initPosthog() {
  if (didInit || typeof window === 'undefined') {
    return
  }

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

  if (!posthogKey || !posthogHost) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = posthogKey ? 'NEXT_PUBLIC_POSTHOG_HOST' : 'NEXT_PUBLIC_POSTHOG_KEY'
      console.error(
        `${missingVariable} is required by PostHog. Events will be missed until it is configured.`,
      )
    }
    return
  }

  didInit = true

  posthog.init(posthogKey, {
    cookieless_mode: 'always',
    // Cookieless mode alone is not enough for GDPR: a persistent distinct ID is
    // personal data, and session replay can be enabled from the PostHog UI.
    // `person_profiles: 'never'` makes identify() a no-op; disable recording in
    // code so it cannot be turned on without a review.
    person_profiles: 'never',
    disable_session_recording: true,
    api_host: posthogHost,
    defaults: '2025-11-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
  })

  // Opt out on localhost, Vercel previews, and pedp-website.vercel.app so those
  // sessions do not mix with production.
  // NEXT_PUBLIC_POSTHOG_CAPTURE_NON_PRODUCTION=true opts back in for testing
  // on this single Free-plan project; events are tagged app_environment.
  const isProductionHost = productionHosts.has(window.location.hostname)
  const allowNonProduction = process.env.NEXT_PUBLIC_POSTHOG_CAPTURE_NON_PRODUCTION === 'true'

  if (!isProductionHost && !allowNonProduction) {
    posthog.opt_out_capturing()
  } else {
    posthog.register({
      app_environment: isProductionHost ? 'production' : 'non_production',
    })
  }
}

export function captureEvent(event: AnalyticsEventName, properties?: Record<string, unknown>) {
  posthog.capture(event, properties)
}

export function captureException(error: Error) {
  posthog.captureException(error)
}
