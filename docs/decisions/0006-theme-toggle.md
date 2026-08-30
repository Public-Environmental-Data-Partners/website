# Manual theme toggle

The accepted baseline is light and dark presentation selected by OS preference;
see `0004-light-dark-mode-switching.md`. A user-controlled theme switch remains
deferred. Dark presentation itself is also paused until design finishes
[`../design/dark-mode-color-tokens.md`](../design/dark-mode-color-tokens.md).

## Current behavior

- The site is light-only. Brand tokens are defined on `:root` and
  `html` uses `color-scheme: light`.
- Tailwind’s dark variant still targets the `.dark` class, but nothing adds
  that class and leftover `dark:` utilities do not apply.
- There is no theme bootstrap script, theme control, cookie, local-storage
  preference, or `next-themes`.

## Decisions required before implementation

1. Offer Light/Dark or Light/Dark/System.
2. Store preference in a cookie (SSR-visible) or local storage.
3. Define no-JavaScript behavior.
4. Decide how to prevent an incorrect-theme flash.
5. Decide whether the media-query dark token block remains after users can
   force light mode.

## Likely implementation impact

- replace or extend the OS-only bootstrap script
- preserve `.dark` for class-based Tailwind variants
- consolidate duplicate dark token ownership where possible
- expose an accessible control with clear current state
- test first paint, reload persistence, OS changes, and keyboard behavior
