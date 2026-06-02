import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',        // covers both ./e2e (via project override) and ./tests
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'metrics/test-results.json' }],
    ['list'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    // ── QRIS Payment — Default (Chrome) ────────────────────────────────
    // Run: npx playwright test --project=qris-payment
    {
      name: 'qris-payment',
      testDir: './tests',
      testMatch: '**/qris-payment.spec.ts',
      fullyParallel: false,
      workers: 1,
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        screenshot: 'on',
        video: 'retain-on-failure',
        actionTimeout: 15_000,
      },
      timeout: 240_000,
    },

    // ── QRIS Payment — Chrome ───────────────────────────────────────────
    // Run: npx playwright test --project=qris-payment-chrome
    {
      name: 'qris-payment-chrome',
      testDir: './tests',
      testMatch: '**/qris-payment.spec.ts',
      fullyParallel: false,
      workers: 1,
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        screenshot: 'on',
        video: 'retain-on-failure',
        actionTimeout: 15_000,
        // Disable background tab throttling so SDK polling works
        // even when another browser window is in the foreground.
        launchOptions: {
          args: [
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
          ],
        },
      },
      timeout: 240_000,
    },

    // ── QRIS Payment — Firefox ──────────────────────────────────────────
    // Run: npx playwright test --project=qris-payment-firefox
    {
      name: 'qris-payment-firefox',
      testDir: './tests',
      testMatch: '**/qris-payment.spec.ts',
      fullyParallel: false,
      workers: 1,
      use: {
        ...devices['Desktop Firefox'],
        headless: false,
        screenshot: 'on',
        video: 'retain-on-failure',
        actionTimeout: 15_000,
        // Disable Firefox background timer throttling via about:config prefs
        launchOptions: {
          firefoxUserPrefs: {
            'dom.min_background_timeout_value': 4,
            'dom.timeout.background_budget_regeneration_rate': 100,
            'dom.min_background_timeout_value_without_budget_throttling': 4,
          },
        },
      },
      timeout: 240_000,
    },

    // ── QRIS Payment — Microsoft Edge ───────────────────────────────────
    // Run: npx playwright test --project=qris-payment-edge
    {
      name: 'qris-payment-edge',
      testDir: './tests',
      testMatch: '**/qris-payment.spec.ts',
      fullyParallel: false,
      workers: 1,
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        headless: false,
        screenshot: 'on',
        video: 'retain-on-failure',
        actionTimeout: 15_000,
        // Disable background tab throttling — same flags as Chrome (Edge is Chromium-based)
        launchOptions: {
          args: [
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
          ],
        },
      },
      timeout: 240_000,
    },

    // ── QRIS Payment — WebKit (Safari engine) ───────────────────────────
    // Run: npx playwright test --project=qris-payment-webkit
    {
      name: 'qris-payment-webkit',
      testDir: './tests',
      testMatch: '**/qris-payment.spec.ts',
      fullyParallel: false,
      workers: 1,
      use: {
        ...devices['Desktop Safari'],
        headless: false,
        screenshot: 'on',
        video: 'retain-on-failure',
        actionTimeout: 15_000,
      },
      timeout: 240_000,
    },

    // ── Standard browser projects (existing e2e tests) ──────────────────
    {
      name: 'chromium',
      testDir: './e2e',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      testDir: './e2e',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      testDir: './e2e',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
