export const DownloadsListSelector = {

  // ───────────────────────────────────────────────────────────────
  // Page
  // ───────────────────────────────────────────────────────────────

  pageHeading:
    'h1.text-2xl.font-bold.text-light',

  tableContainer:
    '.ant-table-wrapper, table',

  tableRow:
    'table tbody > tr',

  // ───────────────────────────────────────────────────────────────
  // Table Columns
  // ───────────────────────────────────────────────────────────────

  colReportName:
    'td:nth-child(1)',

  colStatus:
    'td:nth-child(2)',

  colProgress:
    'td:nth-child(3)',

  // ───────────────────────────────────────────────────────────────
  // Actions
  // ───────────────────────────────────────────────────────────────

  btnDownloadFile:
    'span[role="presentation"].inline-flex',

  btnRefresh:
    'main.inline > a',

} as const;