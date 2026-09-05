# Testing strategy

The goal is launch confidence, not a coverage target. Prioritize failures that
blank core routes, break publishing-dependent rendering, or make production
unavailable.

## Current checks

CI runs:

- build
- repository lint
- formatting check
- Playwright E2E in Chromium

The E2E suite currently runs:

- axe WCAG 2 A/AA checks across core public routes
- sitemap/seed link crawl: internal links are blocking; external links are
  warn-only (logged + annotated, do not fail the job)

Configuration lives in `apps/web/playwright.config.ts`; tests live in
`apps/web/e2e`.

## Gaps worth addressing

- production uptime and browser checks
- article-detail smoke coverage using a stable published fixture
- newsletter happy-path coverage with writes safely isolated
- targeted unit tests when mapping or parsing logic becomes complex
- optional scheduled external-link report (still non-blocking) once CMS link
  hygiene is stable

There is no requirement for a broad unit suite while behavior is adequately
covered by types, focused functions, and route-level checks.

## Production monitoring decision

Checkly is the preferred candidate when browser checks and deployment-aware
monitoring are needed. A simpler uptime provider is sufficient only if
URL/status/keyword checks meet the launch requirement. Vercel Observability is
diagnostic telemetry, not a substitute for independent uptime checks.

Sentry on `apps/web` is error and sampled-trace telemetry, not uptime. See
[`../architecture/error-monitoring.md`](../architecture/error-monitoring.md).

## Out of scope until needed

- broad visual regression
- Studio UI automation
- load testing
- coverage-percentage gates

Add these when a concrete regression risk justifies their maintenance cost.
