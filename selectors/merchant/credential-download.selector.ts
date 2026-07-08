export const CredentialDownloadSelector = {

  // ── Page Container ─────────────────────────────────────────────────────────
  /** Kontainer utama halaman "Download Credential" */
  pageContainer: '',                    // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Heading / judul halaman */
  pageHeading: '',                      // contoh: 'h2:has-text("Download Credential")'

  // ── Generate ───────────────────────────────────────────────────────────────
  /** Tombol "Generate" untuk membuat dokumen credential */
  btnGenerate: '',                      // contoh: '#id' atau '.class' atau '[name="..."]'

  // ── Credential Document Preview ────────────────────────────────────────────
  /** Area preview dokumen credential (setelah generate) */
  credentialPreview: '',                // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Konten / isi credential yang ditampilkan */
  credentialContent: '',                // contoh: '#id' atau '.class' atau '[name="..."]'

  // ── Download ───────────────────────────────────────────────────────────────
  /** Tombol "Download" credential */
  btnDownload: '',                      // contoh: '#id' atau '.class' atau '[name="..."]'

  // ── Confirmation Modal ─────────────────────────────────────────────────────
  /** Kontainer modal konfirmasi download */
  modalConfirmation: '',                // contoh: '#id' atau '.class' atau '[name="..."]'
  // atau   : '[role="dialog"]'

  /** Teks / pesan dalam modal konfirmasi */
  modalMessage: '',                     // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Tombol "Yes" dalam modal konfirmasi */
  btnModalYes: '',                      // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Tombol "No" / "Cancel" dalam modal konfirmasi */
  btnModalNo: '',                       // contoh: '#id' atau '.class' atau '[name="..."]'

  // ── Loading State ──────────────────────────────────────────────────────────
  /** Spinner / loading saat generate credential */
  loadingSpinner: '',                   // contoh: '#id' atau '.class' atau '[name="..."]'

  // ── Toast / Notification ───────────────────────────────────────────────────
  /** Toast sukses setelah download */
  toastSuccess: '',                     // contoh: '[role="alert"].success'

  /** Toast error */
  toastError: '',                       // contoh: '[role="alert"].error'

} as const;
