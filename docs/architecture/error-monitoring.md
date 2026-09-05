# Error monitoring

Current Sentry setup for `apps/web`. Not an ADR; product choice, quotas, and
privacy defaults live here. This is not uptime monitoring. Independent checks
are still the decision in
[`decisions/0007-testing.md`](../decisions/0007-testing.md).

Studio (`apps/studio`) is not instrumented.

## What is installed

The Next.js SDK (`@sentry/nextjs`) covers browser, Node, and edge. Shared
`Sentry.init` options live in
[`apps/web/sentry.shared.ts`](../../apps/web/sentry.shared.ts). Next.js loads
them from:

- [`apps/web/src/instrumentation-client.ts`](../../apps/web/src/instrumentation-client.ts)
  (browser, including App Router navigations)
- [`apps/web/sentry.server.config.ts`](../../apps/web/sentry.server.config.ts)
  via [`apps/web/src/instrumentation.ts`](../../apps/web/src/instrumentation.ts)
- [`apps/web/sentry.edge.config.ts`](../../apps/web/sentry.edge.config.ts)
  (same `instrumentation.ts` register hook)

[`apps/web/next.config.ts`](../../apps/web/next.config.ts) wraps the Next config
with `withSentryConfig` from `@sentry/nextjs/config` so production builds can
upload source maps.

Root layout crashes also call `Sentry.captureException` in
[`apps/web/src/app/global-error.tsx`](../../apps/web/src/app/global-error.tsx),
next to the existing PostHog report. PostHog remains the product-analytics
tool. See [`analytics.md`](./analytics.md).

Sentry org `pedp`, project `pedp-web`, on the Developer (free) plan. The DSN is
public and is set in `sentry.shared.ts`. It is safe in the client bundle.

## When capture runs

Sentry is off when `NODE_ENV` is `development`, so `next dev` does not consume
the free error or span quota. Vercel Production and Preview builds use
`NODE_ENV=production`, so they send events. `environment` is
`NEXT_PUBLIC_VERCEL_ENV` when present (`production` or `preview`), otherwise
`NODE_ENV`.

Filter the Sentry UI by environment if preview noise should be hidden.

## Tracing

`tracesSampleRate` is `0.1`: about one in ten performance traces is kept.
Errors are not sampled this way. A thrown exception is still sent when Sentry
is enabled. The 10% rate is to stay inside the Developer plan span quota on
live traffic.

## Privacy and limits

Designed to sit next to the PostHog defaults (no identity, no session replay,
no request bodies or query strings that could hold emails or draft secrets):

- `sendDefaultPii: false`
- `dataCollection.userInfo: false`
- `dataCollection.cookies: false`
- `dataCollection.urlQueryParams: false`
- `dataCollection.httpBodies: []` (no HTTP bodies)
- Session Replay is not enabled
- Browser events are not tunneled through this origin (`tunnelRoute` is unset)
- Vercel cron monitors are not auto-created

Developer plan constraints this setup assumes (confirm on
[Sentry pricing](https://sentry.io/pricing/) if the plan changes):

- one dashboard user
- 5,000 errors per month, then dropped (no overage bill)
- tracing billed in spans (millions included; still sample in production)
- 50 session replays per month (why Replay stays off)
- email alerts only; Slack and similar integrations are paid
- 30-day retention
- profiling and Seer are paid or pay-as-you-go: leave them off

GitHub Actions CI must not get `SENTRY_AUTH_TOKEN`. CI only builds; it does
not deploy.

## Environment

| Variable | Role |
| -------- | ---- |
| `SENTRY_AUTH_TOKEN` | Build-time secret on Vercel (Production and Preview). Uploads source maps. Never commit. Local uploads can use gitignored `.env.sentry-build-plugin`. |

The DSN is not an env var. `SENTRY_ORG` and `SENTRY_PROJECT` are set in
`next.config.ts` (`pedp`, `pedp-web`).

If the auth token is missing on a Vercel build, the site still deploys; stack
traces may point at minified bundles until the token is set and the project is
redeployed.

## What we send

| Signal | Where | Question it answers |
| ------ | ----- | ------------------- |
| Uncaught client, server, and edge errors | SDK default + `onRequestError` | What threw, and on which runtime? |
| Root layout crash | `Sentry.captureException` in `global-error.tsx` | Did the whole app crash? |
| Sampled traces | `tracesSampleRate: 0.1` | Which routes or server work are slow? |

## What we do not send

- Session replay
- User identity, cookies, query strings, or HTTP bodies
- Local `next dev` traffic
- Studio errors
- Events tunneled through the Next.js origin (ad blockers may drop some
  browser reports)

## Follow-ups (not in this setup)

- Privacy policy copy in Sanity should mention Sentry once this site is live,
  alongside PostHog.
- Checkly (or a simpler uptime check) is still needed for availability.
  Sentry does not replace that.
- A second Sentry project for preview is optional; unlimited projects are
  included, but this repo uses one project and `environment` tags.
- Team plan is the next step if more than one person needs the dashboard, or
  if Slack/GitHub issue integrations are required.
