/**
 * @file framework.fixture.ts
 * @description Universal Playwright framework fixture.
 *
 * This is the single integration point that makes ALL framework capabilities
 * automatic for every test that imports `test` from this file.
 *
 * Capabilities provided automatically (no test code required):
 *   1. _autoScreenshot  — captures screenshot on test FAILURE, attaches to report
 *   2. _executionLog    — logs execution start/end with full metadata for every test
 *
 * Capabilities available on request (destructure from test params):
 *   3. logger           — per-test structured file logger (TestLogger)
 *   4. downloadValidator — universal download validation (DownloadValidator)
 *
 * Usage in test files:
 *   import { test, expect } from '../../fixtures/framework.fixture';
 *
 *   test('TC-XXX', async ({ page, logger, downloadValidator }) => {
 *     logger.step(1, 'Open page');
 *     // logger and downloadValidator are per-test scoped
 *     // failure screenshot is automatic — no code needed
 *   });
 *
 * Composing with poppay-auth.fixture:
 *   import { test, expect } from '../../fixtures/poppay-framework.fixture';
 *   // (provides auto-login + all framework capabilities above)
 */

import { test as base, expect } from '@playwright/test';
import { createTestLogger, TestLogger } from '../utils/Logger';
import { DownloadValidator }             from '../utils/DownloadValidator';

// ─── Fixture Types ─────────────────────────────────────────────────────────────

export type FrameworkFixtures = {
  /** @private Auto-captures screenshot when test fails. Runs for every test. */
  _autoScreenshot:  void;
  /** @private Logs execution start/end metadata to file. Runs for every test. */
  _executionLog:    void;
  /** Per-test structured file logger. Destructure from test params to use. */
  logger:           TestLogger;
  /** Universal download validator with evidence attachment. */
  downloadValidator: DownloadValidator;
};

// ─── Framework Fixture Definition ─────────────────────────────────────────────

export const test = base.extend<FrameworkFixtures>({

  // ── Auto: Capture screenshot on test failure ─────────────────────────────
  // Runs automatically for every test — no import or call needed in test body.
  // Attaches as "❌ FAIL — <TestName>" to the Playwright HTML Report.
  _autoScreenshot: [async ({ page }, use, testInfo) => {
    await use();
    if (testInfo.status !== testInfo.expectedStatus) {
      try {
        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach(`❌ FAIL — ${testInfo.title}`, {
          body:        screenshot,
          contentType: 'image/png',
        });
      } catch {
        // page may be already closed — non-fatal, do not mask original error
      }
    }
  }, { auto: true, scope: 'test' }],

  // ── Logger: Per-test file logger (created for every test) ─────────────────
  // This is NOT auto — it's created lazily when requested.
  // However _executionLog (below) depends on it, which IS auto,
  // so a log file is always created for every test.
  logger: async ({}, use, testInfo) => {
    const logger = createTestLogger(testInfo.title);
    await use(logger);
  },

  // ── Auto: Log execution start/end for every test ─────────────────────────
  // Depends on logger (above) — this ensures logger is always initialized.
  _executionLog: [async ({ logger }, use, testInfo) => {
    // Resolve metadata from test annotations (set via attachTestMetadata)
    // Falls back to values derived from test title path
    const titlePath  = testInfo.titlePath;
    const tcId       = testInfo.title.match(/\[(TC-[^\]]+)\]/)?.[1] ?? testInfo.title;
    const module     = titlePath[1] ?? 'General';
    const feature    = titlePath[1] ?? 'Unknown';
    const scenario   = testInfo.title;
    const browser    = testInfo.project.name ?? 'chromium';
    const env        = process.env.APP_ENV ?? process.env.NODE_ENV ?? 'staging';

    logger.executionStart({ tcId, feature, module, scenario, browser, environment: env });

    await use();

    logger.executionEnd(testInfo.status ?? 'unknown', testInfo.duration ?? 0);
  }, { auto: true, scope: 'test' }],

  // ── DownloadValidator: Universal download evidence service ────────────────
  downloadValidator: async ({ logger }, use, testInfo) => {
    await use(new DownloadValidator(testInfo, logger));
  },
});

export { expect };
