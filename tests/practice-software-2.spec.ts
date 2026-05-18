import { test, expect } from '@playwright/test';

test('Login Page', async ({ page }) => {

  // Open website
  await page.goto('https://practicesoftwaretesting.com/');

  // Click on product
  await page.getByText('Sign In').click();
  // Validate login page loaded
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  // Username fill
  await page.locator('[data-test="email"]').fill('user@example.com');
  // Password fill
  await page.locator('[data-test="password"]').fill('password123');
  // Click on Sign In button
  await page.locator('[data-test="login-submit"]').click();
  // Validate login success
  await expect(page.locator('[data-test="welcome-message"]')).toHaveText('Welcome, user!');
});