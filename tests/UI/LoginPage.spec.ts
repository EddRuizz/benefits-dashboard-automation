import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { testUser } from '../../data/users';

test('Login Page', async ({ page }, testInfo) => {

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
    testUser.email,
    testUser.password
  );

  // Validate login success
  await expect(
  page.locator('[data-test="page-title"]')
  ).toHaveText('My account');

test.afterEach(async ({ page }, testInfo) => {

  if (testInfo.status !== testInfo.expectedStatus) {

    await testInfo.attach('failure-screenshot', {
      body: await page.screenshot(),
      contentType: 'image/png'
    });

  }

});

});