# Web app (`apps/web`)

Next.js (App Router) frontend for the PEDP website. Part of the monorepo — see the [root README](../../README.md) for how to run everything together.

## Requirements

Same as the monorepo: use **Node** from the root [`.nvmrc`](../../.nvmrc) and **pnpm** from the root [`package.json`](../../package.json) (`packageManager` and `engines`). See the [root README](../../README.md#prerequisites).

## Environment

Copy [`apps/web/.env.example`](.env.example) to `.env.local` in this directory and fill in values. For shared or production values (tokens, secrets, deployment env), contact [dev@publicenvirodata.org](mailto:dev@publicenvirodata.org).

Newsletter signup on the homepage writes `newsletterSignup` documents via `SANITY_API_WRITE_TOKEN` (see [.env.example](.env.example)). Without it, the form shows an error after submit. Once a real email newsletter provider is integrated, plan to remove the post-submit “thank you” / sign-up success animation, the newsletter-related **proxy** (rate limiting), and in Studio the subscriber list plus CSV export tied to `newsletterSignup`.

Primary navigation comes from the Sanity **`siteNavigation`** singleton (`getMainNav` in [`src/lib/main-nav.ts`](src/lib/main-nav.ts)). [`src/config/nav.ts`](src/config/nav.ts) holds shared types plus donate and privacy links only.

## Scripts

From **`apps/web`**:

| Command             | Description                                                         |
| ------------------- | ------------------------------------------------------------------- |
| `pnpm dev`          | Next.js dev server ([http://localhost:3000](http://localhost:3000)) |
| `pnpm build`        | Production build                                                    |
| `pnpm start`        | Serve production build                                              |
| `pnpm lint`         | ESLint                                                              |
| `pnpm lint:fix`     | ESLint with `--fix`                                                 |
| `pnpm format`       | Prettier write                                                      |
| `pnpm format:check` | Prettier check (CI-friendly)                                        |

From the **repo root**, `pnpm dev` runs `web` and `studio` in parallel via the workspace.

## Running the app

Although it is recommended to run all apps from root, if you must run it from the `apps/web` dir, use `pnpm dev`.

To view this app in production go to [https://www.publicenvirodata.org/](https://www.publicenvirodata.org/). [https://pedp-website.vercel.app/](https://pedp-website.vercel.app/) still works as an alias.

The site renders published Sanity content and caches those pages. Sanity Live refreshes a page after its published content changes. Unpublished drafts stay in Studio until you publish.

`pnpm dev` renders every request and does not show that cache. To check it locally, build and start the production server:

```bash
pnpm --filter web build
pnpm --filter web start
```

The build route table should list public pages as static. Repeat loads of a page are served from that cache.

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
