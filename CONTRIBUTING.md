# Contributing Guidelines

We love improvements to our tools! PEDP has general [guidelines for contributing](https://github.com/Public-Environmental-Data-Partners/overview/blob/main/CONTRIBUTING.md) and a [code of conduct](https://github.com/Public-Environmental-Data-Partners/overview/blob/main/CODE_OF_CONDUCT.md) for all of our organizational repos.

## Local setup

Follow the [Quick start](README.md#quick-start) in the root [README](README.md). Use **pnpm** at the repo root (this monorepo is not set up for npm/yarn at the root).

## Issues

- [Good first issues (PEDP org)](https://github.com/issues?q=is%3Aopen+is%3Aissue+label%3Agood-first-issue+user%3APublic-Environmental-Data-Partners) — entry points for new contributors across org repos.
- Use your team’s conventions for labels (e.g. **ready**) when an issue is ready to be picked up.

## Pull requests

- Open PRs against the default branch unless your team agrees otherwise.
- Run **lint** and **format** for the packages you touch before pushing (see [apps/web README](apps/web/README.md) and [apps/studio README](apps/studio/README.md) for `pnpm lint` / `pnpm format:check` from each app directory).
- When **pre-commit hooks** are added to this repo, install them as documented in the root README and avoid `--no-verify` except when intentional.

## Commit messages

Use **[Conventional Commits](https://www.conventionalcommits.org/)** so history and changelogs stay easy to scan.

**Format:** `type(optional-scope): short description in imperative mood`

- **type** — what kind of change it is (common: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`).
- **scope** — optional hint (`web`, `studio`, `env`, etc.).
- **description** — what the commit does, not what you did personally (e.g. “add” not “added”).

**Examples:**

- `docs: pin Node 24 LTS and document monorepo setup`
- `chore(studio): add lint and format npm scripts`
- `chore(env): add .env.example files for web and studio`
- `feat(web): render home page from Sanity page document`
- `fix(studio): validate required fields on page schema`

## Repo-specific notes

- App-specific details: [apps/web/README.md](apps/web/README.md), [apps/studio/README.md](apps/studio/README.md).
