# Dependency upgrade policy

Status record for how this repo updates dependencies: what a human reviews,
what Dependabot may open, and which pins are still deferred.

## Current platform

- Node: 24.18.0; supported range `>=24.18.0 <25`
- pnpm: 10.33.2; supported range `>=10.33.0 <11`
- Next.js and `eslint-config-next`: pinned to the same exact version
- React and React DOM: pinned to matching versions
- Sanity packages: keep Studio runtime and types compatible

Package files and the lockfile (`pnpm-lock.yaml`) remain the authoritative
version source. Do not add a `package-lock.json`.

## Lanes

### 1. Security (Dependabot alerts and security updates)

Known advisories (GHSA, often with a CVE) and malware alerts. GitHub opens a
PR when a fix exists. These may jump the queue for any package, including
transitives and platform pins.

Review the PR, wait for CI, and do not auto-merge. If the bump touches Next or
React, keep the pair in the same PR. Low-impact development-scoped alerts may
be auto-dismissed in the GitHub UI; do not auto-dismiss malware.

### 2. Platform (human, quarterly)

Node, pnpm, Next.js, React, and Sanity. Also the CMS companions that change
fetching or rendering: `next-sanity`, `@sanity/image-url`, `@portabletext/react`.
`@types/node` moves only with a Node major. `@types/react` and
`@types/react-dom` move with React. `posthog-js` and `@sentry/nextjs` are not
lane 2. They are app SDKs (see lane 3 and lane 4).

One pairing per PR, in this order: Node, pnpm, Next.js (with
`eslint-config-next`), React in both apps, then Sanity (runtime and types
together; include `next-sanity` only if that bump requires it).

A review does not require upgrading when the release has no project benefit or
increases launch risk. Walk through with
`.cursor/skills/quarterly-platform-updates/SKILL.md`. Do not put this lane on
Dependabot version updates.

### 3. Routine version updates (Dependabot)

Patch and minor only, grouped, on a monthly schedule. Config:
`.github/dependabot.yml`. Groups:

- UI: `class-variance-authority`, `clsx`, `embla-carousel-react`,
  `lucide-react`, `radix-ui`, `tailwind-merge`, `tw-animate-css`, `shadcn`
- CSS: `tailwindcss`, `@tailwindcss/postcss`
- Studio chrome: `styled-components`
- Lint and format: `eslint`, `eslint-plugin-simple-import-sort`, `prettier`,
  `typescript`
- E2E: `@playwright/test`, `@axe-core/playwright`
- Studio scripts: `tsx`
- Observability: `posthog-js`, `@sentry/nextjs`
- GitHub Actions: workflow action pins

CI is the merge gate. If a grouped PR is messy, split it rather than widening
the group. Do not add Renovate unless these groups prove too coarse.

### 4. Majors

No bot. Tailwind, ESLint, Playwright, Radix, `shadcn`, `styled-components`,
`posthog-js`, `@sentry/nextjs`, and anything in lane 2. Open a small human PR
(or skip) after reading notes. A Sentry major in particular needs a review of
`withSentryConfig` imports and init files (`docs/architecture/error-monitoring.md`).

## Upgrade principles

- Use small, reviewable dependency PRs.
- Keep lane 2 PRs separate from lane 3 PRs.
- Never run an unreviewed repository-wide update.
- Keep Next.js and `eslint-config-next` aligned.
- Run build, lint, formatting, and E2E checks before merging.
- Review release notes for runtime, caching, and content-fetching changes.

## Transitives

Do not manage lockfile-only packages directly. They move when a direct
dependency moves, or when a security PR requires it. Sentry transitives such
as `@sentry/cli` and `@sentry/core` follow `@sentry/nextjs`. Approving the
`@sentry/cli` install script is `allowBuilds` in `pnpm-workspace.yaml`, not a
version bump.

## pnpm 11

pnpm 11 is deferred. Its release-age behavior blocked same-day packages during
evaluation. Do not bypass that safeguard by setting `minimumReleaseAge: 0`
without a deliberate security decision.

## `shadcn`

The `shadcn` CLI currently lives in `apps/web` `dependencies`. It is a
dev-time tool. Moving it to `devDependencies` is a cleanup PR, not a platform
bump, so production vs development alert scope matches how it is used.

## Sanity live content

The web app uses `defineLive`, `sanityFetch`, and `SanityLiveRoot`. Production
mounts live content; local development may require refresh outside Draft Mode.

Before changing this behavior, choose one strategy:

1. accept the current `next-sanity` default
2. customize the `<SanityLive />` action behavior
3. use tagged revalidation through a server endpoint

Document the editor-facing publish/refresh workflow after that choice.

## Cadence

- Lane 1: promptly, when GitHub opens an alert or security PR
- Lane 2: quarterly human review (stay put is allowed)
- Lane 3: monthly Dependabot version PRs
- Lane 4: when a major is worth the risk, not on a schedule

Last lane 2 review: 2026-09-04. Stay put on Node, pnpm, Next.js, React, and
Sanity (soft-launch and domain cutover). Next check: mid-October 2026.
