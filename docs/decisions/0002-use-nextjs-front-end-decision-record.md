---
status: "accepted"
date: "2026-03-26"
decision-makers: "Vim, Shelby, Carly"
---

# Use Next JS for our front end

## Context and Problem Statement

We have to pick a front end framework for our website! This decision is closely tied to the decision on our hosting provider, documented in the next ADR.

To decide this, the three developers each picked a stack and did a spike on creating a web app with a Sanity CMS backend and deploying it. The spike was to last no longer than 5 hours. The goal was to better understand from first hand experience the pros and cons of developing with each stack. The stacks were Sanity/NextJS/Vercel, Sanity/NextJS/Cloudflare, Sanity/Nuxt/Cloudflare.

<!-- This is an optional element. Feel free to remove. -->
## Decision Drivers

* Complexity and flexibility: Ideally something with low complexity but flexible enough for our purposes
* Learning curve: We don't want to have to learn a totally brand new thing or learn something with that has a high learning curve
* Ease/speed of development: We want to be able to move quickly and have a seamless development experience
* Adoption: We want something moderately adopted by the wider web dev ecosystem (and as a bonus, within PEDP) so that it will be easy to recruit support in the future
* Sanity support: the existence of actively maintained Sanity modules/libraries/templates, educational materials, etc.

## Considered Options

We considered a wide variety of front end frameworks to begin with (e.g. Svelte, SolidJS, Tanstack, etc), and narrowed it down the stack identified above as well as Astro, based on what folks on the team have experience with and what has the highest adoption and community for Sanity.

* Astro
* Next JS
* Nuxt JS / Vue

## Decision Outcome

Chosen option: Next JS. This is already the default recommended and supported option for Sanity projects, and in our research, spikes, and conversation with another team in the PED ecosystem, we determined it had the best developer experience and would meet all our needs.


<!-- This is an optional element. Feel free to remove. -->
## Pros and Cons of the Options

### Astro

Pros:
* Low complexity
* Specifically for content sites, which we are now
* Easy and fast setup
* Cloudlfare just bought Astro, so that integration would be easy
* Sanity support is decent, with a discord chat and an actively maintained integration module

Cons:
* Low adoption so far (4.5%), although this is probably because it has a targeted use case. It is used and supported by major companies.
* Not open source
* We're moving off of Squarespace because it wasn't customizable enough
* Specifically for content sites, which we may grow out of


### Next JS

Pros:
*  Easy to use. This was the easiest and fastest dev setup in the spikes we did.
*  Lots of documentation and training materials
*  Highly adopted in the industry for JavaScript generally as well as for Sanity apps specifically. 20% adoption in the industry.
*  The most Sanity support: Sanity docs are written assuming you're using it with Next, and the Sanity-Next module is the most actively maintained and used
*  Another team in the PEDP ecosystem uses it (Contiguous with OEDP), so others in our network can help or work on it as needed


Cons:
* Complexity: It may be overkill for our needs now, but that does let us grow in future (esp because we have so many ambitious ideas about data apps; this will enable us to pursue those more easily)
* We could run into some costs later if we end up using more backend services, especially if we use vercel.


### Nuxt JS / Vue

Pros:
* Big ecosystem and highly adopted (17% adoption)
* Medium complexity, allows room for growth

Cons:
* Low Sanity support. Even though there's a discord chat, it's not active, and the integration module is not actively maintained.
* Could not get Sanity/Nuxt/Cloudflare working well or speedily set up during our spike



<!-- This is an optional element. Feel free to remove. -->
## More Information

More detailed comparison table here: https://docs.google.com/spreadsheets/d/1RPLh_jrsOd1mZXNRHi8oKeVmhTDMGcEfZx474K_LRE0/edit?gid=628672114#gid=628672114 