/**
 * @file MetricsReporter.ts
 * @description Playwright Reporter — emits a consolidated metrics.json for
 * dashboards (Grafana / ELK / internal), plus an append-only history file
 * for trend analysis.
 *
 * Output:
 *   metrics/metrics.json        ← latest run (single object)
 *   metrics/metrics-history.json ← array of all runs (trend)
 *
 * No test scenario is modified — this runs purely at the framework layer.
 *
 * Register in playwright.config.ts:
 *   reporter: [['./reporters/MetricsReporter.ts'], ...]
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
import crypto from 'crypto';

interface MetricsRow {
  executionTime: number;
  passed:        number;
  failed:        number;
  skipped:       number;
  total:         number;
  passRate:      number;
  browser:       string;
  environment:   string;
  build:         string;
  executionId:   string;
  timestamp:     string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function env(name: string, fallback = ''): string {
  return (process.env[name] ?? fallback).trim();
}

function resolveBrowser(entries: { project: string }[]): string {
  const first = entries[0]?.project ?? '';
  if (/firefox/i.test(first))  return 'Firefox';
  if (/webkit|safari/i.test(first)) return 'WebKit';
  if (/edge/i.test(first))     return 'Edge';
  if (/chromium|chrome/i.test(first)) return 'Chromium';
  return first || 'Chromium';
}

// ─── Reporter ───────────────────────────────────────────────────────────────────

export default class MetricsReporter implements Reporter {
  private startTime = Date.now();
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private total = 0;
  private projects = new Set<string>();

  onBegin(_config: FullConfig, _suite: Suite): void {
    this.startTime = Date.now();
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.total += 1;
    this.projects.add(test.parent?.project()?.name ?? 'unknown');

    switch (result.status) {
      case 'passed':  this.passed += 1; break;
      case 'failed':  this.failed += 1; break;
      case 'skipped': this.skipped += 1; break;
      default:        break; // timedOut / interrupted count as neither
    }
  }

  async onEnd(_result: FullResult): Promise<void> {
    const executionTime = Math.round((Date.now() - this.startTime) / 1000);
    const passRate = this.total > 0
      ? Number(((this.passed / this.total) * 100).toFixed(1))
      : 0;

    const row: MetricsRow = {
      executionTime,
      passed:   this.passed,
      failed:   this.failed,
      skipped:  this.skipped,
      total:    this.total,
      passRate,
      browser:     resolveBrowser([...this.projects].map(p => ({ project: p }))),
      environment:  env('APP_ENV', env('NODE_ENV', 'UAT')),
      build:        env('BUILD', new Date().toISOString().slice(0, 10)),
      executionId:  env('EXECUTION_ID', crypto.randomUUID()),
      timestamp:    new Date().toISOString(),
    };

    const metricsDir = path.resolve('metrics');
    fs.mkdirSync(metricsDir, { recursive: true });

    // Latest run (overwritten each time)
    fs.writeFileSync(
      path.join(metricsDir, 'metrics.json'),
      JSON.stringify(row, null, 2),
      'utf-8',
    );

    // History (append-only for trend dashboards)
    const historyFile = path.join(metricsDir, 'metrics-history.json');
    let history: MetricsRow[] = [];
    try {
      history = JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
      if (!Array.isArray(history)) history = [];
    } catch {
      history = [];
    }
    history.push(row);
    // Keep last 200 runs to bound file growth
    if (history.length > 200) history = history.slice(-200);
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), 'utf-8');

    // Console echo (handy in CI logs)
    console.log(
      `[Metrics] passed=${row.passed} failed=${row.failed} ` +
      `skipped=${row.skipped} time=${row.executionTime}s ` +
      `env=${row.environment} build=${row.build}`,
    );
  }

  printsToStdio(): boolean { return true; }
}
