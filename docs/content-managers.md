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
