import type {
  FullConfig,
  FullResult,
  Reporter,
  TestCase,
  TestResult
} from '@playwright/test/reporter';

// Minimal custom reporter scaffold.
// You can later push metrics to Grafana/Loki/Prometheus in onEnd.
class GrafanaReporter implements Reporter {
  onBegin(config: FullConfig): void {
    // eslint-disable-next-line no-console
    console.log(`[grafana-reporter] starting: ${config.projects.length} project(s)`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    // eslint-disable-next-line no-console
    console.log(
      `[grafana-reporter] ${result.status.toUpperCase()} ${test.title} (${result.duration}ms)`
    );
  }

  onEnd(result: FullResult): void {
    // eslint-disable-next-line no-console
    console.log(`[grafana-reporter] finished: status=${result.status}`);
  }
}

export default GrafanaReporter;
