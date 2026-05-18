import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

test('Login Page', async ({ page }) => {

  // Create Login Page object
  const loginPage = new LoginPage(page);

  // Open website
  await loginPage.goto();

  // Open Login page
  await loginPage.openLoginPage();

  // Validate login page loaded
  await loginPage.validateLoginPageLoaded();

  // Login
  await loginPage.login(
    'customer@practicesoftwaretesting.com',
    'welcome01'
  );

  // Validate login success
  await expect(
    page.locator('[data-test="welcome-message"]')
  ).toHaveText('Welcome, user!');

});