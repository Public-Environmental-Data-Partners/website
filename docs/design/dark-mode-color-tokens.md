# Dark mode color tokens (design fill-in)

Worksheet for designers. Fill in the Dark columns so engineering can drop values into
`apps/web/src/app/pedp-token-overrides.css`.

Related: [`../architecture/web-css.md`](../architecture/web-css.md),
[`../decisions/0004-light-dark-mode-switching.md`](../decisions/0004-light-dark-mode-switching.md).

## How to fill this out

1. For each row, set Dark hex (or write `same` if the light value should stay in dark mode).
2. In Behavior, use one of: `theme-aware` (flips with light/dark), `locked` (same in both modes).
3. Use Notes for contrast targets, hover/pressed, or when a band stays dark in both themes.
4. Prefer WCAG AA contrast for text and interactive UI on its paired fill / foreground.

Do not invent new token names here unless an existing token cannot express the need.
If you need a new token, add a row at the bottom under Proposed new tokens.

Source of light values and current dark placeholders: `pedp-token-overrides.css`
(as of this doc). Current dark placeholders are provisional until this sheet is completed.

---

## 1. Semantic UI tokens

These already have provisional dark values in code. Confirm or replace them.

| CSS token | Tailwind / usage | Light (current) | Dark (current placeholder) | Dark (design) | Behavior | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `--background` | `bg-background` | `#f4f1ec` | `#121110` | | | Page background |
| `--foreground` | `text-foreground` | `#2c2c2c` | `#f2f0ec` | | | Default text |
| `--muted` | `bg-muted` | `#f0ebe4` | `#2b2825` | | | Muted surface |
| `--muted-foreground` | `text-muted-foreground` | `#6b6560` | `#a8a29a` | | | Secondary text |
| `--border` | `border-border` | `#e0dbd4` | `#45413b` | | | Borders |
| `--surface` | `bg-surface` | `#ffffff` | `#1f1e1b` | | | Elevated surface |
| `--primary` | `bg-primary` | `#c8e067` | `#d4e87a` | | | Primary / CTA fill |
| `--primary-foreground` | `text-primary-foreground` | `#1a1a1a` | `#141413` | | | Text on primary |
| `--accent` | `bg-accent` | `#4a7c59` | `#6b9c78` | | | Accent fill |
| `--accent-foreground` | `text-accent-foreground` | `#faf8f5` | `#0f0f0e` | | | Text on accent |
| `--forest` | `bg-forest` | `#1e3d2f` | `#162922` | | | Dark green band |
| `--forest-foreground` | `text-forest-foreground` | `#f5f2eb` | `#e8e6e1` | | | Text on forest |
| `--sky` | `bg-sky` | `#e3f1fa` | `#1a2830` | | | Light blue band |
| `--sky-foreground` | `text-sky-foreground` | `#1e3a4a` | `#dbeafe` | | | Text on sky |
| `--navy` | `bg-navy` | `#1a2f4a` | `#0f1728` | | | Navy band |
| `--mint` | `bg-mint` | `#e8f2ea` | `#1a231f` | | | Mint surface |
| `--card` | `bg-card` | `#ffffff` | `#22201d` | | | Card surface |
| `--card-foreground` | `text-card-foreground` | `#2c2c2c` | `#f2f0ec` | | | Text on card |
| `--popover` | `bg-popover` | `#ffffff` | `#22201d` | | | Popover surface |
| `--popover-foreground` | `text-popover-foreground` | `#2c2c2c` | `#f2f0ec` | | | Text on popover |
| `--secondary` | `bg-secondary` | `#f0ebe4` | `#3c3834` | | | Secondary UI |
| `--secondary-foreground` | `text-secondary-foreground` | `#2c2c2c` | `#f2f0ec` | | | Text on secondary |
| `--destructive` | `bg-destructive` | `#b91c1c` | `#ef4444` | | | Error fill |
| `--destructive-foreground` | `text-destructive-foreground` | `#faf8f5` | `#faf8f5` | | | Text on destructive |
| `--input` | `border-input` | `#e0dbd4` | `#554f48` | | | Form borders |
| `--ring` | `ring-ring` | `#4a7c59` | `#6b9c78` | | | Focus ring |
| `--chart-1` | `bg-chart-1` | `#c8e067` | `#d4e87a` | | | Chart series 1 |
| `--chart-2` | `bg-chart-2` | `#4a7c59` | `#6b9c78` | | | Chart series 2 |
| `--chart-3` | `bg-chart-3` | `#1e3d2f` | `#162922` | | | Chart series 3 |
| `--chart-4` | `bg-chart-4` | `#1a2f4a` | `#dbeafe` | | | Chart series 4 |
| `--chart-5` | `bg-chart-5` | `#6b6560` | `#a8a29a` | | | Chart series 5 |
| `--sidebar` | `bg-sidebar` | `#f0ebe4` | `#2b2825` | | | Sidebar surface |
| `--sidebar-foreground` | `text-sidebar-foreground` | `#2c2c2c` | `#f2f0ec` | | | Sidebar text |
| `--sidebar-primary` | `bg-sidebar-primary` | `#4a7c59` | `#d4e87a` | | | Sidebar primary |
| `--sidebar-primary-foreground` | `text-sidebar-primary-foreground` | `#faf8f5` | `#141413` | | | Text on sidebar primary |
| `--sidebar-accent` | `bg-sidebar-accent` | `#e8f2ea` | `#3c3834` | | | Sidebar accent |
| `--sidebar-accent-foreground` | `text-sidebar-accent-foreground` | `#2c2c2c` | `#f2f0ec` | | | Text on sidebar accent |
| `--sidebar-border` | `border-sidebar-border` | `#e0dbd4` | `#45413b` | | | Sidebar border |
| `--sidebar-ring` | `ring-sidebar-ring` | `#4a7c59` | `#6b9c78` | | | Sidebar focus ring |

