# Content links — Phase 0 inventory queries

Run these in **Sanity Vision** against each dataset before migration.
Plan: [`docs/content-links-implementation-plan.md`](../../docs/content-links-implementation-plan.md)

## 1. Legacy CTA / card targets

```groq
*[
  _type == "page" ||
  _type == "sitePage" ||
  _type == "newsPost"
] {
  _id,
  _type,
  title,
  "homepageLinkTargets": [
    ...sections[_type == "highlightBannerSection"].ctaLink{
      sitePage,
      path,
      externalUrl
    },
    ...sections[_type == "cardCarouselSection"].cards[].link{
      sitePage,
      path,
      externalUrl
    },
    ...sections[_type == "byTheNumbersSection"].stats[]{
      ctaLinkType,
      "ctaPage": ctaPage->_id,
      ctaExternalUrl
    },
    ...sections[_type == "whatWeDoSection"].items[]{
      "ctaPage": ctaPage->_id
    },
    ...sections[_type == "testimonialSection"]{
      "ctaPage": ctaPage->_id
    }
  ]
}
```

## 2. Portable Text `href`-only link marks

```groq
*[
  _type in ["page", "sitePage", "newsPost"]
] {
  _id,
  _type,
  title,
  "ptHrefs": array::compact([
    ...sections[].body[].markDefs[_type == "link"].href,
    ...sections[].quote[].markDefs[_type == "link"].href,
    ...body[_type == "block"].markDefs[_type == "link"].href,
    ...body[].caption[].markDefs[_type == "link"].href,
    ...body[].body[].markDefs[_type == "link"].href,
    ...body[].content[].markDefs[_type == "link"].href,
    ...body[].rows[].content[].markDefs[_type == "link"].href
  ])
}[count(ptHrefs) > 0]
```

## What to record

- Root-relative paths (`/…`)
- Full external URLs
- Absolute same-site URLs (candidates for internal conversion)
- Empty / malformed targets
- Draft-only or missing references
