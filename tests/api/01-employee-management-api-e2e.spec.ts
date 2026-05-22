import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { BenefitsDashboardPage } from '../../pages/BenefitsDashboardPage';

// Shared employee ID between tests
let employeeId: string;
let employeeData: any = {};
const salary = 52000;
const gross = 2000;

function benefitsCosts(dependants: number): number {
  const costEmployee = 1000;
  const costDependant = 500;
  let annualTotal = costEmployee + (dependants * costDependant);
  return annualTotal / 26;
}

// Login before each test to ensure authenticated session
  test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  // Navigate to login page
  await loginPage.navigate();
  await loginPage.ensureLoggedOut();
  // Execute login
  await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
  });

//Logout after each test to ensure clean state for next test
    test.afterEach(async ({ page }) => {
    const dashboardPage = new BenefitsDashboardPage(page);
    // Logout after each test
    await dashboardPage.logout();
    // Wait before next execution
    await page.waitForTimeout(2000);
  });

  test('TC-API-001 - Create employee record and validate persisted employee data', async ({ page, context }) => {
    // Wait for page to load correctly
    await page.waitForTimeout(2000);
    // Dynamic employee payload
    const uniqueId = Date.now();
    const employeePayload = {
      firstName: `EduardoAPI${uniqueId}`,
      lastName: `RuizAPI${uniqueId}`,
      dependants: Math.floor(Math.random() * 33)
    };
    // Execute POST request
    const response = await context.request.post('https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees',
        {
          data: employeePayload
        });
    // Log response details for debugging
    console.log('POST Status:', response.status());
    employeeData = await response.text();
    console.log('Customer Data:', employeeData);
    // Validate successful creation
    expect(response.status()).toBe(200);
    // Parse response body
    const responseBody = await response.json();
    
    // Store created employee ID
    employeeId = responseBody.id;
    console.log('Created Employee ID:', employeeId);
    // Validate created employee data
    expect(responseBody.id).toBeTruthy();
    expect(responseBody.username).toBeTruthy();
    expect(responseBody.firstName).toBe(employeePayload.firstName);
    expect(responseBody.lastName).toBe(employeePayload.lastName);
    expect(responseBody.dependants).toBe(employeePayload.dependants);
    //Salary calculation
    expect(responseBody.salary).toBe(salary, 2);
    console.log('Annual Salary has been correctly set to: $', responseBody.salary);
    expect(responseBody.gross).toBe(gross, 2);
    console.log('Monthly Gross has been correctly set to: $', responseBody.gross);
    const expectedBenefitsCost = benefitsCosts(responseBody.dependants);
    expect(responseBody.benefitsCost).toBeCloseTo(expectedBenefitsCost, 2);
    console.log('Benefits Cost has been correctly calculated to: $', responseBody.benefitsCost);
    const netPay = salary / 26 - expectedBenefitsCost;
    expect(responseBody.net).toBeCloseTo(netPay, 2);
    console.log('The Net payment is: $', responseBody.net);

  }
);

test('TC-API-002 - Get employee records and validate employee data integrity', async ({ page, context }) => {
  // Wait for page to load correctly
  await page.waitForTimeout(2000);
    // Execute GET request
    const response = await context.request.get('https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees');
        // Validate response status
        expect(response.status()).toBe(200);
        // Parse response body
        const employees = await response.json();
        // Find created employee using shared ID
        const createdEmployee = employees.find(
        (employee: any) =>
          employee.id === employeeId
      );
      //Validations of employee
      console.log('POST Status:', response.status());
      console.log('Employee ID is retrived:', createdEmployee.id);
      // Validate employee exists and has correct ID
      expect(createdEmployee).toBeTruthy();
      expect(createdEmployee.id).toBe(employeeId);
      console.log('Employee data: ', createdEmployee);
      //Salary calculation
    expect(createdEmployee.salary).toBe(salary, 2);
    console.log('Annual Salary has been correctly set to: $', createdEmployee.salary);
    expect(createdEmployee.gross).toBe(gross, 2);
    console.log('Monthly Gross has been correctly set to: $', createdEmployee.gross);
    const expectedBenefitsCost = benefitsCosts(createdEmployee.dependants);
    expect(createdEmployee.benefitsCost).toBeCloseTo(expectedBenefitsCost, 2);
    console.log('Benefits Cost has been correctly calculated to: $', createdEmployee.benefitsCost);
    const netPay = salary / 26 - expectedBenefitsCost;
    expect(createdEmployee.net).toBeCloseTo(netPay, 2);
    console.log('The Net payment is: $', createdEmployee.net);
  }
);

test('TC-API-003 - Update employee record and validate updated employee data integrity', async ({ page, context }) => {
  // Wait for page to load correctly
    await page.waitForTimeout(2000);
    // Updated employee payload
    const updatedPayload = {
      id: employeeId,
      firstName: 'UpdatedEduardoAPI',
      lastName: 'UpdatedRuizAPI',
      dependants: Math.floor(Math.random() * 33),
      salary: 55000.00,
      expiration: null
    };
    // Execute PUT request
    const updateResponse = await context.request.put(`https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees/`,
        {
          data: {
            id: employeeId,
            ...updatedPayload
          }
        }
      );

    // Log response details
    console.log('Request Method: PUT');
    console.log('Employee ID:', employeeId);
    console.log('PUT Status:',updateResponse.status());
    console.log(await updateResponse.text());
    // Validate successful update
    expect(updateResponse.status()).toBe(200);
    // Parse and validateupdated employee
    const updatedEmployee = await updateResponse.json();
    expect(updatedEmployee.firstName).toBe(updatedPayload.firstName);
    expect(updatedEmployee.lastName).toBe(updatedPayload.lastName);
    expect(updatedEmployee.dependants).toBe(updatedPayload.dependants);
    //Check Salary and benefits calculations are correct after update
    //expect.softassertions make fail delete TC if update fails, causing employeeId to be undefined in delete test, which would lead to cascading failures.
    console.log('updatedEmployee:', updatedEmployee);
    expect.soft(updatedEmployee.salary).toBe(salary, 2);
    console.log('Annual Salary has been correctly set to: $', updatedEmployee.salary);
    expect.soft(updatedEmployee.gross).toBe(gross, 2);
    console.log('Monthly Gross has been correctly set to: $', updatedEmployee.gross);
    const expectedBenefitsCost = benefitsCosts(updatedEmployee.dependants);
    expect.soft(updatedEmployee.benefitsCost).toBeCloseTo(expectedBenefitsCost, 2);
    console.log('Benefits Cost has been correctly calculated to: $', updatedEmployee.benefitsCost);
    const netPay = salary / 26 - expectedBenefitsCost;
    expect.soft(updatedEmployee.net).toBeCloseTo(netPay, 2);
    console.log('The Net payment is: $', updatedEmployee.net);
   

  }
);

// If any assertion fails during the update validation,
// the shared employeeId variable may not persist correctly,
// causing the DELETE test to fail due to undefined employeeId.
test('TC-API-004 - Delete employee record and validate successful employee removal', async ({ context }) => {
    console.log('Employee ID before deletion:', employeeId);
    // Execute DELETE request (El ID va concatenado al final de la URL)
    const deleteResponse = await context.request.delete(
      `https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/Employees/${employeeId}`
    );

    // Log response details
    console.log('Request Method: DELETE');
    console.log('DELETE Status:', deleteResponse.status());
    const responseText = await deleteResponse.text();
    console.log('Response Body:', responseText);

    // Validate successful deletion
    expect(deleteResponse.status()).toBe(200);
  }
);