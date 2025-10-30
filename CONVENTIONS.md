# CONVENTIONS.md

Conventions for Playwright tests with TypeScript using Anthropic’s Claude Sonnet 4. Focus on consistency, maintainability, scalability by implementing POM design pattern.

## 1. Modularity & Reuse
- Implement POMs in `page-objects/`.
- Extract test helpers to `helpers/`, non-test utilities to `utils/`.
- Use TypeScript path mapping for clean imports (`@/page-objects/*`, `@/helpers/*`, etc.).

## 2. POM Guidelines
- Page-level locators as props.
- Methods for user actions only.
- Keep assertions in test files.

## 3. Structure & Naming
- Hierarchical `tests/feature-area/<test>.spec.ts` structure.
- Descriptive file and test names that reflect the specific functionality being tested (e.g., `product-navigation.spec.ts`).
- `describe` for suites; `test`/`it` for cases.
- Avoid duplicate test names.
- Break down monolithic test files into smaller, focused spec files.
- Each `test.describe` block should be in its own `.spec.ts` file.
- Use descriptive names that reflect the specific functionality being tested

## 4. Readability
- 2-space indentation, 120 char limit.
- `camelCase` for vars/functions; `PascalCase` for classes.
- Clear comments; avoid magic values.
- Use ESLint for consistent code formatting and style enforcement.

## 5. Error Handling & Retries
- Use auto-waiting; prefer condition-based waits.
- Don't use `waitForTimeout` and `test.setTimeout()`, instead use Playwright’s auto-waiting actions and  methods like `page.waitForSelector()` and `page.waitForResponse()`.
- Use retries via `test.describe.configure({ retries: 2 })`.

## 6. Playwright Best Practices
- Use `test.use` for setup/teardown.
- Use locators; avoid brittle selectors.
- Close pages/contexts explicitly.
- Minimize redundant API/UI calls.
- Enable parallel execution.
- Configure trace recording on first retry for debugging.
- Enable video recording on failure for better debugging.
- Set appropriate timeouts for actions and navigation.

## 7. Type Safety
- Enforce strict mode.
- Explicit typing; avoid `any`.
- Use `async/await` consistently.

## 8. Test Data & Env Management
- Define static test data in `data/constants.ts` using dictionaries organized by category.
- Define data schemas and types in `data/data-interfaces.ts`.
- Store additional data in `data/` or fixtures.
- Use `process.env` for configs and sensitive data (e.g., credentials, URLs).
- No hardcoded secrets.
- Read login credentials and URL for home and login page from `data/constants.ts`
- Use `env.example` as template for environment variables
- Configure base URL via `BASE_URL` environment variable with fallback to default

## 9. Logging & Debugging
- Enable trace/video on failure.
- Prefer structured logs.

## 10. Code Quality & Linting
- Use ESLint with TypeScript rules for consistent code style.
- Configure import sorting and duplicate import detection.
- Enforce 2-space indentation and 120 character line limits.
- Use `npm run lint` and `npm run lint:fix` for code quality checks.

## 11. Test Configuration
- Use multiple reporters (HTML, JSON, JUnit) for different CI/CD needs.
- Configure appropriate timeouts for different environments (CI vs local).
- Set up proper retry strategies for flaky tests.
- Use environment-specific worker configurations.

Follow these to ensure consistent, maintainable, production-grade Playwright tests.

## 12. Project Configuration For AI Analysis

This configuration section allows the AI Agent to understand the specific structure and conventions of this automation repository. It overrides the default framework configuration.

**Framework:** `playwright-native`

```yaml
# Repository Structure Configuration
# Defines where the AI Agent should look for different types of files
repository_structure:
  pages:
    directory: "page-objects"
    description: "Page object files directory"
    file_patterns:
      - "*.ts"
      - "**/*.ts"
    subdirectories:
      utils: "helpers"
      components: "page-objects/components"

  tests:
    directory: "tests"
    description: "Test spec files directory"
    file_patterns:
      - "*.spec.ts"
      - "**/*.spec.ts"

  test_data:
    directory: "data"
    description: "Test data files directory"
    file_patterns:
      - "*.ts"
      - "*.json"
    subdirectories:
      config: "data/config"
      testdata: "data/testdata"

  helpers:
    directory: "helpers"
    description: "Test helper utilities"
    file_patterns:
      - "*.ts"

# Architectural Files
# Critical files that the AI Agent should analyze for context
# System searches 'possible_paths' in priority order until found
architectural_files:
  - name: "POManager"
    possible_paths:
      - "page-objects/POManager.ts"
      - "POManager.ts"
      - "src/page-objects/POManager.ts"
    description: "Page Object Manager pattern implementation"
    required: true

  - name: "Navigation"
    possible_paths:
      - "page-objects/components/Navigation.ts"
      - "components/Navigation.ts"
      - "page-objects/Navigation.ts"
    description: "Navigation component for routing"
    required: false

  - name: "CommonActions"
    possible_paths:
      - "helpers/CommonActions.ts"
      - "utils/CommonActions.ts"
    description: "Reusable common actions"
    required: false

  - name: "TestHelpers"
    possible_paths:
      - "helpers/TestHelpers.ts"
      - "utils/TestHelpers.ts"
    description: "Test utility helpers"
    required: false

# File Extensions
file_extensions:
  typescript:
    - ".ts"
  javascript:
    - ".js"
  test_files:
    - ".spec.ts"
    - ".test.ts"
  data:
    - ".json"
    - ".ts"

# Naming Conventions
naming_conventions:
  page_objects:
    suffix: "Page"
    pattern: "*Page.ts"
    examples:
      - "LoginPage.ts"
      - "HomePage.ts"
      - "CheckoutPage.ts"

  test_files:
    suffix: ".spec.ts"
    pattern: "*.spec.ts"
    examples:
      - "login.spec.ts"
      - "checkout.spec.ts"

  components:
    suffix: ""
    pattern: "*.ts"
    examples:
      - "Navigation.ts"
      - "Header.ts"

# Search Priorities
# File discovery order - higher in list = higher priority
search_priorities:
  page_objects:
    - "page-objects/*.ts"
    - "page-objects/**/*.ts"

  test_files:
    - "tests/**/*.spec.ts"
    - "tests/*.spec.ts"

  helpers:
    - "helpers/*.ts"
    - "utils/*.ts"

  architectural:
    - "page-objects/POManager.ts"
    - "page-objects/components/Navigation.ts"
    - "helpers/CommonActions.ts"
    - "helpers/TestHelpers.ts"

# Code Generation Settings (Optional - Override defaults)
code_generation:
  test_file_naming:
    pattern: "{feature-name}.spec.ts"
    case: "kebab-case"

  imports:
    test_framework: "import { test, expect } from '@playwright/test';"
    use_path_mapping: true
    path_mappings:
      "@/page-objects": "./page-objects"
      "@/helpers": "./helpers"
      "@/data": "./data"

  test_structure:
    use_describe_blocks: true
    use_test_fixtures: true
    async_await: true

# Conventions (Optional - Override defaults from sections 1-11)
conventions:
  indentation: 2
  line_length: 120
  quote_style: "single"
  semicolons: true
  naming:
    classes: "PascalCase"
    functions: "camelCase"
    variables: "camelCase"
    constants: "UPPER_SNAKE_CASE"
```

**Notes:**
- This configuration is specific to this repository and overrides the default `playwright-native` framework configuration
- The AI Agent will merge this with the base framework configuration at runtime
- Update this section whenever the repository structure changes
- All paths are relative to the repository root
