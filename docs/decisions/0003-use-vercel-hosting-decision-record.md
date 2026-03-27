---
status: "accepted"
date: "2026-03-26"
decision-makers: "Vim, Shelby, Carly"
---

# Use Vercel for our hosting

## Context and Problem Statement

We have to pick a hosting provider for our Next JS website. This decision is closely tied to the decision on our frontend framework, documented in the previous ADR.

To decide this, the three developers each picked a stack and did a spike on creating a web app with a Sanity CMS backend and deploying it. The spike was to last no longer than 5 hours. The goal was to better understand from first hand experience the pros and cons of developing with each stack. The stacks were Sanity/NextJS/Vercel, Sanity/NextJS/Cloudflare, Sanity/Nuxt/Cloudflare.

<!-- This is an optional element. Feel free to remove. -->
## Decision Drivers

* NextJS support
* Developer experience
* Code needed to set up and maintain
* Cost

## Considered Options

* Cloudflare
* Netlify
* Vercel

Note that we've decided to use Sanity's hosting for the Sanity Studio application and backend, because it is free and pretty much ready out of the box. The options considered here are just for hosting the front end website.

## Decision Outcome

Chosen option: Vercel. As part of this, we will also use the *monorepo* structure for our code, which is conventional for Sanity/Next applications and deployment with Vercel.

We believe this is a good decision for the current needs and getting started quickly, and it does not lock us into Vercel for the long term. Should we decide Cloudflare is a better option later (e.g. for cost reasons or consolidating PEDP tooling), we should be able to migrate with low friction, and by then the tooling and docs to support NextJS on Cloudflare will be more mature.


<!-- This is an optional element. Feel free to remove. -->
## Pros and Cons of the Options

### Cloudflare

Pros:
* Free to get started for front end hosting
* Cheapest for scaling
* More aligned with our devops principles of portability (supports docker containers, feels like less of a vendor lockin situation)
* We might want to use Cloudflare for other applications in the PEDP portfolio/ecosystem, so going with Cloudflare now would reduce tool proliferation
* Can deploy from Github merge to main
* Highly rated dev experience and build and load times

Cons:
* Learning curve / Developer experience: Set up proved tricky and not as well documented as we expected during the spike
* NextJS is only supported through OpenNext, an open source project sponsored by Cloudlfare, Netlify, etc, which adds a layer of abstraction and configuration which does not have 100% next feature support and could get complex
* Some configuration required for deployment - not much, but does need a build script and set up in a dashboard or via CLI.


### Netlify

Pros:
*  Strong free tier for open source projects


Cons:
* Product is more targeted at nontechnical content/marketing folks
* According to devtoolreviews.com, slowest build and load time (by 10-15 seconds), worst rated developer experience
* NextJS is only supported through OpenNext, an open source project sponsored by Cloudlfare, Netlify, etc, which adds a layer of abstraction and configuration which does not have 100% next feature support and could get complex


### Vercel

Pros:
* Fast and effortless to set up and deploy 
* Vercel "owns" NextJS so it is set up to make NextJS deployments successful
* Adoption: Another team in the PEDP ecosystem uses Vercel, and it's a commonly used hosting provider for NextJS and other JS apps.
* Provides Github integration (deploy on merge to main) and preview links for pull requests out of the box
* Highly rated dev experience and build and load times

Cons:
* Costs could sneak up on us


<!-- This is an optional element. Feel free to remove. -->
## More Information

More detailed comparison table here: https://docs.google.com/spreadsheets/d/1RPLh_jrsOd1mZXNRHi8oKeVmhTDMGcEfZx474K_LRE0/edit?gid=628672114#gid=628672114 