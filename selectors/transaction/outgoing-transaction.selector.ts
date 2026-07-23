export const OutgoingTransactionSelector = {

  // ── Page Heading ───────────────────────────────────────────────────────────
  pageHeading: '', // Gunakan getByRole('heading', { name: 'Outgoing Transaction' }) di Page Object

  // ── Table / Data ───────────────────────────────────────────────────────────
  tableContainer: '.ant-table-wrapper, table',
  tableRow: 'table tbody > tr',
  
  // ── Action Buttons ─────────────────────────────────────────────────────────
  btnExportIcon: '',
  menuExportThisPage: '', // Gunakan getByRole('menuitem', { name: 'Download This Page' }) di Page Object
  menuExportAllPage: '',  // Gunakan getByRole('menuitem', { name: 'Download All Page' }) di Page Object
  
  // ── Toast Notification ─────────────────────────────────────────────────────
  toastExportStarted: '', // Gunakan getByText di Page Object
  
  // ── Search / Filter ────────────────────────────────────────────────────────
  btnFilter: '#filter-btn',
  inputSearch: 'input[placeholder*="Search"]',
  filterStatus: '.ant-select-selection-item, select[name="status"]',
  filterDateStart: 'input[name="dateStart"]',
  filterDateEnd: 'input[name="dateEnd"]',
  btnApplyFilter: '', // Gunakan getByRole('button', { name: 'Apply' }) di Page Object

  // ── Loading / Empty State ──────────────────────────────────────────────────
  loadingSpinner: '.loading-spinner',
  emptyState: '', // Gunakan assertion visual row atau role di Page Object

} as const;
