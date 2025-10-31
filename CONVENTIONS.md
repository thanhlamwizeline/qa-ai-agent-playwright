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

This configuration allows the AI Agent to understand the specific structure and conventions of this automation repository. These settings **override** the default framework configuration in `frameworks/playwright_native_pom_typescript.json`.

**Important:** Only include fields you want to customize. All other fields will use defaults from the framework configuration.

```json
{
  "repository_structure": {
    "description": "Default directory structure. Can be overridden in CONVENTIONS.md Section 12",
    "pages": {
      "directory": "page-objects",
      "description": "Page object files directory",
      "file_patterns": ["*.ts", "**/*.ts"]
    },
    "tests": {
      "directory": "tests",
      "description": "Test spec files directory",
      "file_patterns": ["*.spec.ts", "**/*.spec.ts"]
    },
    "test_data": {
      "directory": "data",
      "description": "Test data files directory",
      "file_patterns": ["*.ts", "*.json"]
    },
    "helpers": {
      "directory": "helpers",
      "description": "Test helper utilities",
      "file_patterns": ["*.ts"]
    }
  },

  "architectural_files": {
    "description": "Critical architectural files that AI should analyze. System searches 'possible_paths' in priority order until found.",
    "files": [
      {
        "name": "POManager",
        "possible_paths": [
          "page-objects/POManager.ts"
        ],
        "description": "Page Object Manager pattern implementation",
        "required": true
      },
      {
        "name": "NavigationComponent",
        "possible_paths": [
          "page-objects/components/NavigationComponent.ts"
        ],
        "description": "Navigation component for routing",
        "required": false
      },
      {
        "name": "CommonActionsHelpers",
        "possible_paths": [
          "helpers/CommonActionsHelpers.ts"
        ],
        "description": "Reusable common actions",
        "required": false
      },
      {
        "name": "TestHelpers",
        "possible_paths": [
          "helpers/TestHelpers.ts"
        ],
        "description": "Test utility helpers",
        "required": false
      },
      {
        "name": "TestSetupHelpers",
        "possible_paths": [
          "helpers/TestSetupHelpers.ts"
        ],
        "description": "Test authentication setup helpers",
        "required": false
      }
    ]
  },

  "file_extensions": {
    "description": "Supported file extensions for this framework",
    "typescript": [".ts"],
    "test_files": [".spec.ts", ".test.ts"],
    "data": [".json", ".ts"]
  },

  "file_naming_patterns": {
    "description": "File naming conventions for AI to find and generate files",
    "page_objects": {
      "suffix": "Page",
      "pattern": "*Page.ts",
      "examples": ["LoginPage.ts", "HomePage.ts", "CartPage.ts", "ProductDetailPage.ts"]
    },
    "test_files": {
      "suffix": ".spec.ts",
      "pattern": "*.spec.ts",
      "examples": ["product_validation.spec.ts", "cart_validation.spec.ts"]
    },
    "components": {
      "suffix": "",
      "pattern": "*Component.ts",
      "examples": ["NavigationComponent.ts", "HeaderComponent.ts", "FooterComponent.ts"]
    },
    "helpers": {
      "suffix": "Actions",
      "pattern": "*Actions.ts",
      "examples": ["CommonActionsHelpers.ts", "TestHelpers.ts", "TestSetupHelpers.ts"]
    }
  },

  "syntax_patterns": {
    "description": "Language and framework-specific syntax patterns for AI code generation and analysis",
    "class_declaration": "export class {ClassName}",
    "constructor": "constructor(page: Page)",
    "private_property": "private readonly {propertyName}: {Type}",
    "method_declaration": "async {methodName}({params}): Promise<{ReturnType}>",
    "import_statement": "import { {symbols} } from '{path}'",
    "import_playwright": "import { test, expect, Page, Locator } from '@playwright/test'",
    "import_page_object": "import { {PageClass} } from '{relativePath}'",
    "test_describe": "test.describe('{description}', () => { })",
    "test_case": "test('{description}', async ({ page }) => { })",
    "test_beforeEach": "test.beforeEach(async ({ page }) => { })",
    "test_use": "test.use({ storageState: 'path/to/state.json' })",
    "locator_patterns": [
      "page.locator('{selector}')",
      "page.getByRole('{role}', { name: '{name}' })",
      "page.getByText('{text}')",
      "page.getByTestId('{testId}')",
      "this.page.locator('{selector}')",
      ".filter({ hasText: '{text}' })",
      ".filter({ has: this.page.locator('{selector}') })"
    ],
    "assertion_patterns": [
      "await expect({locator}).toBeVisible()",
      "await expect({locator}).toHaveText('{text}')",
      "await expect({locator}).toContainText('{text}')",
      "await expect.poll(() => {expression}, { timeout: {ms} }).toContain('{text}')"
    ],
    "action_patterns": [
      "await {locator}.click()",
      "await {locator}.fill('{value}')",
      "await this.page.goto('{url}')",
      "await this.page.waitForLoadState('networkidle')"
    ]
  },

  "code_style_conventions": {
    "description": "Code style conventions for AI code generation",
    "indentation": 2,
    "line_length": 120,
    "quote_style": "single",
    "semicolons": true,
    "naming": {
      "classes": "PascalCase",
      "functions": "camelCase",
      "variables": "camelCase",
      "constants": "UPPER_SNAKE_CASE",
      "private_properties": "camelCase"
    },
    "access_modifiers": {
      "page_properties": "private readonly",
      "locators": "private readonly",
      "methods": "async (public by default)"
    },
    "test_structure": {
      "use_describe_blocks": true,
      "use_test_use_for_setup": true,
      "use_fixtures": true,
      "tags_format": "@tag-name in describe string"
    }
  },

  "search_priorities": {
    "description": "File discovery order for AI analysis. Higher in list = higher priority.",
    "page_objects": [
      "page-objects/*.ts",
      "page-objects/**/*.ts"
    ],
    "test_files": [
      "tests/**/*.spec.ts",
      "tests/*.spec.ts"
    ],
    "helpers": [
      "helpers/*.ts"
    ],
    "architectural": [
      "page-objects/POManager.ts",
      "page-objects/components/NavigationComponent.ts",
      "helpers/CommonActionsHelpers.ts",
      "helpers/TestHelpers.ts",
      "helpers/TestSetupHelpers.ts"
    ]
  },

  "code_generation": {
    "description": "Settings for AI code generation",
    "generated_file_patterns": {
      "test_files": "tests/**/*.spec.ts",
      "page_objects": "page-objects/**/*Page.ts",
      "helpers": "helpers/**/*.ts"
    },
    "naming": {
      "test_suffix": ".spec.ts",
      "page_suffix": "Page.ts",
      "component_suffix": "Component.ts"
    },
    "structure": {
      "test_organization": "describe/test",
      "imports_style": "typescript",
      "use_async_await": true
    },
    "test_file_naming": {
      "pattern": "{feature-name}_{validation-type}.spec.ts",
      "case": "snake_case"
    },
    "imports": {
      "test_framework": "import { test, expect } from '@playwright/test';",
      "use_path_mapping": false
    },
    "test_structure": {
      "use_describe_blocks": true,
      "use_test_fixtures": true,
      "use_test_use_for_setup": true,
      "use_beforeEach": true,
      "async_await": true,
      "tags_in_describe": true
    }
  },

  "test_runner": {
    "description": "Test execution configuration for running tests",
    "command_template": "npx playwright test {filter} {options}",
    "filter_strategies": {
      "by_file": "{test_file_path}",
      "by_tag": "--grep @{tag}",
      "by_name": "--grep {test_name}",
      "by_project": "--project={project_name}"
    },
    "output_format": "json",
    "json_reporter": "--reporter=json",
    "default_timeout": 60000,
    "default_retries": 2,
    "additional_options": [
      "--workers=4",
      "--reporter=html",
      "--trace=on-first-retry"
    ]
  }
```

**Customization Guide:**

- **Fully customizable:** You can override ANY field from `playwright_native_pom_typescript.json`
- **Partial override:** Only include fields you want to change (e.g., just `repository_structure`)
- **Field order:** Matches the framework config file for consistency
- **Key customizable fields:**
  - `repository_structure` - Directory paths specific to your repo
  - `architectural_files` - Critical files AI should analyze
  - `file_naming_patterns` - Naming conventions for generated files
  - `code_style_conventions` - Code style (indentation, quotes, etc.)
  - `search_priorities` - File discovery order
  - `syntax_patterns` - Language-specific syntax (if needed)

**Merge Priority:**
```
Section 12 (this file) > Framework Config > Defaults
```

**Notes:**
- All paths are relative to repository root
- AI Agent reads Sections 1-11 for detailed conventions
- AI Agent reads Section 12 for repo-specific structure
- Update this section when repository structure changes
