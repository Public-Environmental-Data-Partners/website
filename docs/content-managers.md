# For content editors

Reference for **Sanity Studio**, the **production website**, and **draft preview**. Technical setup lives in the main [README](../README.md) and [`apps/web`](../apps/web/README.md).

## Where to edit content

The **Sanity Studio** (aka "Hosted Studio" or simply "Studio") is where you can create and update pages and publish. The URL for the Studio is here:

**[https://pedp-website.sanity.studio/](https://pedp-website.sanity.studio/)**

You have to be added to the project to have access. Reach out to [dev@publicenvirodata.org](mailto:dev@publicenvirodata.org) for access.

In the Studio, unpublished work stays as **drafts** until you **Publish**.

## The production website

**Published** content is what most visitors see on the **production** site. This can be seen at [https://pedp-website.vercel.app/](https://pedp-website.vercel.app/). This will eventually be replaced by the real domain for the PEDP website.

## Draft preview (before you publish)

Sometimes you want to see **unpublished** (or draft) changes on the **production** site before clicking **Publish** in Studio.

In order to view **unpublished** changes on the **production** site, navigate here:

https://pedp-website.vercel.app/api/draft?secret=<SANITY_PREVIEW_SECRET>

Ask the dev team for the SANITY_PREVIEW_SECRET and then bookmark that URL.

After you open this URL, you may see an **amber bar** at the top. That means you are viewing **draft** content. Draft content and unpublished content is used interchangably.

Use **Exit preview** when you are done.

Do **not** post preview links or secrets in public channels.

Questions about access or broken preview: **[dev@publicenvirodata.org](mailto:dev@publicenvirodata.org)**.

## SEO (search & sharing)

Most pages and news posts have an optional **SEO** section (collapsed near the bottom of the document).

- **Page title** — browser tab / search title. Leave empty to use the page or article title (homepage falls back to the site name).
- **Meta description** — search snippet and link-preview text. Leave empty to use the site default description (news posts fall back to the hub excerpt).

Link previews use the page’s share image when available (news hero). Otherwise they use the PEDP logo share card. You do not need to upload a separate social image for normal pages.

New **Site page** documents get these fields automatically.

## Adding links

CTA buttons, linked cards, and links inside rich text use the same link controls.

### Internal links

Choose **Internal** for any destination on the PEDP website. Internal links open in the same browser tab and do not show an external-link icon.

Choose the destination from one of these views:

- **Navigation:** Follows the website's main navigation. Expand a group such as **What We Do** to see its pages. Expand **News and Updates** to choose the news hub or a published post.
- **All pages:** Search all published website pages, including pages that are not in the main navigation.
- **All posts:** Search all published news posts.

Select the destination from the picker instead of copying its URL. Page and post selections remain valid if their slug changes.

### External links

Choose **External** for a destination outside the PEDP website, then enter its complete URL, including `https://`.

External links open in a new browser tab and show an external-link icon. The icon tells visitors that they are leaving the site.

### Email links

Choose **Email** when the link should open the visitor’s email app, then enter the address only (for example `hello@publicenvirodata.org`). Do not type `mailto:` yourself.

Email links open the visitor’s default mail app and do not show an external-link icon.

### Changing or removing a link

- Use **Clear** to remove the current destination.
- If you switch between Internal, External, and Email, the old destination is cleared automatically. Select or enter a new one.
- A CTA or linked card may disappear from the website if its required link is incomplete. Finish the destination before publishing.

### Rich-text links

1. Highlight the words that should become a link.
2. Select the link annotation in the rich-text toolbar.
3. Choose **Internal**, **External**, or **Email** and complete the destination as described above.
4. Publish the document.

When updating an older rich-text link, reselect its destination through this workflow before publishing. This converts the link to the current format.

### Deliberate exceptions

- Primary navigation and footer links are internal-only.
- Partner logos and social links are always external.

## Embedding videos in posts

News and Updates posts can include a video with an Embed block in the article body.

### How to add a YouTube video

1. Open the post in Studio and go to the body content.
2. Add an Embed block where the video should appear. On smaller screens, Quote and Image appear first in the insert menu; open the three-dot menu to find Embed and the other block types.
3. Paste a YouTube share link into the URL field. Supported forms include:
   - `https://www.youtube.com/watch?v=...`
   - `https://youtu.be/...`
   - `https://www.youtube.com/embed/...`
   - `https://www.youtube.com/shorts/...`
   - `https://www.youtube.com/live/...`
4. Optionally add a caption below the embed.
5. Publish the post (or use draft preview to check first).

YouTube is the only video source supported in posts right now. Unsupported URLs will not show on the website.

### Other video sources

If you need Vimeo, Google Drive, Facebook, Instagram, or any other provider, drop a request in the website channel in Rocket Chat and tag Vim. Engineering must allowlist and wire up each new source before it will work in Studio or on the site.

## Data Catalog

The public list is [https://pedp-website.vercel.app/data-catalog](https://pedp-website.vercel.app/data-catalog) (or the production domain once it replaces that URL). The page is not in the main navigation.

How-to for the CSV import script is for engineering:
[`docs/ops/data-catalog-import.md`](./ops/data-catalog-import.md). Field meaning (Summary vs Description, dates, Open in / Download) is in
[`docs/decisions/0011-data-catalog.md`](./decisions/0011-data-catalog.md).

### Documents in Studio

- **Data Catalog page** (one document): hero title, intro, Data Guide CTA, Nominate Data CTA, SEO. Publish this or the route has no chrome.
- **Catalog dataset** (one document per archived dataset): card title, agencies, dates, Summary, imported Description, links, Mentioned in.

Import creates dataset documents as **drafts**. They do not appear on the public catalog until you **Publish**. You can use [draft preview](#draft-preview-before-you-publish) to check unpublished cards.

Do **not** create a second Catalog dataset document for a deposit that already exists (same DOI or same backup URL). Ask engineering to re-run import or to find the existing draft.

### What to edit

- **Summary** is what visitors should see in the card description. Keep it around 450 characters (about 5 lines). Longer text is truncated and a “Read more on [host]” link is added.
- **Description (imported)** is the metadata text, stored word for word. Leave it unless you are correcting a bad import. The site uses it only when Summary is empty.
- **Mentioned in** is Studio-only (not in the spreadsheet). Add internal news/pages and/or external URLs with a label.
- **Time period:** if start/end stay blank, the card shows “See backup”.
- **Download date:** if blank, the card shows “Not recorded”. Flags such as “needs review” mean the import could not parse the spreadsheet; you can still publish after you set the date fields.
- **Backup host** and **Backup URL is a file** are filled by import from the backup URL. You usually do not type the host. The button says “Open in Zenodo” (or Harvard Dataverse, SciOp, GitHub, …) or **Download** when the URL looks like a file.

A later spreadsheet import **does not overwrite** fields you already filled. Empty fields can still be filled from the CSV.

If a row never shows on the site: confirm it is published, then ask engineering (it may have been skipped for a missing DOI and backup URL).

