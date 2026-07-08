// selectors/merchant/payment-network-form.selector.ts
//
// 🔑 SELECTOR REFERENCE — Add Merchant Account / Payment Network Form
// Isi nilai selector sesuai DOM aktual aplikasi Poppay.
// Halaman ini muncul setelah merchant berhasil dibuat.
//
// Cara penggunaan:
//   import { PaymentNetworkFormSelector as S } from '../../selectors/merchant/payment-network-form.selector';

export const PaymentNetworkFormSelector = {

  // ── Page / Form Container ──────────────────────────────────────────────────
  /** Kontainer utama halaman "Add Merchant Account" */
  formContainer: '',                    // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Heading / judul form */
  formHeading: '',                      // contoh: 'h2:has-text("Add Merchant Account")'

  // ── Status ────────────────────────────────────────────────────────────────
  /** Dropdown / select Status untuk Merchant Account */
  selectStatus: '',                     // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Opsi status "Active" */
  optionStatusActive: '',               // contoh: 'option[value="active"]'

  /** Opsi status "Inactive" */
  optionStatusInactive: '',             // contoh: 'option[value="inactive"]'

  // ── Payment Network ────────────────────────────────────────────────────────
  /** Field / trigger dropdown Payment Network */
  selectPaymentNetwork: '',             // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Kontainer opsi Payment Network */
  dropdownPaymentNetworkList: '',       // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Setiap item opsi Payment Network */
  dropdownPaymentNetworkOption: '',     // contoh: '#id' atau '.class' atau '[name="..."]'

  // ── Payment Method ─────────────────────────────────────────────────────────
  /** Field / trigger dropdown Payment Method */
  selectPaymentMethod: '',              // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Kontainer opsi Payment Method */
  dropdownPaymentMethodList: '',        // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Setiap item opsi Payment Method */
  dropdownPaymentMethodOption: '',      // contoh: '#id' atau '.class' atau '[name="..."]'

  // ── Action Buttons ─────────────────────────────────────────────────────────
  /** Tombol "Save" untuk submit form Payment Network */
  btnSave: '',                          // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Tombol "Cancel" */
  btnCancel: '',                        // contoh: '#id' atau '.class' atau '[name="..."]'

  // ── Validation Messages ────────────────────────────────────────────────────
  /** Pesan validasi field Status (required) */
  validationStatus: '',                 // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Pesan validasi field Payment Network (required) */
  validationPaymentNetwork: '',         // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Pesan validasi field Payment Method (required) */
  validationPaymentMethod: '',          // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Alert error dari backend */
  alertError: '',                       // contoh: '[role="alert"].error'

} as const;
