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
qa-ai-agent-playwright-native-typescript-automation/
├── .gitignore
├── .vscode/
│
├── .github/
│   └── workflows/
│       ├── e2e_default_test.yml
│       └── extract_page_methods.yml
│
├── data/
│   ├── cartPage/
│   ├── config/
│   ├── homepage/
│   ├── login/
│   ├── products/
│   ├── constants.ts
│   └── data-interfaces.ts
│
├── helpers/
│   ├── CommonActionsHelpers.ts
│   ├── TestHelpers.ts
│   └── TestSetUpHelpers.ts
│
├── node_modules/
│
├── page-objects/
│   ├── components/
│   │   └── NavigationComponent.ts
│   ├── BasePage.ts
│   ├── CartPage.ts
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── POMManager.ts
│   └── ProductDetailPage.ts
│
├── playwright/
│   └── .auth/
│
├── playwright-report/
│
├── scripts/
│   └── extract_playwright_methods.py
│
├── test-results/
│   ├── .last-run.json
│   └── test-results-2025-11-04T12-58-32-722Z/
│
├── tests/
│   ├── feature_cart/
│   ├── feature_homepage/
│   ├── feature_login/
│   └── feature_product/
│
├── utils/
│   └── utils_function.ts
│
├── .env
├── CONVENTIONS.md
├── eslint.config.mjs
├── package.json
├── package-lock.json

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
## ESLint

Use ESLint with TypeScript rules for consistent code style, configure import sorting and duplicate import detection.
Enforce 2-space indentation and 120 character line limits.

- Run ESLint:
    ```shell
    npm run lint
    ```

- Fix ESLint:
    ```shell
    npm run lint:fix
    ```
## Page Methods Reference
*  https://wizeline.github.io/qa-ai-agent-playwright-native-typescript-automation/
