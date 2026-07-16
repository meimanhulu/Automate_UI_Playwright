/**
 * @file Logger.ts
 * @description Production-grade structured file logger using winston.
 *
 * Responsibilities:
 *  - Write structured logs to reports/logs/<date>/<test-name>.log
 *  - No console.log — all output goes to files only
 *  - Per-test scoped via factory function
 *  - Used automatically by the framework fixture for all tests
 *
 * Log format:
 *   [09:44:36.123] [PASS] Export Started toast must appear (81ms)
 *   [09:44:37.001] [STEP 3] Navigate to Show All Downloads
 *   [09:44:40.123] [FAIL] Report not Ready — Timeout 30000ms
 *      Expected: Visible
 *      Actual:   Hidden
 */

import winston   from 'winston';
import path      from 'path';
import fs        from 'fs';

// ─── Public Types ─────────────────────────────────────────────────────────────

export interface ExecutionMeta {
  tcId:        string;
  feature:     string;
  module:      string;
  scenario:    string;
  browser:     string;
  environment: string;
}

export interface FailDetails {
  expected?: string;
  actual?:   string;
  locator?:  string;
  timeout?:  number;
}

/** Per-test logger interface — injected via framework fixture. */
export interface TestLogger {
  executionStart(meta: ExecutionMeta): void;
  executionEnd(status: string, durationMs: number): void;
  step(stepNumber: number | string, label: string): void;
  pass(label: string, durationMs?: number): void;
  fail(label: string, details?: FailDetails): void;
  info(label: string, value?: string | number): void;
  separator(): void;
}

// ─── Internals ─────────────────────────────────────────────────────────────────

const SEPARATOR = '─'.repeat(60);

function nowStr(): string {
  const d = new Date();
  return [
    String(d.getHours()).padStart(2, '0'),
    String(d.getMinutes()).padStart(2, '0'),
    String(d.getSeconds()).padStart(2, '0'),
  ].join(':') + '.' + String(d.getMilliseconds()).padStart(3, '0');
}

function fmtDur(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a per-test structured logger that writes to:
 *   reports/logs/<YYYY-MM-DD>/<sanitized-test-title>.log
 *
 * Called automatically by the framework fixture for every test.
 */
export function createTestLogger(testTitle: string): TestLogger {
  const today  = new Date().toISOString().split('T')[0];
  const logDir = path.resolve('reports', 'logs', today);
  fs.mkdirSync(logDir, { recursive: true });

  // Sanitize test title → safe filename (max 120 chars)
  const safe    = testTitle.replace(/[^a-zA-Z0-9\-_ ]/g, '').replace(/\s+/g, '_').slice(0, 120);
  const logFile = path.join(logDir, `${safe}.log`);

  // Use simple printf format — no colorization in file logs
  const wl = winston.createLogger({
    level: 'debug',
    format: winston.format.printf(({ message }) => String(message)),
    transports: [
      new winston.transports.File({ filename: logFile, options: { flags: 'a' } }),
    ],
    exitOnError: false,
  });

  const w = (line: string) => wl.info(line);

  return {
    executionStart(meta: ExecutionMeta): void {
      w(SEPARATOR);
      w(`[${nowStr()}] EXECUTION STARTED`);
      w(`  Module:       ${meta.module}`);
      w(`  Scenario:     ${meta.scenario}`);
      w(`  Feature:      ${meta.feature}`);
      w(`  TC ID:        ${meta.tcId}`);
      w(`  Browser:      ${meta.browser}`);
      w(`  Environment:  ${meta.environment}`);
      w(SEPARATOR);
    },

    executionEnd(status: string, durationMs: number): void {
      const icon = status === 'passed' ? '✓' : status === 'failed' ? '✗' : '○';
      w(SEPARATOR);
      w(`[${nowStr()}] EXECUTION FINISHED  ${icon} ${status.toUpperCase()}  (${fmtDur(durationMs)})`);
      w(SEPARATOR);
      w('');
    },

    step(stepNumber: number | string, label: string): void {
      w(`[${nowStr()}] [STEP ${stepNumber}] ${label}`);
    },

    pass(label: string, durationMs?: number): void {
      const dur = durationMs !== undefined ? `  (${fmtDur(durationMs)})` : '';
      w(`[${nowStr()}] [PASS] ${label}${dur}`);
    },

    fail(label: string, details?: FailDetails): void {
      w(`[${nowStr()}] [FAIL] ${label}`);
      if (details?.expected) w(`         Expected: ${details.expected}`);
      if (details?.actual)   w(`         Actual:   ${details.actual}`);
      if (details?.locator)  w(`         Locator:  ${details.locator}`);
      if (details?.timeout)  w(`         Timeout:  ${details.timeout}ms`);
    },

    info(label: string, value?: string | number): void {
      const val = value !== undefined ? `  →  ${value}` : '';
      w(`[${nowStr()}] [INFO] ${label}${val}`);
    },

    separator(): void {
      w(SEPARATOR);
    },
  };
}
