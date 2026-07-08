export const MerchantFormSelector = {

  // ── Page / Form Container ──────────────────────────────────────────────────
  /** Kontainer utama halaman "Add Merchant" */
  formContainer: '',                    // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Heading / judul form */
  formHeading: '',                      // contoh: 'h2:has-text("Add Merchant")'

  // ── Aggregator Code ────────────────────────────────────────────────────────
  /** Field / trigger dropdown Aggregator Code */
  inputAggregatorCode: '',              // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Kontainer dropdown opsi Aggregator */
  dropdownAggregatorList: '',           // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Setiap item opsi dalam dropdown Aggregator */
  dropdownAggregatorOption: '',         // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Input pencarian dalam dropdown Aggregator (jika ada search) */
  dropdownAggregatorSearch: '',         // contoh: 'input[placeholder*="Search aggregator"]'

  // ── Status ────────────────────────────────────────────────────────────────
  /** Dropdown / select Status merchant */
  selectStatus: '',                     // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Opsi status "Active" */
  optionStatusActive: '',               // contoh: 'option[value="active"]'

  /** Opsi status "Inactive" */
  optionStatusInactive: '',             // contoh: 'option[value="inactive"]'

  // ── Merchant Name ──────────────────────────────────────────────────────────
  /** Input Nama Merchant */
  inputMerchantName: '',                // contoh: '#id' atau '.class' atau '[name="..."]'
  // atau   : 'input[name="merchant_name"]'

  // ── Fee Merchant ───────────────────────────────────────────────────────────
  /** Input Fee Merchant */
  inputMerchantFee: '',                 // contoh: '#id' atau '.class' atau '[name="..."]'
  // atau   : 'input[name="merchant_fee"]'

  // ── Action Buttons ─────────────────────────────────────────────────────────
  /** Tombol "Save" untuk submit form merchant */
  btnSave: '',                          // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Tombol "Cancel" / kembali */
  btnCancel: '',                        // contoh: '#id' atau '.class' atau '[name="..."]'

  // ── Validation Messages ────────────────────────────────────────────────────
  /** Pesan validasi field Aggregator Code (required) */
  validationAggregatorCode: '',         // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Pesan validasi field Nama Merchant (required) */
  validationMerchantName: '',           // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Pesan validasi field Fee Merchant (required / format) */
  validationMerchantFee: '',            // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Pesan validasi field Status (required) */
  validationStatus: '',                 // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Alert error dari backend (duplicate, dsb.) */
  alertError: '',                       // contoh: '[role="alert"].error'

} as const;
