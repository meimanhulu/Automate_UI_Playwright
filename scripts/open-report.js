/**
 * @file open-report.js
 * @description Jalankan HTTP server lokal untuk HTML report, bisa diakses
 *              dari komputer lain di jaringan yang sama (LAN/WiFi).
 *
 * Cara pakai:
 *   npm run serve-report           → server run terbaru
 *   npm run serve-report -- --run run_20260616_201305  → run tertentu
 *
 * Akses:
 *   - Lokal     : http://localhost:9323
 *   - LAN/WiFi  : http://<IP-komputer-kamu>:9323
 */

const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const os    = require('os');

const ROOT         = path.join(__dirname, '..');
const RESULTS_DIR  = path.join(ROOT, 'results', 'reports');
const PORT         = 9323;

// ─── Parse args ───────────────────────────────────────────────────────────────
const args   = process.argv.slice(2);
const runArg = args.indexOf('--run');
let targetRun;

if (runArg !== -1 && args[runArg + 1]) {
  targetRun = args[runArg + 1];
} else {
  // Latest run
  const runs = fs.readdirSync(RESULTS_DIR)
    .filter((d) => d.startsWith('run_') && fs.statSync(path.join(RESULTS_DIR, d)).isDirectory())
    .sort()
    .reverse();
  if (!runs.length) {
    console.error('\n❌ Belum ada run tersimpan di results/reports/.');
    console.error('   Jalankan: npm run test:save\n');
    process.exit(1);
  }
  targetRun = runs[0];
}

const HTML_DIR = path.join(RESULTS_DIR, targetRun, 'html');
if (!fs.existsSync(HTML_DIR)) {
  console.error(`\n❌ Folder HTML tidak ditemukan: ${HTML_DIR}`);
  console.error('   Jalankan: npm run test:save\n');
  process.exit(1);
}

// ─── MIME types ───────────────────────────────────────────────────────────────
const MIME = {
  '.html' : 'text/html; charset=utf-8',
  '.js'   : 'application/javascript',
  '.css'  : 'text/css',
  '.json' : 'application/json',
  '.png'  : 'image/png',
  '.jpg'  : 'image/jpeg',
  '.webp' : 'image/webp',
  '.svg'  : 'image/svg+xml',
  '.ico'  : 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff' : 'font/woff',
};

// ─── Get LAN IP ───────────────────────────────────────────────────────────────
function getLanIp() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// ─── Server ───────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(HTML_DIR, urlPath);

  // Security: prevent path traversal
  if (!filePath.startsWith(HTML_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext      = path.extname(filePath).toLowerCase();
  const mimeType = MIME[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type'                : mimeType,
    'Access-Control-Allow-Origin' : '*',
    'Cache-Control'               : 'no-cache',
  });

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  const lanIp = getLanIp();
  const sep   = '═'.repeat(58);

  console.log(`\n${sep}`);
  console.log('  🌐  PLAYWRIGHT REPORT SERVER — AKTIF');
  console.log(sep);
  console.log(`  Run       : ${targetRun}`);
  console.log(`  Folder    : results/reports/${targetRun}/html/`);
  console.log(sep);
  console.log(`  🖥️  Lokal      : http://localhost:${PORT}`);
  console.log(`  📡 LAN/WiFi   : http://${lanIp}:${PORT}`);
  console.log(sep);
  console.log('  Bagikan URL LAN di atas ke orang lain');
  console.log('  yang terhubung ke WiFi/jaringan yang sama.');
  console.log(sep);
  console.log('  Tekan Ctrl+C untuk menghentikan server.\n');

  // Auto-open browser
  const { execSync } = require('child_process');
  try {
    execSync(`start http://localhost:${PORT}`, { stdio: 'ignore' });
  } catch {}
});
