import { test, expect } from '@playwright/test';

test('Get products API returns successful response', async ({ request }) => {

  // Send GET request
  const response = await request.get(
    'https://api.practicesoftwaretesting.com/products/search?q=Hammer'
  );

  // Validate status code
  expect(response.status()).toBe(200);

  // Convert response to JSON
  const body = await response.json();
  // Validate products exist
  expect(body.total).toBeGreaterThan(0);
  // Search for Hammer product
  const hammerProduct = body.data.find(
  (product: any) => product.name.includes('Hammer')
);
  // Validate Hammer product exists
  expect(hammerProduct).toBeTruthy();

  // Validate each product contains "Hammer"
  for (const product of body.data) {
  expect(product.name).toContain('Hammer');
}

  // Print response
  console.log(body);

});