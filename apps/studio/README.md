# Sanity Studio (`apps/studio`)

Content Studio and schema for the PEDP website. Part of the monorepo — see the [root README](../../README.md) for how to run everything together.

## Requirements

Same as the monorepo: use **Node** from the root [`.nvmrc`](../../.nvmrc) and **pnpm** from the root [`package.json`](../../package.json) (`packageManager` and `engines`). See the [root README](../../README.md#prerequisites).

## Environment

Copy [`apps/studio/.env.example`](.env.example) to **`.env`** in this directory. Sanity loads `SANITY_STUDIO_*` variables from here (see [Sanity: environment variables](https://www.sanity.io/docs/studio/environment-variables)). Do not commit `.env`.

## Schema

Schema types live under [`schemaTypes/`](schemaTypes/). Register them in [`schemaTypes/index.ts`](schemaTypes/index.ts).

## Scripts

From **`apps/studio`**:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Studio dev server ([http://localhost:3333](http://localhost:3333)) |
| `pnpm build` | Production Studio build |
| `pnpm start` | Serve built Studio |
| `pnpm deploy` | Deploy hosted Studio (`sanity deploy`) |
| `pnpm lint` | ESLint |
| `pnpm lint:fix` | ESLint with `--fix` |
| `pnpm format` | Prettier write |
| `pnpm format:check` | Prettier check (CI-friendly) |

From the **repo root**, `pnpm dev` runs `web` and `studio` in parallel.

## Learn more

- [Sanity: getting started](https://www.sanity.io/docs/introduction/getting-started)
- [Sanity Community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend the Studio](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)
