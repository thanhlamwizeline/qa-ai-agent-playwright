# README #

### What is this repository for? ###

* Automation Test Project Template by Playwright Typescript

### Whom should I contact? ###

* Wizeline QA Share community
* Ho Nguyen
* Trang Than

### How to set up the environment? ###
* Clone the repo
* Create a new `.env` file from `.env.sample` and fill all the values
    - Env vars:
      - `BASE_URL_E2E`
      - `username`
      - `password`
* Run
  ```shell
  npm install
  ```
  
## Test commands

The project includes a set of tests to ensure the stability and correct functionality of the application. The testing framework is built with [Playwright](https://playwright.dev). You can run the tests using the following commands:

- For end-to-end (e2e):
    ```shell
    npm run tests:e2e
    ```
    
- Run Test on all browsers (Chrome, Firefox, Edge):
    ```shell
    npm run tests:e2e-allbrowsers
    ```
## Template features
This project encompasses various scenarios and practices, including:

**Playwright (build-in)**
* Implementation of Page Object Model
* Utilization of Page Object Manager
* Integration of a common component (Navigation)
* Incorporation of utils featuring CommonAction and TestHelpers
* Application of Data Provider
* Configuration of test parameters using testconfig in an external file
* Utilization of Environment Variables
* Implementation of Hooks
* Execution of tests with annotations such as "Smoke" or "Regression"
* Integration of storage state for preserving login status
* Multi-browser execution capability
* Parallel execution of tests
* Execution in both Headless and Headed modes
* Implementation of Visual Testing
* Integration of GitHub Actions
* HTML reporting for Playwright

## Tech Stack
* Playwright
* TypeScript
* GitHub Actions

## Project Structure
 ```shell
.github/workflows/
 └── e2e_default_test.yml         # CI/CD workflow for E2E tests

data/
 ├── config/
 │    └── testconfig.ts           # Environment/test configuration
 ├── testdata/
 │    ├── products/
 │    │    └── data_e2e.json      # E2E product data
 │    └── constants.ts            # Global constants & URLs

pages/
 ├── components/
 │    └── Navigation.ts           # Shared UI component
 ├── utils/
 │    ├── CartPage.ts
 │    ├── HomePage.ts
 │    ├── LoginPage.ts
 │    ├── ProductDetailPage.ts
 │    └── POManager.ts            # Centralized Page Object manager

tests/
 └── e2e/
      ├── __screenshots__/        # Visual regression baselines
      ├── e2e_basic.spec.ts
      ├── e2e_image.spec.ts
      ├── e2e_product.spec.ts
      └── auth.setup.ts

.gitignore
README.md
CONVENTIONS.md  
```
## GitHub Actions
Make sure to create Actions Secrets for each environment variable stated above. This is used to create a .env file for the GitHub Actions executions.
* secrets.BASE_URL_E2E=https://www.demoblaze.com
* secrets.USERNAME (username to login https://www.demoblaze.com)
* secrets.PASSWORD (password of the above username)

Jobs:
* `Playwright Tests` in `e2e_default_test.yml`: Run all e2e tests on Chrome
* `Playwright Cucumber Tests` in `e2e_default_test_cucumber.yml`: Run all smoke cucumber test cases on Chrome

## Scripts:
Below are the sample scripts that we can run with npm run {scriptname} like `npm run tests:e2e`
```shell
"tests:e2e": "npx playwright test --project=TestOnChrome",
"tests:e2e-basic": "npx playwright test --grep @smoke --project=TestOnChrome",
"tests:e2e-firefox": "npx playwright test --project=TestOnFireFox",
"tests:e2e-edge": "npx playwright test --project=TestOnEdge",
"tests:e2e-allbrowsers": "npx playwright test --project=MultiBrowser",
```
