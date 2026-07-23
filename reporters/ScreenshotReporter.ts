/**
 * @file ScreenshotReporter.ts
 * @description Playwright Reporter — materializes the screenshots that tests
 * already attach (via milestone()/captureFailure()) into a clean, ordered
 * folder structure for human review and evidence archives:
 *
 *   reports/screenshots/PASS/<NN>_<TestTitle>_<Checkpoint>.png
 *   reports/screenshots/FAILED/<NN>_<TestTitle>_<Checkpoint>.png
 *
 * The sequential <NN> counter gives evidence a stable reading order
 * (01_Login.png, 02_ClickExport.png, ...). This runs purely at the
 * framework layer — NO test scenario or page object is modified.
 *
 * Attachments created with testInfo.attach(label, { body, contentType })
 * are physically stored by Playwright under
 * <outputDir>/<test>/attachments/*. This reporter copies them out and
 * renames them based on the attachment name (the label passed to
 * milestone/captureFailure).
 *
 * Register in playwright.config.ts:
 *   reporter: [['./reporters/ScreenshotReporter.ts'], ...]
 */

import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';

import fs   from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('reports', 'screenshots');

export default class ScreenshotReporter implements Reporter {
  // Sequential counter across the whole run (01, 02, 03, ...)
  private counter = 0;

  onBegin(_config: FullConfig, _suite: Suite): void {
    this.counter = 0;
    // Fresh start each run so old evidence doesn't pile up
    fs.rmSync(SCREENSHOT_DIR, { recursive: true, force: true });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const statusFolder = result.status === 'failed' ? 'FAILED'
                       : result.status === 'passed' ? 'PASS'
                       : 'OTHER';

    const targetDir = path.join(SCREENSHOT_DIR, statusFolder);
    fs.mkdirSync(targetDir, { recursive: true });

    const testSlug = slugify(test.title).slice(0, 60);

    for (const attachment of result.attachments) {
      if (attachment.contentType !== 'image/png' || !attachment.path) continue;

      this.counter += 1;
      const nn = String(this.counter).padStart(2, '0');

      // Derive a friendly checkpoint name from the attachment label
      const checkpoint = slugify(attachment.name).slice(0, 60);
      const outName = `${nn}_${testSlug}_${checkpoint}.png`;
      const outPath = path.join(targetDir, outName);

      try {
        fs.copyFileSync(attachment.path, outPath);
      } catch (err) {
        // Non-fatal: evidence copy failure must never break the run
        console.warn(`[ScreenshotReporter] failed to copy ${attachment.path}:`, err);
      }
    }
  }

  async onEnd(_result: FullResult): Promise<void> {
    console.log(`[Screenshots] written to ${SCREENSHOT_DIR}`);
  }

  printsToStdio(): boolean { return true; }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function slugify(input: string): string {
  return input
    .replace(/[^\w\s-]/g, '')   // drop emojis / symbols
    .replace(/\s+/g, '_')       // spaces → underscores
    .replace(/_+/g, '_')        // collapse repeats
    .replace(/^_|_$/g, '');
}
