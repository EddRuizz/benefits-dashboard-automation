import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {

    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {

        this.page = page;
        this.usernameInput = page.locator('#Username');
        this.passwordInput = page.locator('#Password');
        this.loginButton = page.getByRole('button', {name: 'Log In'});
        this.logoutLink = page.getByRole('link', {name: 'Log Out'});

    }

    async navigate() {
        await this.page.goto('https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Account/Login');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async validateLoginPageLoaded() {
        await expect(this.loginButton).toBeVisible();
    }
    async ensureLoggedOut() {
    if (await this.logoutLink.isVisible()) {
        console.log('Zombie session detected. Logging out...');
        await this.logoutLink.click();
        await expect(this.loginButton).toBeVisible();
    }
}
}