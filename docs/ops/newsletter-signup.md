# Newsletter signup operations

Runbook for the interim newsletter signup flow that stores subscriber email in
Sanity.

## Request flow

`NewsletterSection` sends `POST /api/newsletter-signup` with:

```json
{ "email": "person@example.org", "website": "" }
```

The API:

1. silently accepts a filled honeypot without storing it
2. trims and lowercases the email
3. validates length and a pragmatic email pattern
4. checks for an existing case-insensitive email
5. creates a `newsletterSignup` document with `email` and `submittedAt`
6. returns `{ "ok": true }`

The UI then announces and displays its success state.

## Environment

`SANITY_API_WRITE_TOKEN` must have create access for newsletter signup
documents. Never expose it through a `NEXT_PUBLIC_*` variable or browser code.
The endpoint returns 503 when the write client is unavailable.

## Abuse controls

`apps/web/src/proxy.ts` limits the signup endpoint to 15 POST requests per IP per
60 seconds. The limiter is in memory and therefore approximate across multiple
instances. Excess requests receive 429 with `Retry-After`.

The hidden `website` field is a honeypot; bots receive a normal success response
so the signal is not disclosed.

## Studio and data handling

Studio exposes the signup list and a CSV export containing email and submission
time. Subscriber addresses are personal information; restrict Studio access and
handle exports accordingly.

## Replacing Sanity with an ESP

When an email service provider is selected:

1. export and migrate existing subscriber documents
2. switch the API write destination
3. verify deduplication, consent, and error behavior
4. remove the Sanity signup schema/list/export if no longer needed
5. reassess the proxy rate limit and client success behavior
