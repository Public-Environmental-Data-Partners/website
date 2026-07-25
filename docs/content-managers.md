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

### Changing or removing a link

- Use **Clear** to remove the current destination.
- If you switch between Internal and External, the old destination is cleared automatically. Select or enter a new one.
- A CTA or linked card may disappear from the website if its required link is incomplete. Finish the destination before publishing.

### Rich-text links

1. Highlight the words that should become a link.
2. Select the link annotation in the rich-text toolbar.
3. Choose **Internal** or **External** and complete the destination as described above.
4. Publish the document.

When updating an older rich-text link, reselect its destination through this workflow before publishing. This converts the link to the current format.

### Deliberate exceptions

- Primary navigation and footer links are internal-only.
- Partner logos and social links are always external.
