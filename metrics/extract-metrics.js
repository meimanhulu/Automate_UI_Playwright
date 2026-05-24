const fs = require('fs');
const path = require('path');

const TEST_RESULTS_FILE = path.join(__dirname, 'test-results.json');
const METRICS_HISTORY_FILE = path.join(__dirname, 'metrics-history.json');

// ==================== HELPER FUNCTIONS ====================

/**
 * Recursively process all test specs and suites to extract test data
 */
function processSpecs(specs, accumulator = { passed: 0, failed: 0, skipped: 0, flaky: 0, totalTime: 0 }) {
  specs.forEach((spec) => {
    // If this spec has nested suites, process them recursively
    if (spec.suites && spec.suites.length > 0) {
      processSpecs(spec.suites, accumulator);
    }

    // If this spec has tests, process them
    if (spec.tests && spec.tests.length > 0) {
      spec.tests.forEach((test) => {
        // Count test status
        if (test.status === 'passed') {
          accumulator.passed++;
        } else if (test.status === 'failed') {
          accumulator.failed++;
        } else if (test.status === 'skipped') {
          accumulator.skipped++;
        }

        // Check for flaky tests (test that passed but had retries or failures before passing)
        if (test.status === 'passed' && test.results && test.results.length > 1) {
          const hasFailure = test.results.some((result) => result.status === 'failed' || result.status === 'timedOut');
          if (hasFailure) {
            accumulator.flaky++;
          }
        }

        // Add test duration to total time (convert ms to minutes)
        if (test.results && test.results.length > 0) {
          test.results.forEach((result) => {
            if (result.duration) {
              accumulator.totalTime += result.duration;
            }
          });
        }
      });
    }
  });

  return accumulator;
}

/**
 * Calculate metrics from test results
 */
function calculateMetrics(testResults) {
  console.log('📊 Extracting metrics from test results...');

  // Process all specs recursively
  const stats = processSpecs(testResults.suites || []);

  const total = stats.passed + stats.failed + stats.skipped;
  const passRate = total > 0 ? ((stats.passed / total) * 100).toFixed(2) : 0;
  const executionTimeMin = (stats.totalTime / 1000 / 60).toFixed(2);
  const manualTimeEstimate = (total * 5).toFixed(2); // 5 min per test case
  const timeSaved = (manualTimeEstimate - executionTimeMin).toFixed(2);

  return {
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    totalTestCases: total,
    passed: stats.passed,
    failed: stats.failed,
    skipped: stats.skipped,
    flaky: stats.flaky,
    passRate: parseFloat(passRate),
    executionTimeMin: parseFloat(executionTimeMin),
    manualTimeEstimate: parseFloat(manualTimeEstimate),
    timeSaved: parseFloat(timeSaved),
  };
}

/**
 * Check thresholds and return status
 */
function checkThresholds(metrics) {
  const passRateStatus = metrics.passRate >= 90 ? '✅ PASS' : '❌ FAIL';
  const flakyStatus = metrics.flaky === 0 ? '✅ CLEAN' : '⚠️  WARNING';

  return {
    passRateStatus,
    flakyStatus,
  };
}

/**
 * Print formatted report to console
 */
function printReport(metrics, thresholds) {
  const separator = '='.repeat(50);
  const divider = '-'.repeat(50);

  console.log('\n' + separator);
  console.log('        PLAYWRIGHT QA METRICS REPORT');
  console.log(`        Date: ${metrics.date}`);
  console.log(separator);
  console.log(`Total Test Cases    : ${metrics.totalTestCases}`);
  console.log(`Passed              : ${metrics.passed}`);
  console.log(`Failed              : ${metrics.failed}`);
  console.log(`Skipped             : ${metrics.skipped}`);
  console.log(`Flaky               : ${metrics.flaky}`);
  console.log(divider);
  console.log(`Pass Rate           : ${metrics.passRate}%`);
  console.log(`Status              : ${thresholds.passRateStatus}`);
  console.log(divider);
  console.log(`Execution Time      : ${metrics.executionTimeMin} min`);
  console.log(`Manual Est. Time    : ${metrics.manualTimeEstimate} min`);
  console.log(`Time Saved          : ${metrics.timeSaved} min`);
  console.log(`Flaky Status        : ${thresholds.flakyStatus}`);
  console.log(separator + '\n');
}

/**
 * Save metrics to history file (append, not overwrite)
 */
function saveMetricsToHistory(metrics) {
  try {
    let history = [];

    // Read existing history if file exists
    if (fs.existsSync(METRICS_HISTORY_FILE)) {
      const existingData = fs.readFileSync(METRICS_HISTORY_FILE, 'utf-8');
      history = JSON.parse(existingData);
    }

    // Append new metrics
    history.push(metrics);

    // Write back to file
    fs.writeFileSync(METRICS_HISTORY_FILE, JSON.stringify(history, null, 2));
    console.log(`📁 Metrics saved to: ${METRICS_HISTORY_FILE}`);
  } catch (error) {
    console.error(`❌ Error saving metrics to history: ${error.message}`);
  }
}

/**
 * Main function
 */
function main() {
  console.log('\n🚀 Playwright QA Metrics Extractor\n');

  // Check if test results file exists
  if (!fs.existsSync(TEST_RESULTS_FILE)) {
    console.log(`⚠️  Test results file not found: ${TEST_RESULTS_FILE}`);
    console.log('💡 Tip: Run "npm test" first to generate test results');
    process.exit(1);
  }

  try {
    // Read test results
    console.log(`📖 Reading test results from: ${TEST_RESULTS_FILE}`);
    const rawData = fs.readFileSync(TEST_RESULTS_FILE, 'utf-8');
    const testResults = JSON.parse(rawData);

    // Calculate metrics
    const metrics = calculateMetrics(testResults);

    // Check thresholds
    const thresholds = checkThresholds(metrics);

    // Print report
    printReport(metrics, thresholds);

    // Save to history
    saveMetricsToHistory(metrics);

    console.log('✨ Metrics extraction complete!\n');
  } catch (error) {
    console.error(`❌ Error extracting metrics: ${error.message}`);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { calculateMetrics, checkThresholds, processSpecs };
