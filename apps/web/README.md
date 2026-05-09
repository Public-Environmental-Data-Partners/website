# Web app (`apps/web`)

Next.js (App Router) frontend for the PEDP website. Part of the monorepo — see the [root README](../../README.md) for how to run everything together.

## Requirements

Same as the monorepo: use **Node** from the root [`.nvmrc`](../../.nvmrc) and **pnpm** from the root [`package.json`](../../package.json) (`packageManager` and `engines`). See the [root README](../../README.md#prerequisites).

## Environment

Copy [`apps/web/.env.example`](.env.example) to `.env.local` in this directory and fill in values. For shared or production values (tokens, secrets, deployment env), contact [dev@publicenvirodata.org](mailto:dev@publicenvirodata.org).

Newsletter signup on the homepage writes `newsletterSignup` documents via `SANITY_API_WRITE_TOKEN` (see [.env.example](.env.example)). Without it, the form shows an error after submit. Once a real email newsletter provider is integrated, plan to remove the post-submit “thank you” / sign-up success animation, the newsletter-related **middleware** (rate limiting), and in Studio the subscriber list plus CSV export tied to `newsletterSignup`.

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

To view this app in production go to [https://pedp-website.vercel.app/](https://pedp-website.vercel.app/)

## Draft mode (Sanity preview)

**What it is:** The site uses [Next.js Draft Mode](https://nextjs.org/docs/app/building-your-application/configuring/draft-mode). When draft mode is **on** for your browser session, the app requests Sanity with the `drafts` perspective so you can see **unpublished** changes. When it is **off**, only **published** content is shown. Draft mode is toggled with a cookie; it is not the same as logging into Studio.

**Enable it locally by** opening the following URL (use the real value of `SANITY_PREVIEW_SECRET` from your env):

```text
http://localhost:3000/api/draft?secret=<SANITY_PREVIEW_SECRET>
```

Optional: `&slug=/` or another path — where to redirect after enabling (defaults to `/`).

**Enable it on production by** opening the following URL

```text
https://pedp-website.vercel.app/api/draft?secret=<SANITY_PREVIEW_SECRET>
```

**Disable:** visit `/api/disable-draft`, or use **Exit preview** in the amber bar at the top of the site when draft mode is active.

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
