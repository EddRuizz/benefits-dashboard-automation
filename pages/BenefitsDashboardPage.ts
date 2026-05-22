import { Page, Locator, expect } from '@playwright/test';

// BenefitsDashboardPage encapsulates interactions with the Paylocity Benefits Dashboard, providing methods to navigate, add employees, validate data, and manage sessions. It uses Playwright's Page and Locator APIs to interact with the web application, ensuring that tests can be written in a clean and maintainable way.
export class BenefitsDashboardPage {
    readonly page: Page;
    readonly dashboardTitle: Locator;
    readonly addEmployeeButton: Locator;
    readonly addEmployeeModal: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly dependantsInput: Locator;
    readonly submitButton: Locator;
    readonly employeeTable: Locator;
    readonly logoutLink: Locator;
    readonly deleteEmployeeModal: Locator;
    readonly confirmDeleteButton: Locator;
    readonly updateEmployeeButton: Locator;

 //Initialize locators in the constructor   
    constructor(page: Page) {
        this.page = page;
        this.dashboardTitle = page.getByRole('link', {
              name: 'Paylocity Benefits Dashboard'
        });
        this.addEmployeeButton = page.getByRole('button', {
            name: 'Add Employee'
        });
        this.addEmployeeModal = page.locator('.modal-title',{
            hasText: 'Add Employee'
        });
        this.firstNameInput = page.getByLabel('First Name');
        this.lastNameInput = page.getByLabel('Last Name');
        this.dependantsInput = page.locator('#dependants');
        this.submitButton = page.locator('#addEmployee');
        this.employeeTable = page.locator('table');
        this.logoutLink = page.getByRole('link', {
            name: 'Log Out'
        });
        this.deleteEmployeeModal = page.locator('.modal-title',{
            hasText: 'Delete Employee'
        });
        this.confirmDeleteButton = page.locator('#deleteEmployee');
        this.updateEmployeeButton = page.locator('#updateEmployee');
    }

// Define methods for page interactions and validations
    async navigate() {
        await this.page.goto('https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Benefits');
        }
    async validateDashboardLoaded() {
        await expect(this.logoutLink).toBeVisible();
        await expect(this.page.locator('#employeesTable tbody tr').first()).toBeVisible();
    }
    async openAddEmployeeModal() {
        await this.addEmployeeButton.click();
    }
    async validateAddEmployeeModalVisible() {
        await expect(this.addEmployeeModal).toBeVisible();
    }
    async validateAddEmployeeModalClosed() {
        await expect(this.addEmployeeModal).not.toBeVisible();
    }
    async getEmployeeRowsCount() {
        await this.employeeTable.waitFor();
        return await this.page.locator('#employeesTable tbody tr').count();
    }
    async validateEmployeeExists(employeeName: string) {
        await expect(this.page.locator('#employeesTable')).toContainText(employeeName);
    }
    async fillEmployeeForm(
        firstName: string,
        lastName: string,
        dependants: string
    ) {
        await this.firstNameInput.clear();
        await this.lastNameInput.clear();
        await this.dependantsInput.clear();
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.dependantsInput.fill(dependants);
    }
    async submitEmployeeForm() {
        await this.submitButton.click();
    }
    async logout() {
        await this.logoutLink.click();
    }
    async validateEmployeeRowData(
        employeeId: string,
        firstName: string,
        lastName: string,
        dependants: string
    ) {
    const employeeRow = this.page.locator('#employeesTable tbody tr',{hasText: employeeId});
    const dependantsNumber = Number(dependants);
    const expectedBenefitsCost = ((1000 + (dependantsNumber * 500)) / 26).toFixed(2);
    const expectedNetPay = (2000 - Number(expectedBenefitsCost)).toFixed(2);
    await expect(employeeRow).toContainText(employeeId);
    await expect(employeeRow).toContainText(firstName);
    await expect(employeeRow).toContainText(lastName);
    await expect(employeeRow).toContainText(dependants);
    await expect(employeeRow).toContainText('52000.00');
    await expect(employeeRow).toContainText('2000.00');
    await expect(employeeRow).toContainText(expectedBenefitsCost);
    await expect(employeeRow).toContainText(expectedNetPay);
    }
    async getEmployeeId(
        firstName: string
    ) {
        const employeeRow = this.page.locator('#employeesTable tbody tr',{
            hasText: firstName
        });
        return await employeeRow.locator('td').nth(0).textContent();
    }
    async openEditEmployeeModal(
        employeeId: string
    ) {
        const employeeRow = this.page.locator('#employeesTable tbody tr',{
            hasText: employeeId
        });
        await employeeRow.locator('.fa-edit').click();
    }
    async updateEmployeeForm() {
        await this.updateEmployeeButton.click();
    }
    async openDeleteEmployeeModal(
        employeeId: string
    ) {
        const employeeRow = this.page.locator('#employeesTable tbody tr',{
            hasText: employeeId
        });
    await employeeRow.locator('.fa-times').click();
       }
    async validateDeleteEmployeeModal(
        firstName: string,
        lastName: string
    ) {
        await expect(this.deleteEmployeeModal).toBeVisible();
        await expect(this.page.locator('#deleteFirstName')).toContainText(firstName);
        await expect(this.page.locator('#deleteLastName')).toContainText(lastName);
    }
    async confirmDeleteEmployee() {
    await this.confirmDeleteButton.click();
    }
    
    async validateEmployeeDeleted(
        employeeId: string
    ) {
        await expect(this.page.locator('#employeesTable')).not.toContainText(employeeId);
    }

}