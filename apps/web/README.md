# Web app (`apps/web`)

Next.js (App Router) frontend for the PEDP website. Part of the monorepo — see the [root README](../../README.md) for how to run everything together.

## Requirements

Same as the monorepo: use **Node** from the root [`.nvmrc`](../../.nvmrc) and **pnpm** from the root [`package.json`](../../package.json) (`packageManager` and `engines`). See the [root README](../../README.md#prerequisites).

## Environment

Copy [`apps/web/.env.example`](.env.example) to **`.env.local`** in this directory and fill in values when you connect to Sanity (see [`.env.example`](.env.example) for variable names). Do not commit `.env.local`.

## Scripts

From **`apps/web`**:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Next.js dev server ([http://localhost:3000](http://localhost:3000)) |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |
| `pnpm lint:fix` | ESLint with `--fix` |
| `pnpm format` | Prettier write |
| `pnpm format:check` | Prettier check (CI-friendly) |

From the **repo root**, `pnpm dev` runs `web` and `studio` in parallel via the workspace.

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
