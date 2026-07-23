/**
 * @file test-helper.ts
 * @description Shared helper utilities for Playwright tests.
 *
 * Contains:
 *  - generateMid()          — unique MID generator for merchant tests
 *  - attachTestMetadata()   — attaches TC ID, feature, priority as JSON attachment
 *  - attachScreenshot()     — attaches a full-page screenshot with label (deprecated - use milestone)
 *  - milestone()            — strategic screenshot capture (Senior SDET standard)
 */

import { Page, TestInfo } from '@playwright/test';
import { milestone as captureCheckpoint } from './ScreenshotHelper';

// ─── MID Generator ────────────────────────────────────────────────────────────

/**
 * Generates a unique Merchant ID (MID) for test isolation.
 *
 * Format: "AUTO-" + timestamp (last 8 digits) + random 4-char suffix
 * Example: "AUTO-29154312-A3F1"
 *
 * Using a timestamp + random ensures uniqueness even when tests run in parallel.
 *
 * @param prefix - optional prefix (default: "AUTO")
 */
export function generateMid(prefix = 'AUTO'): string {
  const ts     = Date.now().toString().slice(-8);
  const rand   = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `${prefix}-${ts}-${rand}`;
}

// ─── Metadata Attachment ──────────────────────────────────────────────────────

export interface TestMetadata {
  tc_id:    string;
  feature:  string;
  priority: 'High' | 'Medium' | 'Low';
}

/**
 * Attaches test metadata (TC ID, feature, priority) to the Playwright test
 * report. Visible in the HTML report under "Attachments".
 *
 * Call this at the very top of each test body.
 *
 * @param testInfo - Playwright TestInfo object (from test context)
 * @param metadata - structured metadata to attach
 */
export async function attachTestMetadata(
  testInfo: TestInfo,
  metadata: TestMetadata,
): Promise<void> {
  testInfo.attach('test-metadata', {
    contentType: 'application/json',
    body:        Buffer.from(JSON.stringify(metadata, null, 2)),
  });
}

// ─── Screenshot Attachment ────────────────────────────────────────────────────

/**
 * Takes a full-page screenshot and attaches it to the Playwright test report.
 *
 * @deprecated Use milestone() from ScreenshotHelper instead for Senior SDET standards.
 * This function remains for backward compatibility but new tests should use milestone().
 *
 * @param page     - Playwright Page object
 * @param testInfo - Playwright TestInfo object (from test context)
 * @param label    - descriptive label shown in the report (e.g. "TC012_01_form_opened")
 */
export async function attachScreenshot(
  page:     Page,
  testInfo: TestInfo,
  label:    string,
): Promise<void> {
  const screenshot = await page.screenshot({ fullPage: false });
  await testInfo.attach(`📸 ${label}`, {
    body: screenshot,
    contentType: 'image/png',
  });
}

/**
 * Strategic screenshot capture following Senior SDET standards.
 * Use this for meaningful checkpoints only.
 *
 * @param page     - Playwright Page object
 * @param testInfo - Playwright TestInfo object (from test context)
 * @param label    - descriptive label (e.g. "TC012_01_login_success")
 */
export async function milestone(
  page:     Page,
  testInfo: TestInfo,
  label:    string,
): Promise<void> {
  await captureCheckpoint(page, testInfo, label);
}
