import { Page, expect } from '@playwright/test';

export class LoginPage {

  constructor(private page: Page) {}

  // Locators
  emailInput = this.page.locator('[data-test="email"]');
  passwordInput = this.page.locator('[data-test="password"]');
  signInButton = this.page.locator('[data-test="login-submit"]');
  loginHeader = this.page.getByRole('heading', { name: 'Login' });

  // Actions
  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/');
  }

  async openLoginPage() {
    await this.page.getByText('Sign In').click();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  // Assertions
  async validateLoginPageLoaded() {
    await expect(this.loginHeader).toBeVisible();
  }

}