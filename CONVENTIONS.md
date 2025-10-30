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