export const MerchantListSelector = {

  // ── Page Heading ───────────────────────────────────────────────────────────
  /** Heading "Merchant" di atas halaman */
  pageHeading: 'h1:has-text("Merchant")',
  // ── Table / Data ───────────────────────────────────────────────────────────
  /** Kontainer tabel merchant */
  tableContainer: 'table',
  tableRow: 'table tbody > tr',                         // contoh: 'tbody tr'

  // Kolom header tabel (untuk verifikasi tampilan)
  /** Header kolom "NAME" */
  colHeaderName: '',                    // contoh: 'th:has-text("NAME")'
  /** Header kolom "AGGREGATOR" */
  colHeaderAggregator: '',              // contoh: 'th:has-text("AGGREGATOR")'
  /** Header kolom "STATUS" */
  colHeaderStatus: '',                  // contoh: 'th:has-text("STATUS")'
  /** Header kolom "DEFAULT FEE (%)" */
  colHeaderDefaultFee: '',              // contoh: 'th:has-text("DEFAULT FEE")'
  /** Header kolom "CREATED AT" */
  colHeaderCreatedAt: '',               // contoh: 'th:has-text("CREATED AT")'
  /** Header kolom "UPDATED AT" */
  colHeaderUpdatedAt: '',               // contoh: 'th:has-text("UPDATED AT")'
  /** Header kolom "ACTION" */
  colHeaderAction: '',                  // contoh: 'th:has-text("ACTION")'

  // Sel data dalam baris (gunakan .filter() pada tableRow di POM)
  /** Sel Nama Merchant dalam sebuah baris */
  cellMerchantName: '',                 // contoh: 'td:nth-child(1)'
  // atau   : 'td[data-col="name"]'
  /** Sel Aggregator dalam sebuah baris */
  cellAggregator: '',                   // contoh: 'td:nth-child(2)'
  /** Sel Status (badge "Active" / "Inactive") dalam sebuah baris */
  cellStatus: '',                       // contoh: 'td:nth-child(3)'
  /** Badge status "Active" (hijau) */
  badgeStatusActive: '',                // contoh: '.badge.active'
  /** Badge status "Inactive" */
  badgeStatusInactive: '',              // contoh: '.badge.inactive'
  /** Sel Default Fee (%) dalam sebuah baris */
  cellDefaultFee: '',                   // contoh: 'td:nth-child(4)'
  /** Sel Created At dalam sebuah baris */
  cellCreatedAt: '',                    // contoh: 'td:nth-child(5)'
  /** Sel Updated At dalam sebuah baris */
  cellUpdatedAt: '',                    // contoh: 'td:nth-child(6)'
  /** Tombol action (titik tiga / kebab menu) dalam sebuah baris */
  cellActionBtn: '',                    // contoh: 'td:nth-child(7) button'
  // atau   : 'td .action-btn'

  // ── Action Buttons (atas halaman) ──────────────────────────────────────────
  /** Tombol "Add Merchant" (orange) di atas tabel */
  btnAddMerchant: '',                   // contoh: 'button:has-text("Add Merchant")'
  // atau   : '/* GANTI DGN CSS/XPATH (FE tidak pakai test-id) */'

  /** Tombol export (icon di kanan atas) */
  btnExport: '',                        // contoh: 'button[title="Export"]'

  /** Tombol refresh (icon refresh di kanan atas) */
  btnRefresh: '',                       // contoh: 'button[title="Refresh"]'

  // ── Search / Filter ────────────────────────────────────────────────────────
  /** Input pencarian merchant */
  inputSearch: '',                      // contoh: 'input[placeholder*="Search"]'

  // ── Pagination ─────────────────────────────────────────────────────────────
  /** Dropdown jumlah item per halaman ("Display 5 ▼") */
  selectDisplayCount: '',               // contoh: 'select.page-size'

  /** Teks info pagination ("Showing 1 to 5 of 21 entries") */
  paginationInfo: '',                   // contoh: '.pagination-info'

  /** Tombol halaman berikutnya */
  btnNextPage: '',                      // contoh: 'button[aria-label="Next page"]'

  /** Tombol halaman sebelumnya */
  btnPrevPage: '',                      // contoh: 'button[aria-label="Previous page"]'

  // ── Loading / Empty State ──────────────────────────────────────────────────
  /** Skeleton / spinner loading data */
  loadingSpinner: '',                   // contoh: '.loading-spinner'

  /** Teks / komponen saat tidak ada data */
  emptyState: '',                       // contoh: 'td:has-text("No data")'

  // ── Toast / Notification ───────────────────────────────────────────────────
  /** Kontainer toast notifikasi (success / error) */
  toastContainer: '',                   // contoh: '[role="alert"]'

} as const;
