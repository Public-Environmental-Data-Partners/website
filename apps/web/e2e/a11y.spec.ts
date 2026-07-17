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
  '/tool-development',
]

for (const path of routes) {
  test(`a11y: ${path}`, async ({page}) => {
    await page.goto(path)
    const results = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(results.violations).toEqual([])
  })
}
