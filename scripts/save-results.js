/**
 * @file save-results.js
 * @description Post-run script — jalankan SETELAH `playwright test` selesai.
 *
 * Yang dilakukan script ini:
 *  1. Buat folder arsip: results/reports/run_YYYYMMDD_HHmmss/
 *  2. Copy playwright-report/ → results/reports/run_.../html/
 *  3. Copy test-results/ (screenshots/videos) → results/screenshots/ & results/videos/
 *  4. Copy metrics/test-results.json → results/reports/run_.../test-results.json
 *  5. Generate file .md lengkap → results/reports/run_.../report.md
 *  6. Update metrics/metrics-history.json (akumulasi tiap run)
 *
 * Cara pakai (otomatis via npm scripts):
 *   npm run test:save   → playwright test + save-results.js
 *   npm run save-only   → hanya save-results.js (jika sudah ada test-results.json)
 */

const fs   = require('fs');
const path = require('path');

// ─── Paths ────────────────────────────────────────────────────────────────────
const ROOT              = path.join(__dirname, '..');
const TEST_RESULTS_JSON = path.join(ROOT, 'metrics', 'test-results.json');
const PLAYWRIGHT_REPORT = path.join(ROOT, 'playwright-report');
const TEST_RESULTS_DIR  = path.join(ROOT, 'test-results');
const RESULTS_DIR       = path.join(ROOT, 'results');
const METRICS_HISTORY   = path.join(ROOT, 'metrics', 'metrics-history.json');

