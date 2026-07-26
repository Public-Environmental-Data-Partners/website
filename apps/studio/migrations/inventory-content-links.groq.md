# Content links — inventory queries

Run these in **Sanity Vision** against each active dataset (published + drafts).
See: [`docs/ops/content-links-cleanup.md`](../../docs/ops/content-links-cleanup.md)

A zero result on query **2b** (or **2c**) is the removal gate for the Portable Text
`href` fallback. Query **2** alone is not proof — it matches any mark that still
has an `href`, including re-saved `contentLink` marks that keep a leftover field.

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

## 2. Portable Text marks that still store `href` (broad)

Useful for spotting leftover `href` fields after re-save. **Not** the removal gate.

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

## 2b. Legacy `href`-only marks (removal gate)

Marks with a non-empty `href` and **no** `linkType`. These still depend on
`resolvePortableTextLink`'s fallback. Re-save each in Studio (or migrate) until
this returns nothing.

```groq
*[
  _type in ["page", "sitePage", "newsPost"]
] {
  _id,
  _type,
  title,
  "legacyPtLinks": array::compact([
    ...sections[].body[].markDefs[
      _type == "link" &&
      defined(href) &&
      href != "" &&
      !defined(linkType)
    ]{ _key, href },
    ...sections[].quote[].markDefs[
      _type == "link" &&
      defined(href) &&
      href != "" &&
      !defined(linkType)
    ]{ _key, href },
    ...body[_type == "block"].markDefs[
      _type == "link" &&
      defined(href) &&
      href != "" &&
      !defined(linkType)
    ]{ _key, href },
    ...body[].caption[].markDefs[
      _type == "link" &&
      defined(href) &&
      href != "" &&
      !defined(linkType)
    ]{ _key, href },
    ...body[].body[].markDefs[
      _type == "link" &&
      defined(href) &&
      href != "" &&
      !defined(linkType)
    ]{ _key, href },
    ...body[].content[].markDefs[
      _type == "link" &&
      defined(href) &&
      href != "" &&
      !defined(linkType)
    ]{ _key, href },
    ...body[].rows[].content[].markDefs[
      _type == "link" &&
      defined(href) &&
      href != "" &&
      !defined(linkType)
    ]{ _key, href }
  ])
}[count(legacyPtLinks) > 0]
```

## 2c. Legacy mark count (quick check)

```groq
count(
  *[
    _type in ["page", "sitePage", "newsPost"] &&
    count(
      array::compact([
        ...sections[].body[].markDefs[
          _type == "link" &&
          defined(href) &&
          href != "" &&
          !defined(linkType)
        ],
        ...sections[].quote[].markDefs[
          _type == "link" &&
          defined(href) &&
          href != "" &&
          !defined(linkType)
        ],
        ...body[_type == "block"].markDefs[
          _type == "link" &&
          defined(href) &&
          href != "" &&
          !defined(linkType)
        ],
        ...body[].caption[].markDefs[
          _type == "link" &&
          defined(href) &&
          href != "" &&
          !defined(linkType)
        ],
        ...body[].body[].markDefs[
          _type == "link" &&
          defined(href) &&
          href != "" &&
          !defined(linkType)
        ],
        ...body[].content[].markDefs[
          _type == "link" &&
          defined(href) &&
          href != "" &&
          !defined(linkType)
        ],
        ...body[].rows[].content[].markDefs[
          _type == "link" &&
          defined(href) &&
          href != "" &&
          !defined(linkType)
        ]
      ])
    ) > 0
  ]
)
```

Expect `0` on every active dataset before removing the web fallback.

## What to record

- Document `_id` / title for each hit from **2b**
- Root-relative paths (`/…`)
- Full external URLs
- Absolute same-site URLs (candidates for internal conversion)
- Empty / malformed targets
- Draft-only vs published
