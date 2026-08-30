import AxeBuilder from '@axe-core/playwright'
import {expect, test} from '@playwright/test'

const routes = [
  '/',
  '/about',
  '/advocacy',
  '/data-preservation',
  '/donate',
  '/get-involved',
  '/how-we-work',
  '/news-and-updates',
  '/privacy-policy',
  '/tools-development',
]

for (const path of routes) {
  test(`a11y: ${path}`, async ({page}) => {
    await page.goto(path)
    const results = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa'])
      // Donorbox form/wall chrome is third-party; contrast and other a11y of the embed are out of our control.
      .exclude('[data-slot="donorbox-embed"]')
      .analyze()
    expect(results.violations).toEqual([])
  })
}
