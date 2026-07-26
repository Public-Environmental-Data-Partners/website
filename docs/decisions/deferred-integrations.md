# Deferred integrations

Product and infrastructure work intentionally not implemented yet.

| Item               | Current state / decision needed                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Donations          | `/donate` remains a placeholder. Select and integrate Donorbox or another provider, including CSP and accessibility review. |
| Newsletter ESP     | Signups are stored in Sanity. Choose an ESP and migration/synchronization approach before replacing that interim flow.      |
| Analytics          | No Google Analytics loader or environment contract exists. Confirm product/privacy requirements first.                      |
| Site search        | Not present and not required for the initial release.                                                                       |
| Sanity roles       | Publishing roles remain informal. Define permissions when the editor group requires separation of duties.                   |
| Global share image | Site metadata exists, but a default Open Graph image and final production domain still need confirmation.                   |
| Localization       | English-only remains the operating assumption.                                                                              |

Remove an item when its product decision moves into an implementation issue or a
dedicated architecture/operations document.
