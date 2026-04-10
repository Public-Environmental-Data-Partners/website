# PEDP Website

Monorepo for the PEDP public website: a [Next.js](https://nextjs.org/) app (`apps/web`) and [Sanity Studio](https://www.sanity.io/) (`apps/studio`) for content.

## Repository layout

| Path | Description |
|------|-------------|
| [`apps/web`](apps/web/README.md) | Next.js site (App Router) |
| [`apps/studio`](apps/studio/README.md) | Sanity Content Studio and schema |

## Prerequisites

- **Node.js** — Use the version listed in [`.nvmrc`](.nvmrc) at the repo root (pinned Node for this project). Install or switch with [nvm](https://github.com/nvm-sh/nvm) (`nvm install` / `nvm use`), [fnm](https://github.com/Schniz/fnm), or [asdf](https://asdf-vm.com/). Supported range is also declared as `engines.node` in [`package.json`](package.json). See [Node.js releases](https://nodejs.org/en/about/previous-releases) for LTS context.
- **pnpm** — Use the version declared in [`package.json`](package.json) under **`packageManager`** (Corepack reads this). Run `corepack enable`, then `pnpm install` from the repo root so your pnpm matches the project. Supported range is under `engines.pnpm` in the same file. [Install pnpm](https://pnpm.io/installation) if Corepack is not available.

## Quick start

1. Clone this repository and open a terminal at the repo root (`website/`).

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. **Environment variables**

   - **Studio:** copy [`apps/studio/.env.example`](apps/studio/.env.example) to `apps/studio/.env` and set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`.
   - **Web (when using Sanity from the app):** copy [`apps/web/.env.example`](apps/web/.env.example) to `apps/web/.env.local` and fill in values. See the [web app README](apps/web/README.md) for details.
   - For access to shared or production values for these variables (tokens, secrets, deployment env), send your request to [dev@publicenvirodata.org](mailto:dev@publicenvirodata.org).

4. Start dev servers (Next.js + Studio in parallel):

   ```bash
   pnpm dev
   ```

   - Site: [http://localhost:3000](http://localhost:3000)
   - Studio: [http://localhost:3333](http://localhost:3333)

   Editors can also use the hosted Studio at [https://pedp-website.sanity.studio/](https://pedp-website.sanity.studio/). See the [apps/studio README](apps/studio/README.md) more information.

5. Production builds (both apps):

   ```bash
   pnpm build
   ```

## Linting and formatting

From the **repo root**, run ESLint and Prettier across **`apps/*`**:

| Command | Description |
|---------|-------------|
| `pnpm lint:all` | ESLint in web + studio |
| `pnpm lint:fix:all` | ESLint with `--fix` in both |
| `pnpm format:all` | Prettier write in both |
| `pnpm format:check:all` | Prettier check (CI-friendly) |

Per-app commands are in [apps/web README](apps/web/README.md#scripts) and [apps/studio README](apps/studio/README.md#scripts).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for PEDP-wide policies and repo-specific notes (issues, PRs, and tooling).

## License & Copyright

Copyright (C) 2026 Public Environmental Data Partners (PEDP)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3.0.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the [`LICENSE`](LICENSE) file for details.
