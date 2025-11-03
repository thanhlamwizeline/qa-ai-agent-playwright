import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  snapshotPathTemplate:
    "{testDir}/e2e/__screenshots__/{testFileName}/{arg}{ext}",
  fullyParallel: false,
  expect: {
    timeout: process.env.CI ? 20000 : 10000
  },
  timeout: process.env.CI ? 60000 : 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : 2,
  reporter: process.env.CI ? [
    ['html'],
    ['junit', { outputFile: `test-results/test-results-${new Date().toISOString().replace(/[:.]/g, '-')}.xml` }],
    ['dot']
  ] : [
    ['html'],
    ['junit', { outputFile: `test-results/test-results-${new Date().toISOString().replace(/[:.]/g, '-')}.xml` }],
    ['dot']
  ],
  use: {
    trace: "retain-on-failure",
    headless: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testDir: "./helpers",
      testMatch: "TestSetUpHelpers.ts",
    },
    /* Test against branded browsers. */
    {
      name: "TestOnChrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
      dependencies: ["setup"],
    },
    {
      name: "TestOnEdge",
      use: {
        ...devices["Desktop Edge"],
        viewport: { width: 1920, height: 1080 },
        channel: "msedge",
      },
      dependencies: ["setup"],
    },
    {
      name: "TestOnFirefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1920, height: 1080 },
      },
      dependencies: ["setup"],
    },

    /* Test against multi browsers - Searially by browsers */
    {
      name: "MultiBrowser_1",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
      dependencies: ["setup"],
    },
    {
      name: "MultiBrowser_2",
      use: {
        ...devices["Desktop Edge"],
        viewport: { width: 1920, height: 1080 },
        channel: "msedge",
      },
      dependencies: ["MultiBrowser_1"],
    },
    {
      name: "MultiBrowser",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1920, height: 1080 },
      },
      dependencies: ["MultiBrowser_2"],
    },
  ],
});
