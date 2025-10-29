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
* Run 
  ```shell
  npm install @cucumber/cucumber
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

- Run Test with Cucumber:
    ```shell
    npm run tests:cucumber-chrome
    npm run tests:cucumber-chrome-headless
    npm run tests:cucumber-smoke
    npm run tests:cucumber-smoke-parallel
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

**Playwright Cucumber**
* Adoption of the Page Object Model
* Implementation of Test Definitions
* Utilization of Cucumber for test scenarios and scenario outlines for data parameterization
* Implementation of World for test context
* Integration of Hooks for additional functionality
* Retry mechanism
* Execution of tests with annotations like "Smoke" or "Regression"
* Capability for multi-browser execution
* Parallel execution of tests
* Execution in both Headless and Headed modes
* Integration of GitHub Actions
* Generation of Cucumber reports

## Tech Stack
* Playwright
* TypeScript
* GitHub Actions

## Project Structure
 ```shell
├── .github/workflows                           # Directory containing GitHub Actions files
├── data                                        # Test data
│   ├── config                                  
│   └── testdata
├── features                                    # Cucumber features
│   ├── helpers
│   ├── step_definitions                        # Cucumber step definitions
│   ├── Login Validation Test Suite.feature     # Feature file storing Cucumber scenarios
├── pages                                       # Page objects
│   ├── CartPage.ts
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── POManager.ts
│   ├── ProductDetailPage.ts
│   ├── components
│   │   └── Navigation.ts
│   └── utils
│       ├── CommonActions.ts
│       └── TestHelpers.ts
├── tests                                       # FE Test cases
│   ├── auth.setup.ts
│   └── e2e
│       ├── __screenshots__
│       ├── e2e_basic.spec.ts
│       └── e2e_image.spec.ts
├── .env
├── cucumber.json                               # Cucumber configuration 
├── package.json
└── playwright.config.ts                        
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
"tests:cucumber": "npx cucumber-js --require features/helpers/hooks.ts --exit",
"tests:cucumber-chrome": "BROWSER=chrome npx cucumber-js --require features/helpers/hooks.ts --exit",
"tests:cucumber-chrome-headless": "BROWSER=chrome HEADLESS=true npx cucumber-js --require features/helpers/hooks.ts --exit",
"tests:cucumber-firefox": "BROWSER=firefox npx cucumber-js --require features/helpers/hooks.ts --exit",
"tests:cucumber-firefox-headless": "BROWSER=firefox HEADLESS=true  npx cucumber-js --require features/helpers/hooks.ts --exit",
"tests:cucumber-safari": "BROWSER=webkit npx cucumber-js --require features/helpers/hooks.ts --exit",
"tests:cucumber-safari-headless": "BROWSER=webkit HEADLESS=true npx cucumber-js --require features/helpers/hooks.ts --exit",
"tests:cucumber-login": "npx cucumber-js --require features/helpers/hooks.ts --tags='@login' --exit",
"tests:cucumber-smoke": "npx cucumber-js --require features/helpers/hooks.ts --tags='@smoke' --exit",
"tests:cucumber-regression": "npx cucumber-js --require features/helpers/hooks.ts --tags='@regression' --exit",
"tests:cucumber-smoke-parallel": "npx cucumber-js --require features/helpers/hooks.ts --tags='@smoke' --parallel 3 --exit",
"tests:cucumber-smoke-parallel-retry": "npx cucumber-js --require features/helpers/hooks.ts --tags='@smoke' --parallel 3 --retry 1 --exit"
```

## Reference
* Step definitions example: https://wizeline.github.io/qa-ai-agent-generate-automation/
