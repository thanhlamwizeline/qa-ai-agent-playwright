# CONVENTIONS.md

Conventions for Playwright tests with TypeScript using Anthropic’s Claude Sonnet 4. Focus on consistency, maintainability, scalability by implementing POM design pattern.

## 1. Modularity & Reuse
- Implement POMs in `page-objects/`.
- Extract test helpers to `helpers/`, non-test utilities to `utils/`.
- Use TypeScript path mapping for clean imports (`@/page-objects/*`, `@/helpers/*`, etc.).
- Use default config

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
  "framework_id": "playwright_native_pom_typescript",

  "repository_structure": {
    "description": "Defines where different file types are organized in the repository. RepoAnalyzer uses 'combined_patterns' to discover files. FileManager uses these patterns for TIER 3 (CONTEXT) classification with smart summary. Can be overridden in CONVENTIONS.md 'Project Configuration For AI Analysis' section.",
    "pages": {
      "description": "Page object files location. Full glob patterns with directory prefix.",
      "combined_patterns": ["page-objects/*.ts", "page-objects/**/*.ts"]
    },
    "tests": {
      "description": "Test spec files location. Full glob patterns with directory prefix.",
      "combined_patterns": ["tests/*.spec.ts", "tests/**/*.spec.ts"]
    },
    "test_data": {
      "description": "Test data files location. Full glob patterns with directory prefix.",
      "combined_patterns": ["data/*.ts", "data/*.json"]
    },
    "helpers": {
      "description": "Helper utility files location. Full glob patterns with directory prefix.",
      "combined_patterns": ["helpers/*.ts"]
    }
  },

  "architectural_files": {
    "description": "Critical architectural files that need special handling. RepoAnalyzer searches 'possible_paths' in order until found. FileManager loads these as TIER 2 (IMPORTANT) with FULL CONTENT (not summary), even if they match repository_structure patterns. This ensures critical files like POManager are always fully loaded.",
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
    "description": "File extension mappings used by RepoAnalyzer to determine default file extensions and by CodeGenerator to identify and validate test files vs other file types",
    "typescript": [".ts"],
    "test_files": [".spec.ts", ".test.ts"],
    "data": [".json", ".ts"]
  },

  "file_naming_patterns": {
    "description": "File naming conventions with example filenames that AI uses to find similar files in the repository and read their actual code to learn the coding patterns. The 'examples' arrays are critical - prompt builder searches for these exact filenames in the repo to extract real code examples for AI learning",
    "page_objects": {
      "suffix": "Page",
      "pattern": "*Page.ts",
      "examples": ["HomePage.ts", "CartPage.ts", "ProductDetailPage.ts"]
    },
    "test_files": {
      "suffix": ".spec.ts",
      "pattern": "*.spec.ts",
      "examples": [ "cart_validation.spec.ts"]
    },
    "components": {
      "suffix": "",
      "pattern": "*Component.ts",
      "examples": ["NavigationComponent.ts", "HeaderComponent.ts", "FooterComponent.ts"]
    },
    "helpers": {
      "suffix": "Actions",
      "pattern": "*Actions.ts",
      "examples": ["TestHelpers.ts", "TestSetupHelpers.ts"]
    }
  },

  "syntax_patterns": {
    "description": "Language and framework-specific syntax patterns for parsing existing code and generating new code. Each pattern has 'template' (string template for AI code generation) and 'regex' (regular expression for parsing existing repository code). Used by RepoAnalyzer to parse methods/locators/imports from existing code, and by prompt builder to teach AI the correct syntax for this framework",
    "class_declaration": {
      "template": "export class {ClassName}",
      "regex": "export\\s+class\\s+(\\w+)"
    },
    "constructor": {
      "template": "constructor(page: Page)",
      "regex": "constructor\\s*\\(\\s*page\\s*:\\s*Page\\s*\\)"
    },
    "import_statement": {
      "template": "import { {symbols} } from '{path}'",
      "regex": "^import\\s+.+$"
    },
    "locator_property": {
      "template": "readonly {propertyName}: Locator",
      "regex": "(?:private\\s+)?(?:readonly\\s+)?(\\w+)\\s*:\\s*Locator"
    },
    "method_async": {
      "template": "async {methodName}({params}): Promise<{ReturnType}>",
      "regex": "async\\s+(\\w+)\\s*\\(([^)]*)\\)(?:\\s*:\\s*Promise<([^>]+)>)?\\s*\\{"
    },
    "method_regular": {
      "template": "{methodName}({params}): {ReturnType}",
      "regex": "(?<!async\\s)(\\w+)\\s*\\(([^)]*)\\)(?:\\s*:\\s*([^{]+?))?\\s*\\{"
    },
    "locator_init_locator": {
      "template": "this.{name} = page.locator('{selector}')",
      "regex": "this\\.(\\w+)\\s*=\\s*(?:this\\.)?page\\.locator\\s*\\(([^)]+)\\)"
    },
    "locator_init_getByRole": {
      "template": "this.{name} = page.getByRole('{role}', { name: '{name}' })",
      "regex": "this\\.(\\w+)\\s*=\\s*(?:this\\.)?page\\.getByRole\\s*\\(([^)]+)\\)"
    },
    "locator_init_getByText": {
      "template": "this.{name} = page.getByText('{text}')",
      "regex": "this\\.(\\w+)\\s*=\\s*(?:this\\.)?page\\.getByText\\s*\\(([^)]+)\\)"
    },
    "locator_init_getByTestId": {
      "template": "this.{name} = page.getByTestId('{testId}')",
      "regex": "this\\.(\\w+)\\s*=\\s*(?:this\\.)?page\\.getByTestId\\s*\\(([^)]+)\\)"
    },
    "locator_init_getByLabel": {
      "template": "this.{name} = page.getByLabel('{label}')",
      "regex": "this\\.(\\w+)\\s*=\\s*(?:this\\.)?page\\.getByLabel\\s*\\(([^)]+)\\)"
    },
    "locator_init_getByPlaceholder": {
      "template": "this.{name} = page.getByPlaceholder('{placeholder}')",
      "regex": "this\\.(\\w+)\\s*=\\s*(?:this\\.)?page\\.getByPlaceholder\\s*\\(([^)]+)\\)"
    },
    "test_patterns": {
      "test_describe": {
        "template": "test.describe('{description}', () => { })",
        "regex": "test\\.describe\\s*\\(\\s*['\"]([^'\"]+)['\"]"
      },
      "test_case": {
        "template": "test('{description}', async ({ page }) => { })",
        "regex": "test\\s*\\(\\s*['\"]([^'\"]+)['\"]"
      },
      "test_beforeEach": {
        "template": "test.beforeEach(async ({ page }) => { })",
        "regex": "test\\.beforeEach\\s*\\("
      }
    },
    "assertion_patterns": {
      "toBeVisible": "await expect({locator}).toBeVisible()",
      "toHaveText": "await expect({locator}).toHaveText('{text}')",
      "toContainText": "await expect({locator}).toContainText('{text}')"
    },
    "action_patterns": {
      "click": "await {locator}.click()",
      "fill": "await {locator}.fill('{value}')",
      "goto": "await this.page.goto('{url}')"
    }
  },


  "test_runner": {
    "description": "Test execution configuration. Used by test_runner.py to build install and test commands. Test result parsing is handled by parse_test_results() method in code",
    "install_command": "npm install",
    "command_template": "npx playwright test {filter} --workers=1 --project=TestOnChrome",
    "filter_strategies": {
      "by_tag": "--grep @{tag}",
      "by_file": "{test_file_path}",
      "by_name": "--grep \"{test_name}\""
    },
    "lint": {
      "description": "Code quality lint configuration. When enabled, AI Agent runs lint:fix in two places: (1) Step 6.5 after generating code and before running tests, (2) Step 8.5 after re-generating code in retry loop. Requires 'lint' and 'lint:fix' scripts in package.json",
      "enabled": true,
      "install_command": "npm install",
      "check_command": "npm run lint",
      "fix_command": "echo \"hello\""
    }
  },

  "customization_guide": {
    "description": "Guide for customizing this configuration",
    "override_priority": "CONVENTIONS.md 'Project Configuration For AI Analysis' section > This config",
    "notes": [
      "All paths are relative to repository root",
      "User can add subdirectories in CONVENTIONS.md 'Project Configuration For AI Analysis' section",
      "User can add more architectural files in CONVENTIONS.md 'Project Configuration For AI Analysis' section",
      "'possible_paths' are searched sequentially until file found",
      "Supports glob patterns: *.ts, **/*.ts",
      "FileManager Tier Classification: FILES TO UPDATE (CRITICAL - full content) > architectural_files (IMPORTANT - full content) > repository_structure patterns (CONTEXT - smart summary) > others (REFERENCE - metadata only)"
    ]
  }
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
  - `test_runner.lint` - Enable/disable lint, customize lint commands
  - `code_style_conventions` - Code style (indentation, quotes, etc.)
  - `syntax_patterns` - Language-specific syntax (if needed)

**Example: Disable lint for this repo**
```json
{
  "test_runner": {
    "lint": {
      "enabled": false
    }
  }
}
```

**Merge Priority:**
```
Section 12 (this file) > Framework Config > Defaults
```

**Notes:**
- All paths are relative to repository root
- AI Agent reads Sections 1-11 for detailed conventions
- AI Agent reads Section 12 for repo-specific structure
- Update this section when repository structure changes
