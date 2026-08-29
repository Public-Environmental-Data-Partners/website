import {expect, test} from '@playwright/test'

test('data guide links back to the data catalog on mobile', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844})
  await page.goto('/data-guide')

  const catalogLink = page.getByRole('link', {name: 'Return to Data Catalog'})
  await expect(catalogLink).toBeVisible()

  await catalogLink.click()
  await expect(page).toHaveURL('/data-catalog')
  await expect(page.getByRole('heading', {level: 1, name: 'Data Catalog'})).toBeVisible()
})
