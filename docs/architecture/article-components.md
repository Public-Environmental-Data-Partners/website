# Article components

Current architecture for `/news-and-updates/<slug>`. Sanity calls these
documents `newsPost`; the web UI calls the detail experience an article.

## Page composition

Article pages render, in order:

1. `ArticleHeroSection`
2. optional `ArticleAudioSection`
3. `ArticleBody`
4. optional `SimilarPostsSection`

The hero owns the page `h1`. Body Portable Text exposes Normal and Heading 2–4
to editors; quote content uses `quoteBlock` rather than a Portable Text quote
style.

## CMS and component map

| Sanity content                         | Web component                  |
| -------------------------------------- | ------------------------------ |
| `newsPost` title, eyebrow, date, image | `ArticleHeroSection`           |
| article-level `audio`                  | `ArticleAudioSection`          |
| Portable Text blocks                   | article prose renderer         |
| `quoteBlock`                           | `QuoteBlock`                   |
| `imageBlock`                           | `ImageBlock` / `ArticleFigure` |
| `twoImageBlock`                        | `TwoImageBlock`                |
| `imageTextBlock`                       | `ImageTextBlock`               |
| `embedBlock`                           | `EmbedBlock`                   |
| `listBlock`                            | `ListBlock`                    |

`ArticleFigure` is the shared image primitive: a 4:3 frame followed by optional
photo credit and Portable Text caption.

Consecutive `_type == "block"` items (paragraphs, headings, and list items) are
grouped into one prose renderer even when the article also has images or quotes.
That keeps a bullet list as a single `ul` instead of one spaced row per item.

## Grid

Article body blocks use `SectionBand` → `SiteShell` → `Grid12`. Shared span
classes live in `apps/web/src/lib/article-body-grid.ts`.

| Content              | `lg` and wider                                | Below `lg`                     |
| -------------------- | --------------------------------------------- | ------------------------------ |
| Prose                | 6 columns, centered                           | 12 columns                     |
| Single image         | 10 columns, centered                          | 12 columns                     |
| Single-image caption | 4 columns, centered                           | 12 columns                     |
| Image + text         | 10-column outer region; 4+6 or 6+4 inner grid | two equal columns; image first |
| Embed                | 10 columns, centered                          | 12 columns                     |
| Audio controls       | 7 columns, centered                           | stacked, 12 columns            |
| Quote and list       | 12 columns (interim)                          | 12 columns                     |

Two-up images switch from stacked to 6+6 at `md`.

## Embeds

`embedBlock` resolves through an allowlisted provider registry
(`apps/web/src/lib/embed-providers`).

| Provider   | URLs                                      | Layout                                      |
| ---------- | ----------------------------------------- | ------------------------------------------- |
| YouTube    | watch / youtu.be / embed / shorts / live  | 16:9 (`aspect-video`)                       |
| Elham Ali  | `elhamyali.com` and `www.elhamyali.com`   | Fixed height (`80vh`) with optional caption and “Open full story” link |

Unsupported URLs render nothing. CSP `frame-src` must include each provider host.

## Hero

- Series text comes from `eyebrow`.
- The date is formatted as `MM.DD.YY`.
- Hero images use hotspot-aware Sanity crops at 1900×1267 (3:2).
- Photo credits use `formatPhotoCredit`, which prevents duplicate
  `PHOTO CREDIT:` prefixes.
- The text and image regions use an 8-column centered span at `lg` and a
  10-column centered span below it.
- Stories (`postType: story`) keep title, published date, and hero image
  required for the hub and SEO. Studio toggles (default off) control whether
  each appears on the detail page. A hidden title still renders as an
  `sr-only` `h1`. Partial heroes omit empty chrome (text-only, image-only, or
  heading-only).

## Body typography

Article prose has a scoped editorial heading scale in
`apps/web/src/app/article-body.css`. It does not change global marketing
headings.

| Level | Default | `md` and wider | Available in Studio |
| ----- | ------: | -------------: | ------------------- |
| H1    |    32px |           36px | No                  |
| H2    |    28px |           32px | Yes                 |
| H3    |    24px |           28px | Yes                 |
| H4    |    22px |           24px | Yes                 |
| H5    |    20px |           22px | No                  |

H1 and H5 remain CSS fallbacks for imported content. Editors use Heading 2–4.

## Images, captions, and credits

- In-body images display at 4:3.
- Order is image → credit → caption.
- Credits use `photoCredit`; the retired `source` field is not supported.
- Single-image captions occupy their own centered four-column region.
- Two-up and image-text captions remain below their image.
- Image-text blocks are top-aligned and do not use float wrapping.
- Hero and article images require alt text and enable Sanity hotspot editing.

Upload guidance:

| Slot         | Ratio | Recommended minimum width |
| ------------ | ----: | ------------------------: |
| Hero         |   3:2 |                    1900px |
| Single image |   4:3 |                    1400px |
| Two-up image |   4:3 |                     800px |
| Image + text |   4:3 |                     900px |

## Audio and sharing

Audio is an optional article-level object, not a body block. It requires a file,
duration in minutes, and intro section heading.

- Supported uploads: MP3 and M4A.
- The custom listen button controls a hidden `<audio>` element.
- The compact label is `{n} MINS`; desktop adds `LISTEN:`.
- The share action uses `navigator.share` when available and otherwise copies
  the article URL with an announced status update.
- Audio controls and share controls must remain keyboard accessible with visible
  focus states.

## Open decisions

- Final quote and list column spans.
- Whether hero aspect ratios should vary by breakpoint.
- Whether credits should use a separate font from the site sans.
- Singular `1 MIN` versus the current `1 MINS`.
- Whether audio should require resolved SEO/excerpt copy for sharing.