---

## 2. Brand palette

These currently keep the light hex in dark mode. Highest priority for real dark values
(or an explicit `same` / `locked` decision).

| CSS token | Tailwind color | Light (current) | Dark (design) | Behavior | Notes |
| --- | --- | --- | --- | --- | --- |
| `--cream` | `cream` | `#fffcf8` | | | |
| `--off-white` | `off-white` | `#f4f1ec` | | | Often used as a surface; confirm if theme-aware |
| `--light-beige` | `light-beige` | `#ebe4db` | | | |
| `--beige` | `beige` | `#d4cbbf` | | | |
| `--dark-beige` | `dark-beige` | `#6d6659` | | | |
| `--light-green` | `light-green` | `#c4edac` | | | |
| `--green` | `pedp-green` | `#7ac473` | | | |
| `--green-4` | `green-4` | `#558457` | | | e.g. highlight banner gutter |
| `--dark-green` | `dark-green` | `#324a3d` | | | |
| `--light-blue` | `light-blue` | `#c5e8ff` | | | |
| `--blue` | `pedp-blue` | `#98c0f4` | | | |
| `--dark-blue` | `dark-blue` | `#2b3e6f` | | | Often used as a dark band; may stay locked |

---

## 3. Currently theme-locked

Confirm whether these should stay locked or become theme-aware.

| CSS token | Tailwind / usage | Current (light and dark) | Dark (design) | Behavior | Notes |
| --- | --- | --- | --- | --- | --- |
| `--footer` | `bg-footer` / site footer | `#f4f1ec` | | | Footer background; currently locked |
| `--footer-foreground` | `text-footer-foreground` | `#2c2c2c` | | | Footer text; currently locked |
| `--off-black` | `off-black` | `#42413d` | | | Currently locked |

---

## 4. Proposed new tokens (optional)

Only add rows if an existing token cannot cover the need.

| Proposed CSS token | Light | Dark | Behavior | Why needed |
| --- | --- | --- | --- | --- |
| | | | | |
| | | | | |
| | | | | |

---

## Sign-off

| | |
| --- | --- |
| Designer | |
| Date | |
| Figma file / variable collection | |
| Contrast standard (e.g. WCAG AA) | |
