/**
 * @file ExecutionLogger.ts
 * @description Lightweight, timestamp-prefixed console logger for test execution.
 *
 * Design principles:
 * - Zero dependencies (no external packages)
 * - Human-readable output in terminal and CI logs
 * - Does NOT replace Playwright's built-in reporter — it supplements it
 * - Each log line is self-contained (easy to grep in CI output)
 *
 * Output format:
 *   [09:40:15] ✓ PASS  Open Incoming Transaction  (650 ms)
 *   [09:40:16] ✗ FAIL  Validate Report Ready  — Timeout 30000 ms
 *   [09:40:17] ◆ STEP  Validate Export Toast
 *   [09:40:17] ℹ INFO  Filename: INBOUND_Transaction_Report.csv
 */

// ─── Private Helpers ──────────────────────────────────────────────────────────

function timestamp(): string {
  return new Date().toLocaleTimeString('id-ID', { hour12: false });
}

function formatDuration(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms} ms`;
}

const SEPARATOR = '─'.repeat(44);

// ─── Public API ───────────────────────────────────────────────────────────────

export const logger = {
  /**
   * Log a PASS result with optional duration.
   * Call after a successful action or assertion.
   */
  pass(label: string, durationMs?: number): void {
    const dur = durationMs !== undefined ? `  (${formatDuration(durationMs)})` : '';
    console.log(`[${timestamp()}] \x1b[32m✓ PASS\x1b[0m  ${label}${dur}`);
  },

  /**
   * Log a FAIL result with reason and optional locator description.
   * Playwright will still throw the actual error — this is supplemental context.
   */
  fail(label: string, reason?: string, locator?: string): void {
    const reasonStr = reason ? `  — ${reason}` : '';
    const locStr    = locator ? `\n           Locator: ${locator}` : '';
    console.error(`[${timestamp()}] \x1b[31m✗ FAIL\x1b[0m  ${label}${reasonStr}${locStr}`);
  },

  /**
   * Log the START of a named test.step().
   * Call at the beginning of a step body for immediate visibility.
   */
  step(label: string): void {
    console.log(`[${timestamp()}] \x1b[36m◆ STEP\x1b[0m  ${label}`);
  },

  /**
   * Log supplemental information (e.g., filename, file size, URL).
   */
  info(label: string, value?: string | number): void {
    const val = value !== undefined ? `  →  ${value}` : '';
    console.log(`[${timestamp()}] \x1b[90mℹ INFO\x1b[0m  ${label}${val}`);
  },

  /**
   * Print a visual separator between steps in the log output.
   */
  separator(): void {
    console.log(`\x1b[90m${SEPARATOR}\x1b[0m`);
  },
};
