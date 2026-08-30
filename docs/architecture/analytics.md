# Web analytics

Current PostHog setup for `apps/web`. Not an ADR; product choice and event
meanings live here. The item was removed from
[`decisions/0008-deferred-integrations.md`](../decisions/0008-deferred-integrations.md).

## What is installed

The browser SDK (`posthog-js`) initializes after mount in
[`apps/web/src/components/posthog-init.tsx`](../../apps/web/src/components/posthog-init.tsx)
(and in `global-error.tsx` if the root layout crashes). Init is not in
`instrumentation-client.ts`: that file runs before hydration and the SDK
injects extra script tags that clash with JSON-LD and the theme script.
Custom events go through
[`apps/web/src/lib/analytics.ts`](../../apps/web/src/lib/analytics.ts). There is
no `posthog-node` server capture.

PostHog also sends its SDK defaults (pageviews and, unless turned off in the
PostHog project, autocapture). The table below is the events this codebase
defines on purpose.

## Privacy and limits

- `cookieless_mode: 'always'`: no PostHog cookies or local/session storage.
- `person_profiles: 'never'`: `identify()` is a no-op.
- `disable_session_recording: true`: session replay cannot be enabled from the
  PostHog UI without a code change.
- One PostHog project (Free plan). Production and test data share that project.
- Events do not include email, search text, or share URLs.

Cookieless capture only works if Cookieless server hash mode is enabled in the
PostHog project (Project settings, Web analytics).

The live public site is still Squarespace at `publicenvirodata.org`. This app
opts out unless the page host is `publicenvirodata.org` or
`www.publicenvirodata.org`. After DNS points here, production capture starts.

To send events from localhost or Vercel Preview into the same project, set
`NEXT_PUBLIC_POSTHOG_CAPTURE_NON_PRODUCTION=true`. Those events get
`app_environment: non_production`. Leave the flag unset on Vercel Production.

## Environment

| Variable | Role |
| -------- | ---- |
| `NEXT_PUBLIC_POSTHOG_KEY` | Project API key (safe in the browser) |
| `NEXT_PUBLIC_POSTHOG_HOST` | Ingest host, currently `https://us.i.posthog.com` |
| `NEXT_PUBLIC_POSTHOG_CAPTURE_NON_PRODUCTION` | `true` to capture on non-production hosts |

If key or host is missing, `next dev` logs an error and does not init. Capture
calls are no-ops. Production builds skip the log.

## What we track

`app_environment` is `production` or `non_production` on every captured event
when capture is on. Filter insights to `app_environment = production` for live
traffic after cutover.

| Event or signal | Properties | Question it answers |
| --------------- | ---------- | ------------------- |
| `$pageview` (SDK default) | URL and path from PostHog | Which pages do people open, and how does traffic move through the site? |
| `$exception` / `capture_exceptions` | Error message and stack from the SDK | Which client errors fire in normal browsing? |
| `captureException` in `global-error.tsx` | The React error that replaced the root layout | Did the whole app crash, and what was the error? |
| `article_audio_started` | `duration_minutes` | Do people start the article audio (first play near the beginning, not resume)? |
| `article_shared` | `share_method`: `native` or `clipboard` | Do people share articles, and do they use the system share sheet or copy link? |
| `newsletter_subscribed` | none | Did the newsletter form succeed? (Email is not sent to PostHog.) |
| `data_catalog_searched` | `has_query` (boolean), `result_count` | Do people search the catalog, and do they get results? (The query string is not sent.) |
| `data_catalog_sorted` | `sort_key`, `sort_dir` | Which catalog sort (name or agency, asc or desc) do people choose? |
| `dataset_expanded` | `dataset_id`, `dataset_title`, `agency` | Which catalog datasets do people open? |

## What we do not track

- Newsletter email or identity
- Catalog search query text
- Article title or URL on share/audio events
- News hub Load More clicks (card counts vary by breakpoint)
- Session replay
- Localhost, Vercel Preview, and `pedp-website.vercel.app` unless the non-production flag is set

## Follow-ups (not in this setup)

- Privacy policy copy in Sanity should describe PostHog once this site is live.
- A reverse proxy would send events via this origin so ad blockers drop fewer
  `$pageview`s. That is optional and is a privacy tradeoff.
- A second PostHog project for preview/local needs a paid plan (six projects).
