/**
 * @file ScreenshotHelper.ts
 * @description Screenshot strategy for Playwright tests.
 *
 * Strategy:
 * - Capture screenshot ONLY on important business milestones (not after every expect).
 * - ALWAYS capture screenshot when a step fails (auto-called in catch blocks).
 *
 * Business milestone examples:
 *   Login Success | Transaction Loaded | Filter Applied | Export Started
 *   Downloads Opened | Report Ready | Download Completed
 *
 * This avoids screenshot noise in the report while keeping all critical evidence.
 *
 * Internally delegates to `attachScreenshot()` from test-helper.ts — no duplication.
 */

import { Page, TestInfo } from '@playwright/test';
import { attachScreenshot } from './test-helper';
import { logger } from './ExecutionLogger';

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Capture a screenshot at a business milestone and attach it to the HTML report.
 *
 * Use this sparingly — only for meaningful checkpoints that a developer or QA
 * would want to visually verify later.
 *
 * @param page     - Playwright Page object
 * @param testInfo - Playwright TestInfo (from test context)
 * @param label    - descriptive label shown in the report (e.g. "TC-INC-004_Export_Started")
 *
 * @example
 *   await milestone(page, testInfo, 'TC-INC-004_Export_Started');
 */
export async function milestone(
  page:     Page,
  testInfo: TestInfo,
  label:    string,
): Promise<void> {
  await attachScreenshot(page, testInfo, `📷 ${label}`);
  logger.info('Screenshot', label);
}

/**
 * Capture a screenshot when a test step FAILS, then re-throw the error.
 *
 * Usage pattern inside test.step() catch blocks:
 *
 * @example
 *   } catch (err) {
 *     await captureFailure(page, testInfo, 'TC-INC-004_Step3_FAILED', err);
 *   }
 */
export async function captureFailure(
  page:     Page,
  testInfo: TestInfo,
  label:    string,
  error:    unknown,
): Promise<never> {
  try {
    await attachScreenshot(page, testInfo, `❌ FAIL_${label}`);
    logger.fail(label, error instanceof Error ? error.message : String(error));
  } catch {
    // Screenshot itself failed — do not mask the original error
  }
  throw error;
}
