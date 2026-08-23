# Deferred integrations

Product and infrastructure work intentionally not implemented yet.

| Item               | Current state / decision needed                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Newsletter ESP     | Signups are stored in Sanity. Choose an ESP and migration/synchronization approach before replacing that interim flow.      |
| Site search        | Not present and not required for the initial release.                                                                       |
| Sanity roles       | Publishing roles remain informal. Define permissions when the editor group requires separation of duties.                   |
| Global share image | Site metadata exists, but a default Open Graph image and final production domain still need confirmation.                   |
| Localization       | English-only remains the operating assumption.                                                                              |

Remove an item when its product decision moves into an implementation issue or a
dedicated architecture/operations document.

## Related (no longer deferred)

Donations: `/donate` is CMS-driven (`sitePage` slug `donate`) with Donorbox
form and Donor Wall embeds. See
[`0009-donorbox-donate.md`](./0009-donorbox-donate.md).

Analytics: PostHog cookieless browser analytics on `apps/web`. See
[`../architecture/analytics.md`](../architecture/analytics.md).
