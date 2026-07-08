export const MerchantUserFormSelector = {

  // ── Page / Form Container ──────────────────────────────────────────────────
  /** Kontainer utama halaman "Add User" */
  formContainer: '',                    // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Heading / judul form */
  formHeading: '',                      // contoh: 'h2:has-text("Add User")'

  // ── Email ──────────────────────────────────────────────────────────────────
  /** Input Email pengguna */
  inputEmail: '',                       // contoh: '#id' atau '.class' atau '[name="..."]'
  // atau   : 'input[type="email"]'
  // atau   : 'input[name="email"]'

  // ── Role ───────────────────────────────────────────────────────────────────
  /** Dropdown / select Role */
  selectRole: '',                       // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Kontainer opsi Role */
  dropdownRoleList: '',                 // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Setiap item opsi Role */
  dropdownRoleOption: '',               // contoh: '#id' atau '.class' atau '[name="..."]'

  // ── Password ───────────────────────────────────────────────────────────────
  /** Input Password */
  inputPassword: '',                    // contoh: '#id' atau '.class' atau '[name="..."]'
  // atau   : 'input[name="password"]'

  /** Toggle show/hide password */
  btnTogglePasswordVisibility: '',      // contoh: '#id' atau '.class' atau '[name="..."]'

  // ── Confirm Password ───────────────────────────────────────────────────────
  /** Input Konfirmasi Password */
  inputConfirmPassword: '',             // contoh: '#id' atau '.class' atau '[name="..."]'
  // atau   : 'input[name="confirm_password"]'

  /** Toggle show/hide confirm password */
  btnToggleConfirmPasswordVisibility: '', // contoh: '#id' atau '.class' atau '[name="..."]'

  // ── Action Buttons ─────────────────────────────────────────────────────────
  /** Tombol "Save" untuk submit form User */
  btnSave: '',                          // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Tombol "Cancel" */
  btnCancel: '',                        // contoh: '#id' atau '.class' atau '[name="..."]'

  // ── Validation Messages ────────────────────────────────────────────────────
  /** Pesan validasi field Email (required / format) */
  validationEmail: '',                  // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Pesan validasi field Role (required) */
  validationRole: '',                   // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Pesan validasi field Password (required / min length) */
  validationPassword: '',               // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Pesan validasi field Konfirmasi Password (tidak cocok) */
  validationConfirmPassword: '',        // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Alert error dari backend (email duplikat, dsb.) */
  alertError: '',                       // contoh: '[role="alert"].error'

} as const;
