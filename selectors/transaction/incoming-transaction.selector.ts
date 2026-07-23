export const IncomingTransactionSelector = {

  // ───────────────────────────────────────────────────────────────
  // Page Heading
  // ───────────────────────────────────────────────────────────────
  pageHeading: 'h1.text-2xl.font-bold.text-light',

  // ───────────────────────────────────────────────────────────────
  // Table
  // ───────────────────────────────────────────────────────────────
  tableContainer: '.ant-table-wrapper, table',
  tableRow: 'table tbody > tr',

  // ───────────────────────────────────────────────────────────────
  // Header Actions
  // ───────────────────────────────────────────────────────────────

  // Export icon
  btnExportIcon:
    'button.w-8.h-8.xl\\:w-10.xl\\:h-10.rounded-md svg.iconify--ph',

  // Export dropdown
  menuExportThisPage:
    'button:has-text("Download This Page")',

  menuExportAllPage:
    'button:has-text("Download All Page")',

  // Success Toast
  toastExportStarted:
    'article[role="alert"]',

  // Downloads icon (Topbar)
  btnDownloadsIcon:
    'button[title="Downloads"]',

  // Recent Downloads popup
  showAllDownloads:
    'button:has-text("Show all downloads")',

  // Filter
  btnFilter:
    '#filter-btn',

  // ───────────────────────────────────────────────────────────────
  // Search
  // ───────────────────────────────────────────────────────────────

  inputSearch:
    'input.flex-1[placeholder]',

  buttonSearchOptions:
    'input[id*="Search Options"]',

  fieldSearchByLabel:
    'input[placeholder="Search by label"]',

  trxIdButton:
    'a:has-text("TRX ID")',

  buttonRefresh:
    'main.inline > a',

  btnApplyFilter:
    'button:has-text("Apply")',

  // ───────────────────────────────────────────────────────────────
  // Loading
  // ───────────────────────────────────────────────────────────────

  loadingSpinner:
    '.loading-spinner',

  emptyState: '',

} as const;