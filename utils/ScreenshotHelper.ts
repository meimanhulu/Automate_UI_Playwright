/**
 * @file ScreenshotHelper.ts
 * @description Strategic screenshot capture for evidence and debugging.
 *
 * Senior SDET Standard:
 * Capture screenshots ONLY at meaningful checkpoints - not after every action.
 * Screenshots are evidence for stakeholders (dev, product, business, CTO).
 *
 * Checkpoints include:
 * - Login success
 * - Dashboard loaded
 * - Filter applied
 * - Export dialog opened
 * - Download completed
 * - Critical validation points
 *
 * Avoid excessive screenshots - they bloat reports and slow test execution.
 */

import { Page, TestInfo } from '@playwright/test';
import { TestLogger } from './Logger';

export interface ScreenshotOptions {
  fullPage?: boolean;
  timeout?: number;
  logger?: TestLogger;
}

/**
 * Captures a strategic checkpoint screenshot with automatic stabilization.
 * 
 * Best practices:
 * - Use descriptive labels: "01_login_success" not "screenshot1"
 * - Include test case ID if applicable: "TC001_02_dashboard_loaded"
 * - Use sequential numbering for readability: "01_", "02_", "03_"
 * 
 * @param page - Playwright Page object
 * @param testInfo - TestInfo for attaching to report
 * @param label - Descriptive label (visible in HTML report)
 * @param options - Optional screenshot configuration
 */
export async function milestone(
  page: Page,
  testInfo: TestInfo,
  label: string,
  options?: ScreenshotOptions
): Promise<void> {
  const { fullPage = true, timeout = 3000, logger } = options || {};

  try {
    await page.waitForLoadState('networkidle', { timeout }).catch(() => 
      page.waitForLoadState('domcontentloaded', { timeout: 1000 })
    );
    
    await page.waitForTimeout(400);
    
    const screenshotBytes = await page.screenshot({ fullPage });
    
    await testInfo.attach(label, {
      contentType: 'image/png',
      body: screenshotBytes,
    });

    logger?.info('Screenshot captured', label);
  } catch (error) {
    logger?.fail('Screenshot capture failed', { 
      actual: error instanceof Error ? error.message : 'unknown error' 
    });
  }
}

/**
 * Captures screenshot on failure - used by framework fixture automatically.
 * This is a fallback; explicit milestone() calls are preferred for strategic evidence.
 */
export async function captureFailure(
  page: Page,
  testInfo: TestInfo,
  testTitle: string
): Promise<void> {
  try {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach(`❌ FAIL — ${testTitle}`, {
      body: screenshot,
      contentType: 'image/png',
    });
  } catch {
    // Non-fatal - page may be closed
  }
}

/**
 * Captures multiple screenshots in sequence for multi-step validation.
 * Use sparingly - only when comparing before/after states is critical.
 * 
 * @example
 * await captureSequence(page, testInfo, [
 *   'TC005_01_filter_before',
 *   'TC005_02_filter_applied',
 *   'TC005_03_results_displayed'
 * ]);
 */
export async function captureSequence(
  page: Page,
  testInfo: TestInfo,
  labels: string[],
  options?: ScreenshotOptions
): Promise<void> {
  for (const label of labels) {
    await milestone(page, testInfo, label, options);
    await page.waitForTimeout(500);
  }
}
