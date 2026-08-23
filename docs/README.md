# Documentation

Repository documentation records durable rules, current architecture,
operations, and unresolved decisions. Implementation plans and completed
checklists should not remain after their useful content is incorporated here.

## Guides

- [`content-managers.md`](./content-managers.md) — Studio and publishing guide
- [`content-terminology.md`](./content-terminology.md) — canonical content field vocabulary
- [`design/dark-mode-color-tokens.md`](./design/dark-mode-color-tokens.md): dark mode color token worksheet for design

## Architecture

- [`architecture/layout-system.md`](./architecture/layout-system.md)
- [`architecture/responsive-ui.md`](./architecture/responsive-ui.md)
- [`architecture/web-css.md`](./architecture/web-css.md)
- [`architecture/article-components.md`](./architecture/article-components.md)
- [`architecture/news-and-updates.md`](./architecture/news-and-updates.md)
- [`architecture/analytics.md`](./architecture/analytics.md): PostHog events and privacy defaults

## Decisions

Numbered ADRs in [`decisions/`](./decisions/). Recent and open notes:

- [`decisions/0005-dependency-upgrades.md`](./decisions/0005-dependency-upgrades.md)
- [`decisions/0006-theme-toggle.md`](./decisions/0006-theme-toggle.md)
- [`decisions/0007-testing.md`](./decisions/0007-testing.md)
- [`decisions/0008-deferred-integrations.md`](./decisions/0008-deferred-integrations.md)
- [`decisions/0009-donorbox-donate.md`](./decisions/0009-donorbox-donate.md)
- [`decisions/0010-newsletter-signup-abuse-controls.md`](./decisions/0010-newsletter-signup-abuse-controls.md)
- [`decisions/0011-data-catalog.md`](./decisions/0011-data-catalog.md)

## Operations

- [`ops/newsletter-signup.md`](./ops/newsletter-signup.md)
- [`ops/data-catalog-import.md`](./ops/data-catalog-import.md) — CSV import for catalog datasets
- [`ops/data-catalog-limited-set-test.md`](./ops/data-catalog-limited-set-test.md) — manual test while the sample set is live; remove after the full catalog
- [`ops/content-links-cleanup.md`](./ops/content-links-cleanup.md) — temporary; remove after cleanup

## What belongs here

Keep a document when it preserves a rule, rationale, operational procedure, or
open decision that is not clear from code alone. Remove feature plans after the
work ships; promote only their durable knowledge into the categories above.
