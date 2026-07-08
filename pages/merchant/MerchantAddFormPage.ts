/**
 * @file MerchantAddFormPage.ts
 * @description Page Object Model untuk halaman "Add Merchant" di Poppay.
 *
 * Flow yang dicakup (Phase 2 — Create Merchant):
 *   Klik "Add Merchant" → Tampil Form Add Merchant
 *   → Klik Aggregator Code → GET /api/aggregators → Pilih Aggregator
 *   → Pilih Status → Isi Nama Merchant → Isi Fee Merchant
 *   → Klik Save → POST /api/merchants
 *   → Buka Halaman Add Merchant Account
 *
 * Locator priority (COPILOT_INSTRUCTIONS.md):
 *   getByRole > getByLabel > getByTestId > CSS (last resort)
 *
 * ⚠️  Isi selector di:
 *       selectors/merchant/merchant-form.selector.ts
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { MerchantFormSelector as S } from '../../selectors/merchant/merchant-form.selector';

// ── Types ──────────────────────────────────────────────────────────────────────

/** Opsi status yang tersedia pada form Merchant */
export type MerchantStatus = 'Active' | 'Inactive';

/** Data yang dibutuhkan untuk mengisi form Add Merchant */
export interface MerchantAddFormData {
  /** Kode Aggregator yang akan dipilih dari dropdown */
  aggregatorCode: string;
  /** Status merchant */
  status: MerchantStatus;
  /** Nama merchant */
  merchantName: string;
  /** Fee merchant (string angka, contoh: "2.5") */
  merchantFee: string;
}

// ── Page Object ────────────────────────────────────────────────────────────────

export class MerchantAddFormPage extends BasePage {

  // ── Locators ───────────────────────────────────────────────────────────────

  /** Kontainer form Add Merchant */
  readonly formContainer: Locator;

  /** Field / trigger dropdown Aggregator Code */
  readonly inputAggregatorCode: Locator;

  /** Kontainer dropdown list Aggregator */
  readonly dropdownAggregatorList: Locator;

  /** Dropdown / select Status */
  readonly selectStatus: Locator;

  /** Input Nama Merchant */
  readonly inputMerchantName: Locator;

  /** Input Fee Merchant */
  readonly inputMerchantFee: Locator;

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
      : page.locator('form').filter({ hasText: /add merchant|tambah merchant/i });

    this.inputAggregatorCode = S.inputAggregatorCode
      ? page.locator(S.inputAggregatorCode)
      : page.getByLabel(/aggregator code/i);

    this.dropdownAggregatorList = S.dropdownAggregatorList
      ? page.locator(S.dropdownAggregatorList)
      : page.locator('[role="listbox"], [role="menu"]').first();

    this.selectStatus = S.selectStatus
      ? page.locator(S.selectStatus)
      : page.getByLabel(/^status/i);

    this.inputMerchantName = S.inputMerchantName
      ? page.locator(S.inputMerchantName)
      : page.getByLabel(/nama merchant/i);

    this.inputMerchantFee = S.inputMerchantFee
      ? page.locator(S.inputMerchantFee)
      : page.getByLabel(/fee merchant/i);

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
   * Klik field Aggregator Code untuk membuka dropdown.
   * Setelah ini, tunggu dropdown tampil (expectAggregatorDropdownOpen).
   */
  async clickAggregatorCode(): Promise<void> {
    await this.inputAggregatorCode.click();
  }

  /**
   * Pilih aggregator dari dropdown berdasarkan teks/label opsi.
   *
   * @param aggregatorCode - teks label aggregator yang akan dipilih
   */
  async selectAggregator(aggregatorCode: string): Promise<void> {
    await this.clickAggregatorCode();
    await this.expectAggregatorDropdownOpen();

    // Cari opsi berdasarkan teks — getByRole option atau locator teks
    const option = S.dropdownAggregatorOption
      ? this.page.locator(S.dropdownAggregatorOption).filter({ hasText: aggregatorCode })
      : this.page.getByRole('option', { name: aggregatorCode });

    await option.click();
  }

