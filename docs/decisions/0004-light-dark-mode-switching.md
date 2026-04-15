---
status: "accepted"
date: "2026-04-08"
decision-makers: "Vim, Shelby, Carly, Kameron, Michelle, Dayna"
---

# Support Light and Dark Mode

## Context and Problem Statement

To make our design more accessible and friendly to people with chronic migraines (including multiple folks on our team), we want to have both light and dark modes for the design and be able to display that mode automatically based on the user's browser preferences.

## Decision Drivers

- Accessibility
- Timeliness of when to do this (at early stages of project or later)
- Effort

## Considered Options

- Do not have different modes
- Have light and dark modes

## Decision Outcome

We've decided to implement light and dark modes for accessibility reasons. We also feel that now is the best time to do so, since we are still finalizing designs and have not begun implementation. It is not much more effort to do this now than to not do it, and adding a dark mode and switching later would be more work than doing it now.

Note: We will punt on designing and implementing a toggle in the UI itself. For now we will just do automatic detection of browser settings.

### Positive Consequences <!-- optional -->

- More accessible and migraine-friendly website

### Negative Consequences <!-- optional -->

- A little but more upfront work now for design and dev
