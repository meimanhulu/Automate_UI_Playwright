/**
 * @file PaymentNetworkFormPage.ts
 * @description Page Object Model untuk halaman "Add Merchant Account"
 *              (Create Payment Network) di Poppay.
 *
 * Flow yang dicakup (Phase 3 — Create Payment Network):
 *   Buka Halaman Add Merchant Account
 *   → Pilih Status → Pilih Payment Network → Pilih Payment Method
 *   → Klik Save → POST /api/payment-networks
 *   → Buka Halaman Add User
 *
 * Locator priority (COPILOT_INSTRUCTIONS.md):
 *   getByRole > getByLabel > getByTestId > CSS (last resort)
 *
 * ⚠️  Isi selector di:
 *       selectors/merchant/payment-network-form.selector.ts
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { PaymentNetworkFormSelector as S } from '../../selectors/merchant/payment-network-form.selector';

// ── Types ──────────────────────────────────────────────────────────────────────

/** Status untuk Merchant Account */
export type AccountStatus = 'Active' | 'Inactive';

/** Data yang dibutuhkan untuk mengisi form Add Merchant Account */
export interface PaymentNetworkFormData {
  /** Status Merchant Account */
  status: AccountStatus;
  /** Nama / kode Payment Network yang dipilih */
  paymentNetwork: string;
  /** Nama / kode Payment Method yang dipilih */
  paymentMethod: string;
}

// ── Page Object ────────────────────────────────────────────────────────────────

export class PaymentNetworkFormPage extends BasePage {

  // ── Locators ───────────────────────────────────────────────────────────────

  /** Kontainer form Add Merchant Account */
  readonly formContainer: Locator;

  /** Dropdown / select Status */
  readonly selectStatus: Locator;

  /** Field / trigger dropdown Payment Network */
  readonly selectPaymentNetwork: Locator;

  /** Kontainer list opsi Payment Network */
  readonly dropdownPaymentNetworkList: Locator;

  /** Field / trigger dropdown Payment Method */
  readonly selectPaymentMethod: Locator;

  /** Kontainer list opsi Payment Method */
  readonly dropdownPaymentMethodList: Locator;

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
      : page.locator('form').filter({ hasText: /merchant account|payment network/i });

    this.selectStatus = S.selectStatus
      ? page.locator(S.selectStatus)
      : page.getByLabel(/^status/i);

    this.selectPaymentNetwork = S.selectPaymentNetwork
      ? page.locator(S.selectPaymentNetwork)
      : page.getByLabel(/payment network/i);

    this.dropdownPaymentNetworkList = S.dropdownPaymentNetworkList
      ? page.locator(S.dropdownPaymentNetworkList)
      : page.locator('[role="listbox"], [role="menu"]').first();

    this.selectPaymentMethod = S.selectPaymentMethod
      ? page.locator(S.selectPaymentMethod)
      : page.getByLabel(/payment method/i);

    this.dropdownPaymentMethodList = S.dropdownPaymentMethodList
      ? page.locator(S.dropdownPaymentMethodList)
      : page.locator('[role="listbox"], [role="menu"]').nth(1);

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
   * Pilih Status untuk Merchant Account.
   *
   * @param status - nilai status yang akan dipilih
   */
  async selectAccountStatus(status: AccountStatus): Promise<void> {
    await this.selectStatus.selectOption({ label: status });
  }

  /**
   * Pilih Payment Network dari dropdown.
   *
   * @param networkName - nama / label payment network
   */
  async selectNetwork(networkName: string): Promise<void> {
    await this.selectPaymentNetwork.click();
    await expect(
      this.dropdownPaymentNetworkList,
      'Payment Network Form: dropdown payment network harus tampil setelah diklik',
    ).toBeVisible({ timeout: 8_000 });

    const option = S.dropdownPaymentNetworkOption
      ? this.page.locator(S.dropdownPaymentNetworkOption).filter({ hasText: networkName })
      : this.page.getByRole('option', { name: networkName });

    await option.click();
  }

  /**
   * Pilih Payment Method dari dropdown.
   *
   * @param methodName - nama / label payment method
   */
  async selectMethod(methodName: string): Promise<void> {
    await this.selectPaymentMethod.click();
    await expect(
      this.dropdownPaymentMethodList,
      'Payment Network Form: dropdown payment method harus tampil setelah diklik',
    ).toBeVisible({ timeout: 8_000 });

    const option = S.dropdownPaymentMethodOption
      ? this.page.locator(S.dropdownPaymentMethodOption).filter({ hasText: methodName })
      : this.page.getByRole('option', { name: methodName });

    await option.click();
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
   * @param data - data form Add Merchant Account
   */
  async fillAndSubmit(data: PaymentNetworkFormData): Promise<void> {
    await this.selectAccountStatus(data.status);
    await this.selectNetwork(data.paymentNetwork);
    await this.selectMethod(data.paymentMethod);
    await this.clickSave();
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Pastikan form Add Merchant Account sudah tampil dan siap diisi.
   */
  async expectFormVisible(): Promise<void> {
    await expect(
      this.btnSave,
      'Payment Network Form: tombol Save harus tampil — halaman belum terbuka',
    ).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Pastikan validasi "Status wajib diisi" tampil.
   */
  async expectStatusRequired(): Promise<void> {
    const locator = S.validationStatus
      ? this.page.locator(S.validationStatus)
      : this.page.locator('[class*="error"]').filter({ hasText: /status/i });

    await expect(
      locator,
      'Payment Network Form: pesan validasi Status wajib diisi harus tampil',
    ).toContainText('wajib', { timeout: 8_000 });
  }

  /**
   * Pastikan validasi "Payment Network wajib dipilih" tampil.
   */
  async expectPaymentNetworkRequired(): Promise<void> {
    const locator = S.validationPaymentNetwork
      ? this.page.locator(S.validationPaymentNetwork)
      : this.page.locator('[class*="error"]').filter({ hasText: /payment network/i });

    await expect(
      locator,
      'Payment Network Form: pesan validasi Payment Network wajib dipilih harus tampil',
    ).toContainText('wajib', { timeout: 8_000 });
  }

  /**
   * Pastikan validasi "Payment Method wajib dipilih" tampil.
   */
  async expectPaymentMethodRequired(): Promise<void> {
    const locator = S.validationPaymentMethod
      ? this.page.locator(S.validationPaymentMethod)
      : this.page.locator('[class*="error"]').filter({ hasText: /payment method/i });

    await expect(
      locator,
      'Payment Network Form: pesan validasi Payment Method wajib dipilih harus tampil',
    ).toContainText('wajib', { timeout: 8_000 });
  }

  /**
   * Pastikan error dari backend tampil.
   *
   * @param expectedText - teks partial yang diharapkan di alert error
   */
  async expectBackendError(expectedText: string): Promise<void> {
    await expect(
      this.alertError,
      `Payment Network Form: error backend "${expectedText}" harus tampil`,
    ).toContainText(expectedText, { timeout: 10_000 });
  }
}