  /**
   * Pilih status merchant.
   *
   * @param status - nilai status yang akan dipilih
   */
  async selectMerchantStatus(status: MerchantStatus): Promise<void> {
    await this.selectStatus.selectOption({ label: status });
  }

  /**
   * Isi field Nama Merchant.
   *
   * @param name - nama merchant
   */
  async fillMerchantName(name: string): Promise<void> {
    await this.inputMerchantName.fill(name);
  }

  /**
   * Isi field Fee Merchant.
   *
   * @param fee - nilai fee (string angka)
   */
  async fillMerchantFee(fee: string): Promise<void> {
    await this.inputMerchantFee.fill(fee);
  }

  /**
   * Klik tombol Save untuk submit form.
   * Gunakan bersama dengan assertion setelah ini.
   */
  async clickSave(): Promise<void> {
    await this.btnSave.click();
  }

  /**
   * Isi semua field dan klik Save (combined action).
   * Digunakan untuk happy path test.
   *
   * @param data - data form Add Merchant
   */
  async fillAndSubmit(data: MerchantAddFormData): Promise<void> {
    await this.selectAggregator(data.aggregatorCode);
    await this.selectMerchantStatus(data.status);
    await this.fillMerchantName(data.merchantName);
    await this.fillMerchantFee(data.merchantFee);
    await this.clickSave();
  }

  /**
   * Kosongkan semua field (berguna untuk reuse dalam satu test).
   */
  async clearForm(): Promise<void> {
    await this.inputMerchantName.clear();
    await this.inputMerchantFee.clear();
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Pastikan form Add Merchant sudah tampil dan siap diisi.
   */
  async expectFormVisible(): Promise<void> {
    await expect(
      this.btnSave,
      'Add Merchant Form: tombol Save harus tampil — form belum terbuka',
    ).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Pastikan dropdown Aggregator sudah terbuka (setelah klik Aggregator Code).
   */
  async expectAggregatorDropdownOpen(): Promise<void> {
    await expect(
      this.dropdownAggregatorList,
      'Add Merchant Form: dropdown Aggregator harus tampil setelah diklik',
    ).toBeVisible({ timeout: 8_000 });
  }

  /**
   * Pastikan pesan validasi muncul untuk field tertentu.
   *
   * @param selector - locator pesan validasi dari selector file
   * @param expectedText - teks partial yang diharapkan
   */
  async expectValidationMessage(selector: Locator, expectedText: string): Promise<void> {
    await expect(
      selector,
      `Add Merchant Form: pesan validasi "${expectedText}" harus tampil`,
    ).toContainText(expectedText, { timeout: 8_000 });
  }

  /**
   * Pastikan validasi "Aggregator Code wajib diisi" tampil.
   */
  async expectAggregatorCodeRequired(): Promise<void> {
    const locator = S.validationAggregatorCode
      ? this.page.locator(S.validationAggregatorCode)
      : this.page.locator('[class*="error"]').filter({ hasText: /aggregator/i });

    await this.expectValidationMessage(locator, 'wajib');
  }

  /**
   * Pastikan validasi "Nama Merchant wajib diisi" tampil.
   */
  async expectMerchantNameRequired(): Promise<void> {
    const locator = S.validationMerchantName
      ? this.page.locator(S.validationMerchantName)
      : this.page.locator('[class*="error"]').filter({ hasText: /nama merchant/i });

    await this.expectValidationMessage(locator, 'wajib');
  }

  /**
   * Pastikan validasi "Fee Merchant wajib diisi" tampil.
   */
  async expectMerchantFeeRequired(): Promise<void> {
    const locator = S.validationMerchantFee
      ? this.page.locator(S.validationMerchantFee)
      : this.page.locator('[class*="error"]').filter({ hasText: /fee/i });

    await this.expectValidationMessage(locator, 'wajib');
  }

  /**
   * Pastikan error alert dari backend tampil dengan teks tertentu.
   *
   * @param expectedText - teks partial yang diharapkan di alert
   */
  async expectBackendError(expectedText: string): Promise<void> {
    await expect(
      this.alertError,
      `Add Merchant Form: error backend "${expectedText}" harus tampil`,
    ).toContainText(expectedText, { timeout: 10_000 });
  }
}
