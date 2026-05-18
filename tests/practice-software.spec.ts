import { test, expect } from '@playwright/test';

test('Verify the search functionality contains the correct value in the name', async ({ page }, testInfo) => {

// Open website
await page.goto('https://practicesoftwaretesting.com/');

// Search for product
await page.getByPlaceholder('Search').fill('Hammer');
// Trigger search
await page.getByPlaceholder('Search').press('Enter');

// Wait until search term appears
await expect(page.locator('[data-test="search-result-count"]')).toBeVisible();

// Take screenshot evidence
await page.screenshot({
  path: `evidence/search-results-${testInfo.project.name}.png`,
  fullPage: true
});
// Get product names
const products = await page
  .locator('[data-test="product-name"]')
  .allTextContents();
// Pritn Array of products
console.log(products);
// Validate each product contains "Hammer"
for (const product of products) {
  expect(product).toContain('Hammer');
}

});