# Content terminology

Use names according to a text element's content role, not merely its visual
style. The long-term goal is to use the same term in Studio titles, stored
Sanity fields, GROQ projections, mappers, and React props.

## Long-term vocabulary

### Page title

The identity of the whole page and its primary `h1`.

- Studio title: **Page title**
- Stored field and code: `title`
- Examples: `CONTACT US`, `PRIVACY POLICY`, and the News & Updates hub title

A page title remains a page title even when it shares the uppercase styling of
a section heading.

### Section heading

The short name of a section or visual band. It is commonly displayed as
uppercase sans-serif text.

- Studio title: **Section heading**
- Stored field and code: `sectionHeading`
- Examples: `WHAT WE DO`, `OUR PARTNERS`, `PEDP BY THE NUMBERS`, `LATEST NEWS`,
  `MEMBER TESTIMONIAL`, `STAY IN TOUCH`, and `REQUEST SUPPORT`
- Applies to: What We Do, partner logos, By the Numbers, card carousel,
  testimonial, newsletter's top label, highlight banner's top label, and
  contact sections

Use this term instead of `kicker` for the end-to-end content model. “Kicker”
may remain useful in informal design discussion, but should not be the canonical
CMS or code name.

### Heading

The primary title of a content block. It is normally more prominent than a
section heading and establishes the block's content hierarchy.

- Studio title: **Heading**
- Stored field and code: `heading`
- Examples: a hero headline, simple-section title, or highlight banner's main
  title

### Prompt

An instructional or invitational line rather than the name of a section.

- Studio title: **Prompt**
- Stored field and code: `prompt`
- Example: the newsletter line `Sign-up for our newsletter:`

### Eyebrow or Series

A short contextual label above a larger related title. It is subordinate to
that title and should not be the only title of a section.

- Studio title: prefer **Series** when that is the editorial meaning; otherwise
  use **Eyebrow**
- Stored field and code: `eyebrow` unless the content model explicitly adopts
  `series`
- Examples: an article series name or contextual label above a card title

### Article body headings

Portable Text Heading 2, Heading 3, and Heading 4 establish hierarchy within an
article. They are not section-heading fields and should keep their semantic
heading names.

## End-to-end naming rule

For each role, align all layers:

1. Studio field title
2. Stored Sanity field name
3. Studio preview selection
4. GROQ projection and TypeScript data type
5. Mapper output
6. React prop

HTML semantics remain independent of the stored field name. For example, a
`sectionHeading` may correctly render as an `h2` when it labels a section.

## Rollout status

This vocabulary is fully applied. Every section label is stored as
`sectionHeading`, and the newsletter instructional line is stored as `prompt`,
in Studio schemas, previews, GROQ projections, types, mappers, and React props.

The `apps/studio/migrations/rename-section-labels-to-section-heading` migration
moved the legacy `kicker` and label-role `heading` values into place. No
compatibility reads remain, so new section types should adopt these names
directly.
