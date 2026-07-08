/**
 * @file MerchantUserFormPage.ts
 * @description Page Object Model untuk halaman "Add User"
 *              dalam flow Create Merchant di Poppay.
 *
 * Flow yang dicakup (Phase 4 — Create User):
 *   Buka Halaman Add User
 *   → Isi Email → Pilih Role → Isi Password → Isi Konfirmasi Password
 *   → Klik Save → POST /api/users
 *   → Buka Halaman Download Credential
 *
 * Locator priority (COPILOT_INSTRUCTIONS.md):
 *   getByRole > getByLabel > getByTestId > CSS (last resort)
 *
 * ⚠️  Isi selector di:
 *       selectors/merchant/merchant-user-form.selector.ts
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { MerchantUserFormSelector as S } from '../../selectors/merchant/merchant-user-form.selector';

// ── Types ──────────────────────────────────────────────────────────────────────

/** Data yang dibutuhkan untuk mengisi form Add User */
export interface MerchantUserFormData {
  /** Email pengguna */
  email: string;
  /** Role pengguna (contoh: "Admin", "Operator") */
  role: string;
  /** Password */
  password: string;
  /** Konfirmasi password — harus sama dengan password */
  confirmPassword: string;
}

// ── Page Object ────────────────────────────────────────────────────────────────

export class MerchantUserFormPage extends BasePage {

  // ── Locators ───────────────────────────────────────────────────────────────

  /** Kontainer form Add User */
  readonly formContainer: Locator;

  /** Input Email */
  readonly inputEmail: Locator;

  /** Dropdown / select Role */
  readonly selectRole: Locator;

  /** Kontainer list opsi Role */
  readonly dropdownRoleList: Locator;

  /** Input Password */
  readonly inputPassword: Locator;

  /** Input Konfirmasi Password */
  readonly inputConfirmPassword: Locator;

  /** Tombol Save */
  readonly btnSave: Locator;

  /** Tombol Cancel */
  readonly btnCancel: Locator;

  /** Alert error dari backend */
  readonly alertError: Locator;

  // ── Constructor ────────────────────────────────────────────────────────────

