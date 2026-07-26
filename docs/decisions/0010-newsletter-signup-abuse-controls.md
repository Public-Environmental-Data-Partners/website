---
status: "accepted"
date: "2026-07-26"
---

# Newsletter signup abuse controls (no captcha for now)

## Context and Problem Statement

The site collects newsletter emails via `POST /api/newsletter-signup` and stores
them as Sanity `newsletterSignup` documents until an email service provider
(ESP) is chosen. Open signup endpoints attract bots. Do we need a captcha
(reCAPTCHA, hCaptcha, Turnstile, etc.) on the homepage form now?

## Decision Drivers

- Interim storage only (Sanity list/CSV export; no automated mail sends yet)
- UX friction of captcha widgets and third-party scripts
- Privacy / cookie / CSP cost of captcha vendors
- Existing lightweight protections already in the API and proxy
- Ability to revisit when spam volume or ESP integration changes the risk

## Considered Options

* **Captcha now** — require a challenge token on every submit
* **No captcha; honeypot + rate limit** — keep the current controls
* **Stricter server-only controls without captcha** — e.g. proof-of-work, shared
  rate store, allowlists (more ops complexity without solving human UX)

## Decision Outcome

Chosen option: **no captcha for now**. Rely on the existing abuse controls:

1. **Honeypot** — hidden `website` field; a filled value returns `{ "ok": true }`
   without creating a document
2. **IP rate limit** — proxy allows 15 POSTs per IP per 60 seconds on the signup
   route (in-memory; approximate under multiple instances)
3. **Validation and dedupe** — pragmatic email shape check and case-insensitive
   uniqueness before create

Operational detail lives in
[`docs/ops/newsletter-signup.md`](../ops/newsletter-signup.md). Newsletter ESP
selection remains deferred; see
[`0008-deferred-integrations.md`](./0008-deferred-integrations.md).

### Positive Consequences

- No third-party captcha dependency, script, or privacy notice change
- Signup UX stays a single email field and button
- Enough protection for an interim, manually exported subscriber list

### Negative Consequences

- Sophisticated bots can still submit plausible emails within the rate limit
- In-memory rate limiting is weaker across many serverless instances
- Editors may need to prune junk from Studio if spam appears

## When to revisit

Reassess captcha (or stronger controls) when any of the following is true:

1. Sanity signup volume includes meaningful spam or harassment
2. Signups start flowing into an ESP that sends mail automatically
3. The write path becomes costly or a reliability issue under abuse

At that point, prefer a privacy-friendly challenge (e.g. Cloudflare Turnstile)
only if honeypot/rate-limit hardening is insufficient.
