import { test, expect } from '@playwright/test';
import { BenefitsDashboardPage } from '../../pages/BenefitsDashboardPage';
import { LoginPage } from '../../pages/LoginPage';


test('Authenticated user can complete employee CRUD operations successfully', async ({ page, context}) => {

    const loginPage = new LoginPage(page);
    const dashboardPage = new BenefitsDashboardPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.ensureLoggedOut();
    await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
    // Validate dashboard session is really alive
    await dashboardPage.validateDashboardLoaded();
    const initialEmployeeCount = await dashboardPage.getEmployeeRowsCount();
    console.log(`Initial employee count: ${initialEmployeeCount}`);

    //add employee flow
    await dashboardPage.openAddEmployeeModal();
    await dashboardPage.validateAddEmployeeModalVisible();
    const uniqueId = Date.now();
    const firstName = `Eduardo${uniqueId}`;
    const lastName = `Ruiz${uniqueId}`;
    const dependants = Math.floor(Math.random() * 33).toString();
    await dashboardPage.fillEmployeeForm(firstName, lastName, dependants);
    await dashboardPage.submitEmployeeForm();
    await dashboardPage.validateAddEmployeeModalClosed();
    // Validate employee added successfully
    await dashboardPage.validateEmployeeExists(firstName);
    const updatedEmployeeCount = await dashboardPage.getEmployeeRowsCount();
    console.log(`Updated employee count: ${updatedEmployeeCount}`);
    expect(updatedEmployeeCount).toBeGreaterThan(initialEmployeeCount);
    //Get employee ID for further validations
    const employeeId = await dashboardPage.getEmployeeId(firstName);
    console.log(`Employee ID: ${employeeId}`);

    // Additional validation to ensure the new employee data is correct in the table
    await dashboardPage.validateEmployeeRowData(employeeId!, firstName, lastName, dependants);

    // Employee edition flow
    await dashboardPage.openEditEmployeeModal(employeeId!);
    // Known issue: Edit functionality reuses "Add Employee"
    // modal title instead of "Edit Employee"
    await expect.soft(dashboardPage.addEmployeeModal).toBeVisible();
    const updatedFirstName = `UpdatedEduardo${uniqueId}`;
    const updatedLastName = `UpdatedRuiz${uniqueId}`;
    const updatedDependants = Math.floor(Math.random() * 33).toString();
    await dashboardPage.fillEmployeeForm(updatedFirstName, updatedLastName, updatedDependants);
    await dashboardPage.updateEmployeeForm();
    await dashboardPage.validateAddEmployeeModalClosed();
    await dashboardPage.validateEmployeeRowData(employeeId!, updatedFirstName, updatedLastName, updatedDependants);

    // User deletion flow
    await dashboardPage.openDeleteEmployeeModal(employeeId!);
    await dashboardPage.validateDeleteEmployeeModal(updatedFirstName, updatedLastName);
    await dashboardPage.confirmDeleteEmployee();
    // Validate employee deleted
    await dashboardPage.validateEmployeeDeleted(employeeId!);


    // Logout
    await dashboardPage.logout();
    // Cleanup session
    await context.clearCookies();
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
    // Validate logout successful
    await loginPage.validateLoginPageLoaded();

});