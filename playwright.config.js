// @ts-check
import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: isCI ? 6 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */

  // Timeouts globaux
  timeout: isCI ? 120_000 : 30_000,
  expect: { timeout: 10_000 },

  // Rapport détaillé
  reporter: isCI
    ? [
        ["github"],
        ["html", { open: "never", outputFolder: "playwright-report" }],
        ["junit", { outputFile: "test-results/junit.xml" }],
      ]
    : [
        ["html", { open: "on-failure", outputFolder: "playwright-report" }],
    ],
      
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */,
  use: {
    // ✅ URL cible (injectée depuis le workflow), fallback vers prod
    baseURL: process.env.BASE_URL || "https://bugcorp.vercel.app",

    // CI = headless
    headless: true,

    // Pour réduire les faux rouges réseau/chargements
    navigationTimeout: 30_000,
    actionTimeout: 10_000,

    // Artifacts de debug
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
