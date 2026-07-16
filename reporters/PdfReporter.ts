/**
 * @file PdfReporter.ts
 * @description Custom Playwright Reporter — generates PDF Test Execution Summary.
 *
 * Output: reports/pdf/execution-summary-<timestamp>.pdf
 *
 * PDF contains:
 *  - Run metadata (application, environment, date, browser, totals, pass rate)
 *  - Per-module summary (pass/fail count)
 *  - Per-test-case detail (status, duration, project)
 *
 * Register in playwright.config.ts:
 *   reporter: [['./reporters/PdfReporter.ts'], ...]
 *
 * Implements Playwright's official Reporter interface.
 * No extra browser required — uses pdfkit (pure Node.js).
 */

import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';

import PDFDocument from 'pdfkit';
import fs          from 'fs';
import path        from 'path';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TestEntry {
  title:     string;
  fullTitle: string;
  status:    string;
  duration:  number;
  module:    string;
  project:   string;
  error?:    string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const MARGIN   = 50;
const COL1     = MARGIN;
const COL2     = 200;
const PAGE_W   = 595;       // A4 width in points
const SAFE_W   = PAGE_W - MARGIN * 2;
const GREY     = '#888888';
const RED      = '#CC0000';
const GREEN    = '#007700';
const BLACK    = '#000000';

// ─── Reporter ─────────────────────────────────────────────────────────────────

export default class PdfReporter implements Reporter {
  private entries:   TestEntry[] = [];
  private startTime: number      = Date.now();

  onBegin(_config: FullConfig, _suite: Suite): void {
    this.startTime = Date.now();
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const titlePath = test.titlePath();
    this.entries.push({
      title:     test.title,
      fullTitle: titlePath.filter(Boolean).join(' › '),
      status:    result.status,
      duration:  result.duration,
      module:    titlePath[1] ?? 'General',
      project:   test.parent?.project()?.name ?? 'unknown',
      error:     result.error?.message?.split('\n')[0] ?? undefined,
    });
  }

  async onEnd(_result: FullResult): Promise<void> {
    const pdfDir = path.resolve('reports', 'pdf');
    fs.mkdirSync(pdfDir, { recursive: true });

    const ts      = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const outFile = path.join(pdfDir, `execution-summary-${ts}.pdf`);

    const doc = new PDFDocument({ margin: MARGIN, size: 'A4', autoFirstPage: true });
    const out = fs.createWriteStream(outFile);
    doc.pipe(out);

    // ── Statistics ──────────────────────────────────────────────────────────
    const total    = this.entries.length;
    const passed   = this.entries.filter(e => e.status === 'passed').length;
    const failed   = this.entries.filter(e => e.status === 'failed').length;
    const skipped  = this.entries.filter(e => e.status === 'skipped' || e.status === 'pending').length;
    const passRate = total > 0 ? `${((passed / total) * 100).toFixed(1)}%` : 'N/A';
    const durSec   = ((Date.now() - this.startTime) / 1000).toFixed(1);
    const runDate  = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const browser  = this.entries[0]?.project ?? 'Chromium';
    const env      = process.env.APP_ENV ?? process.env.NODE_ENV ?? 'Staging';

    // ── COVER ───────────────────────────────────────────────────────────────
    doc
      .fontSize(22).font('Helvetica-Bold')
      .fillColor(BLACK)
      .text('Test Execution Summary', { align: 'center' });
    doc.moveDown(0.4);
    doc
      .fontSize(11).font('Helvetica')
      .fillColor(GREY)
      .text('Payment Gateway — Playwright Automation Framework', { align: 'center' });
    doc.moveDown(2);

    // ── SUMMARY TABLE ───────────────────────────────────────────────────────
    this._sectionTitle(doc, 'Execution Summary');

    const summaryRows: [string, string][] = [
      ['Application',         'Payment Gateway'],
      ['Environment',         env],
      ['Execution Date',      runDate],
      ['Browser',             browser],
      ['Total Tests',         String(total)],
      ['Passed',              `${passed}  (${passRate})`],
      ['Failed',              String(failed)],
      ['Skipped',             String(skipped)],
      ['Pass Rate',           passRate],
      ['Execution Duration',  `${durSec} s`],
    ];

    for (const [label, value] of summaryRows) {
      const y = doc.y;
      doc.font('Helvetica-Bold').fontSize(10).fillColor(BLACK).text(`${label}:`, COL1, y, { width: 140 });
      const color = label === 'Failed' && failed > 0 ? RED
                  : label === 'Passed' ? GREEN
                  : BLACK;
      doc.font('Helvetica').fontSize(10).fillColor(color).text(value, COL2, y, { width: SAFE_W - 140 });
    }

    doc.moveDown(2);

    // ── MODULE SUMMARY ──────────────────────────────────────────────────────
    const modules = new Map<string, TestEntry[]>();
    for (const e of this.entries) {
      if (!modules.has(e.module)) modules.set(e.module, []);
      modules.get(e.module)!.push(e);
    }

    this._sectionTitle(doc, 'Results by Module');

    for (const [moduleName, tests] of modules) {
      const mp = tests.filter(t => t.status === 'passed').length;
      const mf = tests.filter(t => t.status === 'failed').length;

      doc.font('Helvetica-Bold').fontSize(11).fillColor(BLACK).text(moduleName, COL1);
      doc.font('Helvetica').fontSize(10)
        .fillColor(GREEN).text(`${mp} PASS`, COL1 + 12, doc.y, { continued: true, width: 80 })
        .fillColor(mf > 0 ? RED : GREY).text(`  ${mf} FAIL`, { continued: true })
        .fillColor(GREY).text(`  (${tests.length} total)`, { continued: false });
      doc.moveDown(0.6);
    }

    doc.moveDown(1.5);

    // ── PER-TC DETAIL ───────────────────────────────────────────────────────
    this._sectionTitle(doc, 'Test Case Details');

    for (const entry of this.entries) {
      if (doc.y > 720) doc.addPage();

      const icon  = entry.status === 'passed' ? '✓' : entry.status === 'failed' ? '✗' : '○';
      const color = entry.status === 'passed' ? GREEN : entry.status === 'failed' ? RED : GREY;
      const dur   = `${(entry.duration / 1000).toFixed(1)}s`;

      // Separator line
      doc.moveTo(COL1, doc.y).lineTo(PAGE_W - MARGIN, doc.y).strokeColor('#DDDDDD').lineWidth(0.5).stroke();
      doc.moveDown(0.3);

      // Test title + status badge
      const y = doc.y;
      doc.font('Helvetica-Bold').fontSize(10).fillColor(color).text(`${icon}`, COL1, y, { width: 15 });
      doc.font('Helvetica-Bold').fontSize(10).fillColor(BLACK).text(entry.title, COL1 + 18, y, { width: SAFE_W - 80 });

      // Status + duration + project
      doc.font('Helvetica').fontSize(9).fillColor(GREY)
        .text(`${entry.status.toUpperCase()}  ·  ${dur}  ·  ${entry.project}`, COL1 + 18);

      // Error message (if failed)
      if (entry.error) {
        doc.font('Helvetica').fontSize(8).fillColor(RED)
          .text(`↳ ${entry.error}`, COL1 + 18, doc.y, { width: SAFE_W - 20 });
      }

      doc.moveDown(0.7);
    }

    // ── FOOTER ──────────────────────────────────────────────────────────────
    doc.moveDown(2);
    doc
      .fontSize(8).font('Helvetica').fillColor(GREY)
      .text(`Generated by Playwright Automation Framework  ·  ${new Date().toISOString()}`, {
        align: 'center',
        width: SAFE_W,
      });

    doc.end();

    // Wait for stream to flush
    await new Promise<void>((resolve, reject) => {
      out.on('finish', resolve);
      out.on('error',  reject);
    });
  }

  /** Prints nothing to stdio — PDF reporter is silent */
  printsToStdio(): boolean { return false; }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  private _sectionTitle(doc: InstanceType<typeof PDFDocument>, title: string): void {
    doc.font('Helvetica-Bold').fontSize(13).fillColor(BLACK).text(title, COL1);
    doc.moveDown(0.2);
    doc.moveTo(COL1, doc.y).lineTo(PAGE_W - MARGIN, doc.y).strokeColor('#333333').lineWidth(0.75).stroke();
    doc.moveDown(0.6);
  }
}