// ─── Timestamp ────────────────────────────────────────────────────────────────
function getTimestamp() {
  const now = new Date();
  // Adjust to WIB (UTC+7)
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${wib.getUTCFullYear()}${pad(wib.getUTCMonth() + 1)}${pad(wib.getUTCDate())}` +
    `_${pad(wib.getUTCHours())}${pad(wib.getUTCMinutes())}${pad(wib.getUTCSeconds())}`
  );
}

// ─── Copy directory recursively ───────────────────────────────────────────────
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ─── Copy files by extension from a dir (flat) ────────────────────────────────
function copyFilesByExt(srcDir, destDir, extensions) {
  if (!fs.existsSync(srcDir)) return 0;
  fs.mkdirSync(destDir, { recursive: true });
  let count = 0;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
        // Keep relative path under destDir to avoid name collisions
        const rel      = path.relative(srcDir, fullPath);
        const destPath = path.join(destDir, rel);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(fullPath, destPath);
        count++;
      }
    }
  }

  walk(srcDir);
  return count;
}

// ─── Parse test-results.json ──────────────────────────────────────────────────
function parseResults(jsonPath) {
  const raw  = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw);

  let passed = 0, failed = 0, skipped = 0, flaky = 0, totalDurationMs = 0;
  const testRows = [];   // { project, title, status, durationMs, invoice, iterations }
  const logLines = [];   // raw stdout lines for all tests

  function walkSuites(suites) {
    for (const suite of (suites || [])) {
      walkSuites(suite.suites);
      for (const spec of (suite.specs || [])) {
        for (const test of (spec.tests || [])) {
          const project = test.projectName ?? '–';
          const title   = spec.title;

          // Collect stdout log lines
          for (const result of (test.results || [])) {
            for (const out of (result.stdout || [])) {
              if (out.text) logLines.push(`[${project}] ${out.text.replace(/\n$/, '')}`);
            }
          }

          // Status
          const lastResult = test.results?.[test.results.length - 1];
          const status     = lastResult?.status ?? 'unknown';
          const duration   = lastResult?.duration ?? 0;

          if (status === 'passed')        passed++;
          else if (status === 'failed')   failed++;
          else if (status === 'skipped')  skipped++;

          // Flaky = passed but had earlier failures
          if (status === 'passed' && test.results?.length > 1) {
            const hadFailure = test.results.some(
              (r) => r.status === 'failed' || r.status === 'timedOut'
            );
            if (hadFailure) flaky++;
          }

          totalDurationMs += duration;

          // Extract invoice numbers & iteration count from stdout
          const allStdout = (test.results || [])
            .flatMap((r) => (r.stdout || []).map((o) => o.text ?? ''))
            .join('\n');

          const invoices = [...allStdout.matchAll(/invoice:\s*(\S+)/g)].map((m) => m[1]);
          const iterMatch = allStdout.match(/All (\d+) iterations completed/);
          const iterations = iterMatch ? parseInt(iterMatch[1]) : null;

          testRows.push({ project, title, status, durationMs: duration, invoices, iterations });
        }
      }
    }
  }

  walkSuites(data.suites);

  const total     = passed + failed + skipped;
  const passRate  = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';
  const execMin   = (totalDurationMs / 1000 / 60).toFixed(2);

  return { passed, failed, skipped, flaky, total, passRate, execMin, totalDurationMs, testRows, logLines };
}

// ─── Strip ANSI escape codes ──────────────────────────────────────────────────
function stripAnsi(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*m/g, '');
}

// ─── Generate Markdown report ─────────────────────────────────────────────────
function generateMarkdown(metrics, timestamp, runDir) {
  const {
    passed, failed, skipped, flaky, total, passRate, execMin,
    testRows, logLines,
  } = metrics;

  const overallStatus = failed === 0 ? '✅ PASSED' : '❌ FAILED';
  const passStatus    = parseFloat(passRate) >= 90 ? '✅ PASS' : '❌ FAIL';
  const flakyStatus   = flaky === 0 ? '✅ CLEAN' : '⚠️ WARNING';

  // Date display (from timestamp string YYYYMMDD_HHmmss)
  const y  = timestamp.slice(0, 4);
  const mo = timestamp.slice(4, 6);
  const d  = timestamp.slice(6, 8);
  const h  = timestamp.slice(9, 11);
  const mi = timestamp.slice(11, 13);
  const s  = timestamp.slice(13, 15);
  const dateDisplay = `${d}/${mo}/${y} ${h}:${mi}:${s} WIB`;

  // Relative path reference for HTML report
  const htmlReportPath = `./html/index.html`;

  // ── Status table ────────────────────────────────────────────────────────────
  const statusTableRows = testRows.map((row) => {
    const icon = row.status === 'passed' ? '✅' : row.status === 'failed' ? '❌' : '⏭️';
    const dur  = (row.durationMs / 1000).toFixed(2);
    const inv  = row.invoices.length > 0 ? row.invoices.join(', ') : '–';
    const iter = row.iterations != null ? `${row.iterations} iterasi` : '–';
    return `| ${icon} \`${row.project}\` | ${row.title} | ${row.status.toUpperCase()} | ${dur}s | ${iter} | ${inv} |`;
  }).join('\n');

  // ── Log lines ────────────────────────────────────────────────────────────────
  const cleanLogs = logLines.map((l) => stripAnsi(l)).join('\n');

  const md = `# 📊 QRIS Payment — Test Run Report

> **Run ID :** \`run_${timestamp}\`
> **Tanggal :** ${dateDisplay}
> **Status  :** ${overallStatus}

---

## 📈 Ringkasan Eksekusi

| Metrik | Nilai |
|--------|-------|
| Total Test | **${total}** |
| ✅ Passed | **${passed}** |
| ❌ Failed | **${failed}** |
| ⏭️ Skipped | **${skipped}** |
| ⚡ Flaky | **${flaky}** |
| Pass Rate | **${passRate}%** — ${passStatus} |
| Waktu Eksekusi | **${execMin} menit** |
| Flaky Status | ${flakyStatus} |

---

## 🧪 Hasil per Test / Browser

| Browser / Project | Test Case | Status | Durasi | Iterasi | Invoice(s) |
|-------------------|-----------|--------|--------|---------|------------|
${statusTableRows || '| – | – | – | – | – | – |'}

---

## 📁 File Arsip Run Ini

\`\`\`
run_${timestamp}/
├── report.md          ← file ini
├── test-results.json  ← raw JSON dari Playwright
└── html/              ← HTML report (buka index.html di browser)
    └── index.html
\`\`\`

- 🖼️ Screenshots tersimpan di : \`results/screenshots/\`
- 🎥 Videos tersimpan di      : \`results/videos/\`
- 📊 Metrics history          : \`metrics/metrics-history.json\`

---

## 📜 Terminal Logs (stdout)

\`\`\`
${cleanLogs || '(tidak ada log)'}
\`\`\`

---

*Report ini di-generate otomatis oleh \`scripts/save-results.js\` pada ${dateDisplay}.*
`;

  return md;
}

