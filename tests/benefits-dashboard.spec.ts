import { test, expect } from '@playwright/test';

test('search Playwright docs', async ({ page }) => {

  // Open website
  await page.goto('https://playwright.dev/');

  // Click Get Started
  await page.getByRole('link', { name: 'Get started' }).click();

  // Take a screenshot of the page
  await page.screenshot({
  path: `screenshot-${test.info().project.name}.png`
});

  // Validate Installation heading appears
  await expect(
    page.getByRole('heading', { name: 'Installation' })
  ).toBeVisible();

});