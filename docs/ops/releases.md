# Releases

GitHub releases record what has shipped on `main` since the previous tag.
Merging to `main` deploys the site. Cut one release at the end of a check-in,
not one release per pull request.

The version is the git tag, for example `v1.2.1`. `package.json` versions are
not updated for a release. Notes are generated from conventional commits by
[`cliff.toml`](../../cliff.toml).

## When to cut a release

Every few weeks, after the dependency and ticket review. Dependency lanes:
[`docs/decisions/0005-dependency-upgrades.md`](../decisions/0005-dependency-upgrades.md).

Review security updates first, then open Dependabot pull requests one at a
time, then ready tickets. Merge each after CI is green.

When a security fix merges between check-ins, cut a patch that day so the
release list matches production.

## Version

Run the notes command below. Choose the next number from those commits:

- A breaking subject (`feat!:`, `fix!:`) or a `BREAKING CHANGE` footer is a major. Example: `v1.2.1` becomes `v2.0.0`.
- A `feat` commit is a minor. Example: `v1.2.1` becomes `v1.3.0`.
- Fixes, chores, docs, refactors, tests, performance commits, and dependency bumps are a patch. Example: `v1.2.1` becomes `v1.2.2`.

A breaking change wins over a feature. A feature wins over a fix. An empty
range means there is nothing to release.

## Tools

Install [git-cliff](https://git-cliff.org/) (`brew install git-cliff`) and the
GitHub CLI (`gh`). git-cliff reads [`cliff.toml`](../../cliff.toml) and groups
commits into Features, Bug Fixes, Dependencies, and the other conventional
types. Dependency bumps stay in the notes.

## Steps

From the repo root, on the latest `main`:

```bash
git switch main
git pull
previous=$(git describe --tags --abbrev=0)
git cliff "${previous}..HEAD"
```

If `git cliff` prints nothing, stop. Otherwise set `next` to the tag you chose
in the version section, including the `v` prefix.

```bash
git tag -a "$next" -m "${next#v}"
git push origin "$next"
git cliff "${previous}..${next}" -o "/tmp/${next}.md"
gh release create "$next" --latest --title "${next#v}" --notes-file "/tmp/${next}.md"
```

`--latest` marks this release as the current one on GitHub. The tag points at
the `HEAD` you just pulled. Leave existing tags where they are.

Example: the previous tag is `v1.2.1` and the commits since then are a Next.js
patch plus dependency bumps, so `next` is `v1.2.2`.

```bash
previous=v1.2.1
next=v1.2.2
git tag -a "$next" -m "${next#v}"
git push origin "$next"
git cliff "${previous}..${next}" -o "/tmp/${next}.md"
gh release create "$next" --latest --title "${next#v}" --notes-file "/tmp/${next}.md"
```

## Commit messages

Write conventional commits so the next notes group themselves:

- `feat(web): add a catalog clear control`
- `fix(web): correct the sitemap origin`
- `chore(deps): bump the ui group`
- `feat(web)!: remove the legacy catalog route`

The scope in parentheses is optional. `!` after the type or scope marks a
breaking change.