// ─── Update metrics history ────────────────────────────────────────────────────
function updateMetricsHistory(metrics, timestamp) {
  let history = [];
  if (fs.existsSync(METRICS_HISTORY)) {
    try { history = JSON.parse(fs.readFileSync(METRICS_HISTORY, 'utf-8')); } catch {}
  }

  const y  = timestamp.slice(0, 4);
  const mo = timestamp.slice(4, 6);
  const d  = timestamp.slice(6, 8);
  const dateStr = `${d}/${mo}/${y}`;

  history.push({
    runId        : `run_${timestamp}`,
    date         : dateStr,
    timestamp    : timestamp,
    totalTests   : metrics.total,
    passed       : metrics.passed,
    failed       : metrics.failed,
    skipped      : metrics.skipped,
    flaky        : metrics.flaky,
    passRate     : parseFloat(metrics.passRate),
    execMin      : parseFloat(metrics.execMin),
    reportPath   : `results/reports/run_${timestamp}/report.md`,
  });

  fs.writeFileSync(METRICS_HISTORY, JSON.stringify(history, null, 2));
  return history.length;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log('\n🚀 save-results.js — Menyimpan hasil test run...\n');

  // 1. Cek test-results.json ada
  if (!fs.existsSync(TEST_RESULTS_JSON)) {
    console.error(`❌ File tidak ditemukan: ${TEST_RESULTS_JSON}`);
    console.error('   Jalankan "npm test" atau "npx playwright test" terlebih dahulu.');
    process.exit(1);
  }

  const timestamp = getTimestamp();
  const runDir    = path.join(RESULTS_DIR, 'reports', `run_${timestamp}`);

  console.log(`📂 Membuat folder arsip: ${runDir}`);
  fs.mkdirSync(runDir, { recursive: true });

  // 2. Copy HTML report
  const htmlDest = path.join(runDir, 'html');
  if (fs.existsSync(PLAYWRIGHT_REPORT)) {
    console.log(`📋 Menyalin HTML report → ${htmlDest}`);
    copyDirSync(PLAYWRIGHT_REPORT, htmlDest);
  } else {
    console.log('⚠️  playwright-report/ tidak ditemukan, dilewati.');
  }

  // 3. Copy screenshots
  const screenshotCount = copyFilesByExt(
    TEST_RESULTS_DIR,
    path.join(RESULTS_DIR, 'screenshots', `run_${timestamp}`),
    ['.png', '.jpg', '.jpeg', '.webp']
  );
  console.log(`🖼️  Screenshots disalin: ${screenshotCount} file`);

  // 4. Copy videos
  const videoCount = copyFilesByExt(
    TEST_RESULTS_DIR,
    path.join(RESULTS_DIR, 'videos', `run_${timestamp}`),
    ['.webm', '.mp4']
  );
  console.log(`🎥 Videos disalin: ${videoCount} file`);

  // 5. Copy test-results.json ke arsip
  const jsonDest = path.join(runDir, 'test-results.json');
  fs.copyFileSync(TEST_RESULTS_JSON, jsonDest);
  console.log(`📄 test-results.json disalin ke arsip`);

  // 6. Parse & generate markdown
  console.log(`📊 Membaca dan menganalisa test-results.json...`);
  const metrics = parseResults(TEST_RESULTS_JSON);

  const md     = generateMarkdown(metrics, timestamp, runDir);
  const mdPath = path.join(runDir, 'report.md');
  fs.writeFileSync(mdPath, md, 'utf-8');
  console.log(`📝 Report .md dibuat: ${mdPath}`);

  // 7. Update history
  const totalRuns = updateMetricsHistory(metrics, timestamp);
  console.log(`📈 metrics-history.json diupdate (total runs: ${totalRuns})`);

  // 8. Summary
  const sep = '='.repeat(55);
  console.log(`\n${sep}`);
  console.log('  ✅ HASIL TERSIMPAN');
  console.log(sep);
  console.log(`  Run ID      : run_${timestamp}`);
  console.log(`  Passed      : ${metrics.passed} / ${metrics.total}`);
  console.log(`  Failed      : ${metrics.failed}`);
  console.log(`  Pass Rate   : ${metrics.passRate}%`);
  console.log(`  Eksekusi    : ${metrics.execMin} menit`);
  console.log(sep);
  console.log(`  📁 Arsip    : results/reports/run_${timestamp}/`);
  console.log(`  📝 Markdown : results/reports/run_${timestamp}/report.md`);
  console.log(`  🌐 HTML     : results/reports/run_${timestamp}/html/index.html`);
  console.log(`  📊 History  : metrics/metrics-history.json`);
  console.log(`${sep}\n`);
}

main();
