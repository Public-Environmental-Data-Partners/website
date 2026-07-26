# Dependency upgrade policy

Status record for runtime/tooling versions and unresolved upgrade decisions.

## Current platform

- Node: 24.18.0; supported range `>=24.18.0 <25`
- pnpm: 10.33.2; supported range `>=10.33.0 <11`
- Next.js and `eslint-config-next`: pinned to the same exact version
- React and React DOM: pinned to matching versions
- Sanity packages: keep Studio runtime and types compatible

Package files and the lockfile remain the authoritative version source.

## Upgrade principles

- Use small, reviewable dependency PRs.
- Upgrade platform packages separately from UI utilities.
- Never run an unreviewed repository-wide update.
- Keep Next.js and `eslint-config-next` aligned.
- Run build, lint, formatting, and E2E checks before merging.
- Review release notes for runtime, caching, and content-fetching changes.

## pnpm 11

pnpm 11 is deferred. Its release-age behavior blocked same-day packages during
evaluation. Do not bypass that safeguard by setting `minimumReleaseAge: 0`
without a deliberate security decision.

## Automation

Renovate or Dependabot is still undecided. Add automation only after its grouping
and scheduling rules produce small PRs and preserve the platform-pairing rules
above.

## Sanity live content

The web app uses `defineLive`, `sanityFetch`, and `SanityLiveRoot`. Production
mounts live content; local development may require refresh outside Draft Mode.

Before changing this behavior, choose one strategy:

1. accept the current `next-sanity` default
2. customize the `<SanityLive />` action behavior
3. use tagged revalidation through a server endpoint

Document the editor-facing publish/refresh workflow after that choice.

## Cadence

Review platform dependencies quarterly and security updates promptly. A review
does not require upgrading when the release has no project benefit or increases
launch risk.
