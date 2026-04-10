# Sanity Studio (`apps/studio`)

Content Studio and schema for the PEDP website. Part of the monorepo — see the [root README](../../README.md) for how to run everything together.

## Requirements

Same as the monorepo: use **Node** from the root [`.nvmrc`](../../.nvmrc) and **pnpm** from the root [`package.json`](../../package.json) (`packageManager` and `engines`). See the [root README](../../README.md#prerequisites).

## Environment

Copy [`apps/studio/.env.example`](.env.example) to **`.env`** in this directory. Sanity loads `SANITY_STUDIO_*` variables from here (see [Sanity: environment variables](https://www.sanity.io/docs/studio/environment-variables)). Do not commit `.env`.

## Schema

Types live under [`schemaTypes/`](schemaTypes/) and are registered in [`schemaTypes/index.ts`](schemaTypes/index.ts).

After schema changes, run **`pnpm run deploy`** from this directory to update the [hosted Studio](https://pedp-website.sanity.studio/)

## For editors

Use **[hosted Studio](https://pedp-website.sanity.studio/)** or run **`pnpm dev`** here for [http://localhost:3333](http://localhost:3333). That is where you create and publish content.

**Preview on the public website before publish:** the Next app supports draft preview (see [Draft mode in `apps/web` README](../web/README.md#draft-mode-sanity-preview)). The URL pattern is documented there; the **preview secret** is not in git — get it from the development team or your team’s secrets store.

## Scripts

From **`apps/studio`**:

| Command             | Description                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | local Studio dev server ([http://localhost:3333](http://localhost:3333))                          |
| `pnpm build`        | production Studio build                                                                           |
| `pnpm start`        | serve built Studio                                                                                |
| `pnpm run deploy`   | Deploy hosted Studio ([https://pedp-website.sanity.studio/](https://pedp-website.sanity.studio/)) |
| `pnpm lint`         | ESLint                                                                                            |
| `pnpm lint:fix`     | ESLint with `--fix`                                                                               |
| `pnpm format`       | Prettier write                                                                                    |
| `pnpm format:check` | Prettier check (CI-friendly)                                                                      |

From the **repo root**, `pnpm dev` runs `web` and `studio` in parallel.

## Learn more

- [Sanity: getting started](https://www.sanity.io/docs/introduction/getting-started)
- [Sanity Community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend the Studio](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)
