/**
 * @file ValidationHelper.ts
 * @description Reusable assertion wrappers for Playwright tests.
 *
 * Design principles:
 * - Wraps Playwright's `expect()` — does NOT replace it.
 *   This means all Playwright retry logic and stacktrace are fully preserved.
 * - Logs PASS/FAIL with timestamps via ExecutionLogger.
 * - Each function is async and re-throws on failure so test.step() fails correctly.
 * - `validateDownload` captures filename, file size, and duration as report attachments.
 *
 * Usage:
 *   await validateVisible({ description: 'Export toast visible', locator: toast });
 *   const result = await validateDownload({ description: 'Download CSV', download, testInfo });
 */

import { Locator, Page, Download, TestInfo, expect } from '@playwright/test';
import { logger } from './ExecutionLogger';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ValidateVisibleOpts {
  description: string;
  locator:     Locator;
  timeout?:    number;    // default: 15_000 ms
}

export interface ValidateURLOpts {
  description: string;
  page:        Page;
  pattern:     RegExp;
  timeout?:    number;    // default: 15_000 ms
}

export interface ValidateTextOpts {
  description: string;
  locator:     Locator;
  pattern:     RegExp | string;
  timeout?:    number;
}

export interface ValidateDownloadOpts {
  description: string;
  download:    Download;
  testInfo:    TestInfo;
}

export interface DownloadResult {
  filename:   string;
  sizePretty: string;
  durationMs: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format bytes into a human-readable string (e.g. "1.03 KB").
 */
function formatBytes(bytes: number): string {
  if (bytes === 0)          return '0 B';
  if (bytes < 1024)         return `${bytes} B`;
  if (bytes < 1024 * 1024)  return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Assert that a locator is visible.
 * Wraps expect().toBeVisible() and logs PASS/FAIL.
 */
export async function validateVisible(opts: ValidateVisibleOpts): Promise<void> {
  const { description, locator, timeout = 15_000 } = opts;
  const start = Date.now();
  try {
    await expect(locator, description).toBeVisible({ timeout });
    logger.pass(description, Date.now() - start);
  } catch (err) {
    logger.fail(description, `Element not visible after ${timeout} ms`);
    throw err; // re-throw so test.step() marks the step as FAILED
  }
}

/**
 * Assert that the current page URL matches a pattern.
 */
export async function validateURL(opts: ValidateURLOpts): Promise<void> {
  const { description, page, pattern, timeout = 15_000 } = opts;
  const start = Date.now();
  try {
    await expect(page, description).toHaveURL(pattern, { timeout });
    logger.pass(description, Date.now() - start);
  } catch (err) {
    logger.fail(description, `URL did not match ${pattern} after ${timeout} ms`);
    throw err;
  }
}

/**
 * Assert that a locator contains text matching a pattern.
 */
export async function validateText(opts: ValidateTextOpts): Promise<void> {
  const { description, locator, pattern, timeout = 15_000 } = opts;
  const start = Date.now();
  try {
    await expect(locator, description).toContainText(
      typeof pattern === 'string' ? pattern : pattern,
      { timeout }
    );
    logger.pass(description, Date.now() - start);
  } catch (err) {
    logger.fail(description, `Text not found: ${pattern}`);
    throw err;
  }
}

/**
 * Validate a completed download and attach filename, size, and duration to the report.
 * Returns a DownloadResult for further assertions in the test.
 *
 * The download `saveAs` path is intentionally omitted — Playwright manages temp storage.
 *
 * @example
 *   const result = await validateDownload({ description: 'Download CSV', download, testInfo });
 *   expect(result.filename).toMatch(/\.csv$/i);
 */
export async function validateDownload(opts: ValidateDownloadOpts): Promise<DownloadResult> {
  const { description, download, testInfo } = opts;
  const start = Date.now();

  const filename = download.suggestedFilename();

  // Read file size via path (resolves after download completes)
  let sizePretty = 'unknown';
  try {
    const fs   = await import('fs');
    const path = await download.path();
    if (path) {
      const stat = fs.statSync(path);
      sizePretty = formatBytes(stat.size);
    }
  } catch {
    // Non-fatal — size is supplemental information
  }

  const durationMs = Date.now() - start;

  // Attach download metadata to the Playwright HTML Report
  testInfo.attach('📥 Download Info', {
    contentType: 'application/json',
    body: Buffer.from(
      JSON.stringify({ filename, size: sizePretty, durationMs: `${durationMs} ms` }, null, 2)
    ),
  });

  logger.pass(description, durationMs);
  logger.info('Filename', filename);
  logger.info('Size',     sizePretty);
  logger.info('Duration', `${durationMs} ms`);

  return { filename, sizePretty, durationMs };
}
