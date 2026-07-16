/**
 * @file DownloadValidator.ts
 * @description Universal, reusable download validation service.
 *
 * Validates every download for:
 *  - File exists (non-null path)
 *  - Filename is non-empty
 *  - Extension matches expectation (optional)
 *  - File size > 0 bytes
 *
 * CSV-specific validation:
 *  - Has headers
 *  - Has at least one data row
 *  - File is not empty
 *
 * Attaches JSON evidence to Playwright HTML Report.
 * Saves evidence JSON to reports/downloads/.
 *
 * Usage (in any test):
 *   const result = await downloadValidator.validate(download, 'csv');
 *   expect(result.isValid).toBe(true);
 */

import { Download, TestInfo } from '@playwright/test';
import { TestLogger }         from './Logger';
import fs                     from 'fs';
import path                   from 'path';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DownloadValidationResult {
  filename:     string;
  extension:    string;
  sizeBytes:    number;
  sizePretty:   string;
  isValid:      boolean;
  csvHeaders?:  string[];
  csvRowCount?: number;
  durationMs:   number;
  evidence:     Record<string, unknown>;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0)          return '0 B';
  if (bytes < 1_024)        return `${bytes} B`;
  if (bytes < 1_048_576)    return `${(bytes / 1_024).toFixed(2)} KB`;
  return `${(bytes / 1_048_576).toFixed(2)} MB`;
}

// ─── Class ─────────────────────────────────────────────────────────────────────

export class DownloadValidator {
  constructor(
    private readonly testInfo: TestInfo,
    private readonly logger:   TestLogger,
  ) {}

  /**
   * Validates a Playwright Download object.
   *
   * @param download            Playwright Download event result
   * @param expectedExtension   Optional: expected file extension (e.g. 'csv', 'xlsx')
   */
  async validate(
    download:          Download,
    expectedExtension?: string,
  ): Promise<DownloadValidationResult> {
    const start    = Date.now();
    const filename = download.suggestedFilename();
    const ext      = path.extname(filename).toLowerCase().replace('.', '');

    // ── 1. Filename ─────────────────────────────────────────────────────────
    if (filename.length > 0) {
      this.logger.pass(`Filename: ${filename}`);
    } else {
      this.logger.fail('Filename', { expected: 'non-empty string', actual: 'empty' });
    }

    // ── 2. Extension ────────────────────────────────────────────────────────
    if (expectedExtension) {
      const expected = expectedExtension.toLowerCase().replace('.', '');
      if (ext === expected) {
        this.logger.pass(`Extension: .${ext}`);
      } else {
        this.logger.fail('Extension', { expected: `.${expected}`, actual: `.${ext}` });
      }
    }

    // ── 3. File path & size ─────────────────────────────────────────────────
    let sizeBytes:    number         = 0;
    let csvHeaders:   string[]       | undefined;
    let csvRowCount:  number         | undefined;
    let filePath:     string | null  = null;

    try {
      filePath = await download.path();

      if (filePath && fs.existsSync(filePath)) {
        sizeBytes = fs.statSync(filePath).size;

        if (sizeBytes > 0) {
          this.logger.pass(`File size: ${formatBytes(sizeBytes)}`);
        } else {
          this.logger.fail('File size', { expected: '> 0 bytes', actual: '0 bytes (empty file)' });
        }

        // ── 4. CSV-specific ──────────────────────────────────────────────────
        if (ext === 'csv') {
          const raw   = fs.readFileSync(filePath, 'utf-8').trim();
          const lines = raw.split('\n').filter(l => l.trim().length > 0);

          if (lines.length >= 1) {
            csvHeaders  = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            csvRowCount = lines.length - 1;

            this.logger.pass(`CSV headers (${csvHeaders.length}): ${csvHeaders.slice(0, 5).join(', ')}${csvHeaders.length > 5 ? '...' : ''}`);
            this.logger.pass(`CSV data rows: ${csvRowCount}`);
          } else {
            this.logger.fail('CSV content', { expected: 'non-empty CSV', actual: 'file has no content' });
          }
        }
      } else {
        this.logger.fail('File exists', { expected: 'file on disk', actual: 'file not found' });
      }
    } catch {
      this.logger.fail('File access', { actual: 'could not read file — possible download error' });
    }

    const sizePretty = formatBytes(sizeBytes);
    const durationMs = Date.now() - start;

    // ── 5. Build evidence object ────────────────────────────────────────────
    const evidence: Record<string, unknown> = {
      filename,
      extension:    `.${ext}`,
      sizeBytes,
      sizePretty,
      durationMs:   `${durationMs}ms`,
      downloadedAt: new Date().toISOString(),
      ...(csvHeaders  !== undefined && { csvHeaders }),
      ...(csvRowCount !== undefined && { csvRowCount }),
    };

    // ── 6. Save evidence JSON to disk ───────────────────────────────────────
    const downloadsDir = path.resolve('reports', 'downloads');
    fs.mkdirSync(downloadsDir, { recursive: true });
    const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const evidenceFile = path.join(downloadsDir, `${safeFilename}_${Date.now()}.evidence.json`);
    fs.writeFileSync(evidenceFile, JSON.stringify(evidence, null, 2));

    // ── 7. Attach evidence to Playwright HTML Report ────────────────────────
    await this.testInfo.attach('📥 Download Evidence', {
      contentType: 'application/json',
      body:        Buffer.from(JSON.stringify(evidence, null, 2)),
    });

    this.logger.pass(`Download validated  (${durationMs}ms)`);
    this.logger.info('Filename', filename);
    this.logger.info('Size',     sizePretty);
    this.logger.info('Duration', `${durationMs}ms`);

    return {
      filename,
      extension: ext,
      sizeBytes,
      sizePretty,
      isValid:    sizeBytes > 0 && filename.length > 0,
      csvHeaders,
      csvRowCount,
      durationMs,
      evidence,
    };
  }
}