  constructor(page: Page) {
    super(page);

    this.formContainer = S.formContainer
      ? page.locator(S.formContainer)
      : page.locator('form').filter({ hasText: /add user|tambah user/i });

    this.inputEmail = S.inputEmail
      ? page.locator(S.inputEmail)
      : page.getByLabel(/email/i);

    this.selectRole = S.selectRole
      ? page.locator(S.selectRole)
      : page.getByLabel(/role/i);

    this.dropdownRoleList = S.dropdownRoleList
      ? page.locator(S.dropdownRoleList)
      : page.locator('[role="listbox"], [role="menu"]').first();

    this.inputPassword = S.inputPassword
      ? page.locator(S.inputPassword)
      : page.getByLabel(/^password/i);

    this.inputConfirmPassword = S.inputConfirmPassword
      ? page.locator(S.inputConfirmPassword)
      : page.getByLabel(/confirm password|konfirmasi password/i);

    this.btnSave = S.btnSave
      ? page.locator(S.btnSave)
      : page.getByRole('button', { name: /save|simpan/i });

    this.btnCancel = S.btnCancel
      ? page.locator(S.btnCancel)
      : page.getByRole('button', { name: /cancel|batal/i });

    this.alertError = S.alertError
      ? page.locator(S.alertError)
      : page.getByRole('alert');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Isi field Email.
   *
   * @param email - alamat email pengguna
   */
  async fillEmail(email: string): Promise<void> {
    await this.inputEmail.fill(email);
  }

  /**
   * Pilih Role dari dropdown.
   *
   * @param roleName - nama role yang akan dipilih
   */
  async selectUserRole(roleName: string): Promise<void> {
    await this.selectRole.click();
    await expect(
      this.dropdownRoleList,
      'Add User Form: dropdown Role harus tampil setelah diklik',
    ).toBeVisible({ timeout: 8_000 });

    const option = S.dropdownRoleOption
      ? this.page.locator(S.dropdownRoleOption).filter({ hasText: roleName })
      : this.page.getByRole('option', { name: roleName });

    await option.click();
  }

  /**
   * Isi field Password.
   *
   * @param password - nilai password
   */
  async fillPassword(password: string): Promise<void> {
    await this.inputPassword.fill(password);
  }

  /**
   * Isi field Konfirmasi Password.
   *
   * @param confirmPassword - nilai konfirmasi password
   */
  async fillConfirmPassword(confirmPassword: string): Promise<void> {
    await this.inputConfirmPassword.fill(confirmPassword);
  }

  /**
   * Klik tombol Save.
   */
  async clickSave(): Promise<void> {
    await this.btnSave.click();
  }

  /**
   * Isi semua field dan klik Save (combined action untuk happy path).
   *
   * @param data - data form Add User
   */
  async fillAndSubmit(data: MerchantUserFormData): Promise<void> {
    await this.fillEmail(data.email);
    await this.selectUserRole(data.role);
    await this.fillPassword(data.password);
    await this.fillConfirmPassword(data.confirmPassword);
    await this.clickSave();
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Pastikan form Add User sudah tampil dan siap diisi.
   */
  async expectFormVisible(): Promise<void> {
    await expect(
      this.btnSave,
      'Add User Form: tombol Save harus tampil — halaman belum terbuka',
    ).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Pastikan validasi "Email wajib diisi" atau "Format email tidak valid" tampil.
   *
   * @param expectedText - teks partial yang diharapkan (contoh: 'wajib', 'valid')
   */
  async expectEmailValidation(expectedText: string): Promise<void> {
    const locator = S.validationEmail
      ? this.page.locator(S.validationEmail)
      : this.page.locator('[class*="error"]').filter({ hasText: /email/i });

    await expect(
      locator,
      `Add User Form: pesan validasi email "${expectedText}" harus tampil`,
    ).toContainText(expectedText, { timeout: 8_000 });
  }

  /**
   * Pastikan validasi "Role wajib dipilih" tampil.
   */
  async expectRoleRequired(): Promise<void> {
    const locator = S.validationRole
      ? this.page.locator(S.validationRole)
      : this.page.locator('[class*="error"]').filter({ hasText: /role/i });

    await expect(
      locator,
      'Add User Form: pesan validasi Role wajib dipilih harus tampil',
    ).toContainText('wajib', { timeout: 8_000 });
  }

  /**
   * Pastikan validasi "Password wajib diisi / min length" tampil.
   *
   * @param expectedText - teks partial yang diharapkan
   */
  async expectPasswordValidation(expectedText: string): Promise<void> {
    const locator = S.validationPassword
      ? this.page.locator(S.validationPassword)
      : this.page.locator('[class*="error"]').filter({ hasText: /^password/i });

    await expect(
      locator,
      `Add User Form: pesan validasi password "${expectedText}" harus tampil`,
    ).toContainText(expectedText, { timeout: 8_000 });
  }

  /**
   * Pastikan validasi "Konfirmasi Password tidak cocok" tampil.
   */
  async expectPasswordMismatch(): Promise<void> {
    const locator = S.validationConfirmPassword
      ? this.page.locator(S.validationConfirmPassword)
      : this.page.locator('[class*="error"]').filter({ hasText: /konfirmasi|confirm/i });

    await expect(
      locator,
      'Add User Form: pesan validasi konfirmasi password tidak cocok harus tampil',
    ).toBeVisible({ timeout: 8_000 });
  }

  /**
   * Pastikan error dari backend tampil (contoh: email sudah terdaftar).
   *
   * @param expectedText - teks partial yang diharapkan di alert error
   */
  async expectBackendError(expectedText: string): Promise<void> {
    await expect(
      this.alertError,
      `Add User Form: error backend "${expectedText}" harus tampil`,
    ).toContainText(expectedText, { timeout: 10_000 });
  }
}
