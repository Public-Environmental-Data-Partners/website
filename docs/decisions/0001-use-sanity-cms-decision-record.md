---
# These are optional metadata elements. Feel free to remove any of them.
status: "accepted"
date: "2026-03-12"
decision-makers: "Vim, Shelby, Kameron, Carly"
consulted: "Michelle, Izzy"
---

# Use Sanity for our CMS

## Context and Problem Statement

We need a CMS for the website so that nontechnical team members such as content writers can create, manage, and delete content and create beautiful, dynamic pages. 

<!-- This is an optional element. Feel free to remove. -->
## Decision Drivers

* Content management features (auth, rich text editing, audio player, staging/previews, collaboration features, data catalog integration possibilities, custom widgets, custom page templates, i18n support)
* Cost
* Portability (hosting options)
* Open source
* Adoption
* Ease of use / implementation

## Considered Options

* Headful CMSes, e.g. Squarespace
* Git-based headless like Decap CMS
* API-based headless: Sanity
* API-based headless: Payload CMS
* API-based headless: Contentful
* API-based headless: Strapi
* Traditional CMS
* Hybrid: Apostrophe CMS

## Decision Outcome

Chosen option: Sanity, because it has all the required features, is open source, has both a hosted and self-hosted option (i.e. is portable), the hosted option has a strong free plan that should meet our needs, it's highly adopted in the industry and by one of our organizational poartners (OEDP), and has a lot of resources (community, templates, modules, trainings, etc) for getting started.


<!-- This is an optional element. Feel free to remove. -->
## Pros and Cons of the Options

### Headful CMSes, e.g. Squarespace

Pros:
* Easy to use for non technical folks

Cons:
* Locked into vendor
* Not open source
* We're moving off of Squarespace because it wasn't customizable enough


### Git-based headless like Decap CMS

Pros:
* Open source
* Free / cost effective

Cons:
* Best for Dev-friendly blogs, docs sites (not our use case)
* Limited i18n support and scalability
* Limited content management features
* Content typically managed/stored as markdown, which is better for more technical users and less complex websites

### API-based headless: Sanity

Pros:
* has all the required features
* is open source
* has both a hosted and self-hosted option (i.e. is portable)
* the hosted option has a strong free plan that should meet our needs
* it's highly adopted in the industry and by one of our organizational poartners (OEDP)
* has a lot of resources (community, templates, modules, trainings, etc) for getting started

Cons:
* More setup, higher learning curve than other categories of CMS
* Biased towards NextJS front end


### API-based headless: Payload CMS

Pros:
* has all the required features
* is open source
* moderately adopted
* free

Cons:
* More setup, higher learning curve than other categories of CMS
* Have to self-host or find a provider (more management on us)
* Requires NextJS


### API-based headless: Contentful

Pros:
* has all the required features
* moderately adopted

Cons:
* More setup, higher learning curve than other categories of CMS
* Not open source
* Not portable, must use their hosting


### API-based headless: Strapi

Pros:
* has all the required features
* is open source
* has both a hosted and self-hosted option (i.e. is portable)

Cons:
* More setup, higher learning curve than other categories of CMS
* Less adopted than other options
* For hosted version, free tier only includes one user, so less cost-effective

### Traditional CMS

Pros:
* has all the required features
* can be open source
* has both a hosted and self-hosted option (i.e. is portable)
* strong i18n support
* active communities and abundant education resources

Cons:
* Monolithic
* plugin bloat
* security surface


### Hybrid: Apostrophe CMS

Pros:
* has all the required features
* is open source
* portable, can be self-hosted

Cons:
* Less active community
* Edge, still figuring things out
* More moving parts

<!-- This is an optional element. Feel free to remove. -->
## More Information

More detailed comparison table here: https://docs.google.com/spreadsheets/d/1RPLh_jrsOd1mZXNRHi8oKeVmhTDMGcEfZx474K_LRE0/edit?gid=628672114#gid=628672114 