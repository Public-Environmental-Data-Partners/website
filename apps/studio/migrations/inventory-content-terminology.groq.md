# Content terminology — Phase 1 inventory

Run in **Sanity Vision** against each dataset before migration.
Vocabulary: [`docs/content-terminology.md`](../../docs/content-terminology.md)

## 1. Section-label field shapes (`page` + `sitePage`)

```groq
*[
  _type == "page" ||
  _type == "sitePage"
] {
  _id,
  _type,
  "isDraft": _id in path("drafts.**"),
  "sections": sections[
    _type in [
      "partnerLogosSection",
      "byTheNumbersSection",
      "highlightBannerSection",
      "newsletterSection",
      "whatWeDoSection",
      "testimonialSection",
      "contactSection",
      "cardCarouselSection"
    ]
  ] {
    _key,
    _type,
    sectionHeading,
    kicker,
    heading,
    prompt,
    "legacyLabel": select(
      _type == "cardCarouselSection" => sectionHeading,
      _type in ["partnerLogosSection", "whatWeDoSection"] => heading,
      _type == "contactSection" => coalesce(sectionHeading, kicker, heading),
      coalesce(sectionHeading, kicker)
    ),
    "targetLabel": sectionHeading,
    "hasConflict": defined(sectionHeading) && (
      (defined(kicker) && sectionHeading != kicker) ||
      (
        _type in ["partnerLogosSection", "whatWeDoSection", "contactSection"] &&
        defined(heading) &&
        sectionHeading != heading
      )
    )
  }
}
```

## 2. Newsletter prompt field shapes

```groq
*[
  _type == "page" ||
  _type == "sitePage"
] {
  _id,
  _type,
  "isDraft": _id in path("drafts.**"),
  "newsletters": sections[_type == "newsletterSection"] {
    _key,
    heading,
    prompt,
    "hasConflict": defined(prompt) && defined(heading) && prompt != heading
  }
}
```

## 3. Counts by legacy vs target shape

```groq
{
  "sectionHeadingReady": count(*[
    _type in ["page", "sitePage"]
  ].sections[
    _type in [
      "partnerLogosSection",
      "byTheNumbersSection",
      "highlightBannerSection",
      "newsletterSection",
      "whatWeDoSection",
      "testimonialSection",
      "contactSection",
      "cardCarouselSection"
    ] &&
    defined(sectionHeading)
  ]),
  "legacyKickerOnly": count(*[
    _type in ["page", "sitePage"]
  ].sections[
    _type in [
      "byTheNumbersSection",
      "highlightBannerSection",
      "newsletterSection",
      "testimonialSection",
      "contactSection"
    ] &&
    defined(kicker) &&
    !defined(sectionHeading)
  ]),
  "legacyHeadingLabelOnly": count(*[
    _type in ["page", "sitePage"]
  ].sections[
    _type in ["partnerLogosSection", "whatWeDoSection"] &&
    defined(heading) &&
    !defined(sectionHeading)
  ]),
  "newsletterPromptReady": count(*[
    _type in ["page", "sitePage"]
  ].sections[_type == "newsletterSection" && defined(prompt)]),
  "newsletterLegacyHeadingOnly": count(*[
    _type in ["page", "sitePage"]
  ].sections[
    _type == "newsletterSection" &&
    defined(heading) &&
    !defined(prompt)
  ])
}
```

Record baseline totals per dataset before Phase 4 migration.

## Recorded baselines

### Production — 2026-07-25

Counts (query #3 + contact `heading` adjustment from query #1):

| Metric | Value |
|--------|------:|
| `sectionHeadingReady` | 1 |
| `legacyKickerOnly` | 5 |
| `legacyHeadingLabelOnly` | 2 |
| `legacyContactHeadingOnly` | 1 |
| `newsletterPromptReady` | 0 |
| `newsletterLegacyHeadingOnly` | 2 |
| conflicts (`hasConflict: true`) | 0 |

Notes:

- Dataset: **production**
- All matched docs were published (`isDraft: false`); no draft inventory run recorded
- `sectionHeadingReady: 1` is `page.home` card carousel (`Latest news`)
- Contact section still stores the label as `heading` (`Request support`), not `kicker`
- Query #3 does not count Contact `heading`; include that separately until the migration lands
- Ready for PR 2 (schema rename + migration) with dual-read already deployed
