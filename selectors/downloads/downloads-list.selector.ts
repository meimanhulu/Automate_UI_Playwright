export const DownloadsListSelector = {
  
  // ── Page Heading ───────────────────────────────────────────────────────────
  pageHeading: '', // Validation UI sudah dialihkan ke URL & Tabel untuk menghindari isu Vue h1 ganda

  // ── Table / Data ───────────────────────────────────────────────────────────
  tableContainer: '.ant-table-wrapper, table',
  tableRow: 'table tbody > tr',
  
  // ── Columns (Untuk Verifikasi/Locating) ────────────────────────────────────
  colReportName: 'td:nth-child(1)',
  colStatus: '', // Diambil langsung via row.filter({ hasText: 'Ready' }) di Page Object
  colProgress: '', // Diambil via row filter di Page Object

  // Tombol aksi di ujung kanan baris
  btnDownloadFile: 'button[title="Download"], button:has(svg)', 
  
  // ── Search / Filter (opsional jika ada) ────────────────────────────────────
  btnRefresh: 'button[title="Refresh"], button:has(svg)', // Refresh list
  
} as const;
