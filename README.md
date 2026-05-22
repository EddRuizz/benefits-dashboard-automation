Benefits Dashboard QA Assessment
#Overview

This project contains a complete QA assessment for the Paylocity Benefits Dashboard application, including:

Manual Testing
API Testing
UI Automation Testing
Bug Reporting
Enhancement Suggestions

The automation framework was developed using Playwright with TypeScript following a Page Object Model (POM) structure for better scalability and maintainability.

The goal of this project was not only to automate happy paths, but also to validate business rules, API behavior, data integrity, and identify potential usability or backend issues during execution.

#Tech Stack
| Area                 | Technology                          |
| -------------------- | ----------------------------------- |
| Automation Framework | Playwright                          |
| Language             | TypeScript                          |
| Design Pattern       | Page Object Model (POM)             |
| API Testing          | Playwright APIRequestContext        |
| Reporting            | Playwright HTML Reports             |
| Assertions           | Playwright Expect + Soft Assertions |
| Manual Testing       | Excel Test Matrix                   |

#Project Structure
pages/
tests/
  api/
  ui/
playwright.config.ts
package.json
playwright/.auth

#Testing Scope
#Manual Testing

Manual testing includes:

Functional validation
Negative scenarios
UI behavior validation
API validation
Bug discovery
Enhancement opportunities

The Excel matrix contains:

Test Cases
Execution Results
Bug Tracking
Enhancement Notes
API Automation Coverage

The API automation suite validates the main employee operations and employee data integrity.

#Covered methods include:
| Test Case | Description                                                         |
| --------- | ------------------------------------------------------------------- |
| GET       | Retrieve employee records and validate employee data integrity      |
| POST      | Create employee record and validate persisted employee data         |
| PUT       | Update employee record and validate updated employee data integrity |
| DELETE    | Delete employee record and validate successful employee removal     |

#Additional API validations include:

Status code validation
Employee payload integrity
Business calculation validation
Authentication/session handling
Negative response validation

Soft assertions were implemented for financial and business-rule related validations such as:

Gross salary
Benefits cost
Net salary calculations


#UI Automation Coverage

UI automation focuses on:

Login flows
Employee management flows
Modal behavior
Form validation
UI interaction consistency
Negative scenarios

The framework uses reusable page objects to centralize selectors and actions.

#Bugs & Findings

Several functional and API-related issues were identified during testing, including:

API update operation unexpectedly modifying employee salary values
Unauthorized dashboard access behavior
Modal overlap preventing manual interaction
Missing session expiration handling
UI/API inconsistencies
API contract and endpoint behavior issues

Enhancement opportunities were also documented for usability and user experience improvements.

#Future Improvements
Several additional improvements were identified during the implementation process and could further enhance the framework scalability and stability:

- Improved session persistence handling for API and UI authentication flows
- Expanded API negative and edge-case coverage
- Cross-browser parallel execution optimization and stability validation

#Known Challenges

One of the main implementation challenges involved authentication/session handling during API execution.

During implementation, session persistence using Playwright storage state was explored but replaced with per-test authentication flows to improve execution reliability and reduce intermittent session-related failures.

Initial attempts using Playwright storage state persistence introduced intermittent session inconsistencies. The issue was mitigated by implementing fresh authentication flows before each API execution and adding synchronization waits where necessary.

Storage state authentication was explored but ultimately replaced with per-test authentication flows to improve execution stability during API validation.

Running Tests
Install Dependencies
npm install
Run All Tests
npx playwright test
Run API Tests
npx playwright test tests/api
Run UI Tests
npx playwright test tests/ui
Run Tests in Debug Mode
PWDEBUG=1 npx playwright test
HTML Reports

After execution, Playwright HTML Reports can be opened using:

npx playwright show-report
Final Notes

This project evolved beyond simple automation scripting and became a full QA validation exercise covering:

Functional testing
API behavior analysis
Business rule validation
Test design
Automation framework implementation
Defect investigation
Usability improvements

A strong focus was placed on understanding system behavior and validating real-world scenarios rather than only automating expected paths.