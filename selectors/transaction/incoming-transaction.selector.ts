export const IncomingTransactionSelector = {

  // ── Page Heading ───────────────────────────────────────────────────────────
  pageHeading: '',

  // ── Table / Data ───────────────────────────────────────────────────────────
  tableContainer: '.ant-table-wrapper, table',
  tableRow: 'table tbody > tr',

  // ── Action Buttons ─────────────────────────────────────────────────────────

  // ── Actions / Header Buttons ──
  btnExportIcon: '', // Gunakan getByRole('button', { name: /export|download/i }) di Page Object
  
  // ── (New) Action Menu Items dari Dropdown Export ──
  // Sesuaikan selector berikut dengan struktur DOM aktual saat menu export terbuka
  menuExportThisPage: '',
  menuExportAllPage: '',
  toastExportStarted: '',

  // ── Recent Downloads Dropdown ──
  btnDownloadsIcon: '', // Gunakan getByRole di Page Object

  // Show all downloads
  showAllDownloads: '',

  // Filter button
  btnFilter: '#filter-btn',


  // ── Toast Notification ─────────────────────────────────────────────────────

  // ── Search / Filter ────────────────────────────────────────────────────────
  inputSearch: 'input[placeholder*="Search"]',
  filterStatus: '.ant-select-selection-item',
  filterDateStart: 'input[name="dateStart"]',
  filterDateEnd: 'input[name="dateEnd"]',
  btnApplyFilter: '',

  // ── Loading / Empty State ──────────────────────────────────────────────────
  loadingSpinner: '.loading-spinner',
  emptyState: '',

} as const;
