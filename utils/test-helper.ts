/**
 * @file test-helper.ts
 * @description Shared helper utilities for Playwright tests.
 *
 * Contains:
 *  - generateMid()          — unique MID generator for merchant tests
 *  - attachTestMetadata()   — attaches TC ID, feature, priority as JSON attachment
 *  - attachScreenshot()     — attaches a full-page screenshot with label
 */

import { Page, TestInfo } from '@playwright/test';

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
 * Waits for page stability before capturing to ensure screenshots are clear
 * and show fully loaded/rendered content (not loading states or animations).
 *
 * Screenshots are attached inline in the HTML report for easy review.
 * This replaces manual `page.screenshot({ path: ... })` calls.
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
  // Wait for page to be stable before screenshot
  try {
    // Wait for network to be mostly idle (no more than 2 network connections for 500ms)
    await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {
      // Fallback: at least wait for DOM to be ready if networkidle times out
      return page.waitForLoadState('domcontentloaded', { timeout: 1000 });
    });
    
    // Additional delay to ensure:
    // - CSS animations/transitions complete
    // - Modals/toasts are fully visible
    // - Lazy-loaded images render
    // - Dynamic content settles
    await page.waitForTimeout(400);
    
  } catch {
    // If all waits fail, proceed anyway - don't block screenshot
    // Better to have a slightly blurry screenshot than no screenshot
  }
  
  const screenshotBytes = await page.screenshot({ fullPage: true });
  testInfo.attach(label, {
    contentType: 'image/png',
    body:        screenshotBytes,
  });
}
