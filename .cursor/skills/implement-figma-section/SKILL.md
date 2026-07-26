---
name: implement-figma-section
description: >-
  Implements PEDP website pages and sections from Figma mocks or design
  screenshots. Use when the user pastes Figma frames, design comps, mocks, or
  asks to build a new page, section, band, hero, or CMS block for apps/web or
  apps/studio.
---

# Implement Figma section / page

Turn design comps into PEDP Studio schema + Next.js UI using the existing
layout system and content model. Do **not** invent a one-off layout or write a
long-lived implementation-plan doc unless the user asks.

Follow this workflow **in order**. Do not skip ahead to coding until steps 1–4
are done and the user accepts the plan.

## Workflow

### 1. Read the docs and understand the architecture

Always read:

- `docs/architecture/layout-system.md`
- `docs/architecture/responsive-ui.md`
- `docs/architecture/web-css.md`
- `docs/content-terminology.md`

Also read when the mock is article / hub related:

- `docs/architecture/article-components.md`
- `docs/architecture/news-and-updates.md`

Skim a nearby shipped section (schema + mapper + component + CSS) for patterns.

### 2. Ask questions to gather requirements

Ask clarifying questions until ~95% confident. Prefer a short ordered list;
work through them with the user rather than dumping every possible question at
once when they prefer sequential answers.

Use `checklist.md` in this skill folder. Cover layout, CMS, links/CTAs,
breakpoints, motion/a11y, and assets.

**Required design asks** — if typography, color, and/or images are not fully
specified in the mock or conversation, request them explicitly:

#### Typography

Ask for (or paste from Figma Dev Mode):

- Font family / role (display, sans, serif, mono)
- Size at mobile, tablet, and desktop
- Weight, line-height, letter-spacing
- Text transform
- Color token or hex per text style
- Role: page title / section heading / heading / prompt / eyebrow
  (`docs/content-terminology.md`)

#### Color

Ask for (or paste from Figma):

- Background / surface, text, icons, borders, overlays
- Hover / pressed / disabled if interactive
- Map hex to `apps/web/src/app/pedp-token-overrides.css` when possible
- If no token matches, ask nearest existing vs new token — do not invent
  one-off hex in components

#### Images

Ask for (or confirm from Figma / exports):

- Photo vs placeholder vs decorative SVG
- Aspect ratio(s), crop / hotspot / object-position
- Min source width and export size
- CMS image vs `apps/web/public` static asset
- Alt, photo credit, caption
- Linked image vs separate CTA; responsive `sizes` / LCP needs

Do not guess type, color, or image behavior when Dev Mode or exports can
answer.

### 3. Verify understanding of requirements

Before proposing a plan, restate a short requirements summary:

- What is being built (page / section / body block)
- CMS vs hardcoded
- Layout approach (shell, grid, breakpoints)
- Agreed type, color, and image decisions
- Open risks or assumptions

Ask the user to confirm or correct. Do not implement until they confirm
understanding (or explicitly say to proceed).

### 4. Come up with a plan to implement

Present a concise implementation plan **in chat** (not a new durable docs
file unless asked):

- Studio schema / fields
- GROQ / mapper / component / CSS touchpoints
- Layout primitives to reuse
- Edge cases (empty states, optional CTAs, reduced motion)
- Out of scope

Wait for plan approval (or requested edits) before coding.

Then implement following:

- Prefer `SectionBand` → `SiteShell` → `Grid12` / `ContentStack`
- Layout owns shell/grid/spans; components own chrome
- Semantic tokens only; no duplicated hex in JSX
- CTAs / rich text use `contentLink` unless an intentional exception
- Field names follow content terminology
- Match comps across mobile / tablet / desktop
- Respect `prefers-reduced-motion`
- Keep the change scoped; update durable architecture docs only when a new
  reusable rule emerges

### 5. Print testing steps for the human

After implementation, print a clear **manual test plan** the human can run,
for example:

- Studio: create/edit content, required fields, empty optional fields
- Web: mobile / tablet / desktop widths
- Typography, color tokens, and image crop/alt/credit
- Links/CTAs (internal, external, missing link)
- Keyboard focus and reduced motion if relevant
- Draft vs published if CMS-driven

Do not assume automated tests cover visual fidelity.

### 6. Stage files and ask about commit

When the work looks complete:

1. Stage only the files that belong to this change
2. Show a short summary of what is staged
3. Ask whether the human is ready to commit
4. If yes, provide or create a commit message per repo conventions; do not
   commit unless they confirm
5. Do not push unless they ask
