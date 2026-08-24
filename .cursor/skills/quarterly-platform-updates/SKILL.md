---
name: quarterly-platform-updates
description: >-
  Walks through the PEDP website quarterly platform dependency review in order
  (Node, pnpm, Next.js, React, Sanity). Use when the user says quarterly
  update, quarterly platform, platform upgrades, upgrade Node, upgrade pnpm,
  or asks to review Next, React, or Sanity versions for this monorepo. Does
  not bump UI, lint, or Actions packages; those are Dependabot version updates.
---

# Quarterly platform updates

Guided review of **lane 2 (platform)** only. Policy:
`docs/decisions/0005-dependency-upgrades.md`. A review may conclude "stay put."
Do not treat this as a mandate to bump.

Do **not** start installing or editing pins until intake is done, research is
shown, and the user accepts the first proposed PR.

## Not in scope

- Lane 3 packages (UI, CSS, lint/format, Playwright, `tsx`, GitHub Actions).
  Those are monthly Dependabot version updates in `.github/dependabot.yml`.
- `pnpm update` across the repo
- Adding Renovate, or widening Dependabot to platform packages
- Changing Sanity live-content strategy (`defineLive` / `SanityLive`) as a
  side effect of a version bump
- Setting pnpm `minimumReleaseAge: 0` or moving to pnpm 11 (deferred in the ADR)
- Lane 4 majors for non-platform packages (Tailwind, ESLint, and similar)

Dependabot **alerts** and **security** PRs are lane 1. If one is open for a
platform package, handle it before or instead of a voluntary quarterly bump of
that package.

## Intake (one question at a time)

Ask the first unanswered question. Wait for the reply. Do not dump the list.

1. Is there a launch freeze or other reason to skip upgrades that add risk?
2. This quarter: patch and minor only, or are majors in scope?
3. Any open Dependabot security PRs or alerts to deal with first?

If freeze: research anyway, recommend stay put, stop unless they still want a
security-only bump.

## Research before any bump

Read the ADR "Current platform" section and the live pins:

| Pin | Source of truth |
|---|---|
| Node | `.nvmrc`, root `package.json` `engines.node` |
| pnpm | root `package.json` `packageManager` and `engines.pnpm` |
| Next / `eslint-config-next` | `apps/web/package.json` (same exact version) |
| React / `react-dom` | `apps/web/package.json` and `apps/studio/package.json` (matching) |
| Sanity | `apps/studio/package.json` (`sanity`, `@sanity/types`, related) and `apps/web` `next-sanity` |

Look up **current** latest-in-range versions (npm registry, Node release page,
pnpm changelog). Read release notes for runtime, caching, content fetching,
and breaking peer-deps. Check Next's declared React peer range before proposing
a React bump. Confirm Vercel still supports the Node version you would pin.

Summarize a table: current pin, candidate, notes, recommend bump or skip.
Then propose **only the next step in order**, as its own PR.

## Order (do not skip ahead)

Toolchain first so later package PRs are not invalidated. Next before React
because Next's peers usually dictate React. Sanity last because it must stay
compatible with that React.

1. **Node** (own PR)
   - `.nvmrc`, `engines.node`, ADR current-platform lines
   - `@types/node` in `apps/web` only if the Node **major** changes
   - Stay inside `<25` unless the user explicitly accepted a Node major
2. **pnpm** (own PR)
   - `packageManager` (full Corepack `pnpm@version+sha512`) and `engines.pnpm`
   - Stay on 10.x (`<11`). Do not propose pnpm 11.
3. **Next.js** (own PR)
   - `next` and `eslint-config-next` in `apps/web`, **same exact version**
   - Do not leave them mismatched even for a day
4. **React** (own PR)
   - `react` and `react-dom` in **both** apps, matching versions
   - Align `@types/react` / `@types/react-dom` as needed
5. **Sanity** (own PR)
   - Keep Studio runtime and `@sanity/types` compatible
   - Include `next-sanity` in this PR only if the Sanity bump requires it
   - Do not change live-content behavior; if notes force a behavior change, stop
     and treat that as the ADR's open Sanity live-content decision

After each accepted bump: update the lockfile with a targeted install, not a
repo-wide update. CI uses `pnpm install --frozen-lockfile`.

## Verify before calling a PR done

From repo root, as in `.github/workflows/ci.yml`:

- `pnpm install --frozen-lockfile` (after the lockfile commit)
- `pnpm build`
- `pnpm lint:all`
- `pnpm format:check:all`
- `pnpm --filter web test:e2e` when the change can affect the web app

Do not open the next pairing's PR until this set has been run (or CI is green
on the current PR) and the user wants to continue.

## After the review

If Node or pnpm pins changed, keep `docs/decisions/0005-dependency-upgrades.md`
"Current platform" in sync. State clearly if the review ended with stay put
on any pairing.
