/**
 * @file MerchantFormPage.ts
 * @description Page Object Model for the Merchant creation/edit form.
 *
 * Locator priority (per COPILOT_INSTRUCTIONS.md):
 *   getByRole > getByLabel > getByTestId > CSS (last resort)
 *
 * Covers:
 *  - Positive: Full Plan & POS Plan merchant creation
 *  - Negative: Required field validation & duplicate MID error
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

// ── Types ──────────────────────────────────────────────────────────────────────

export type MerchantPlan = 'Full Plan' | 'POS Plan' | 'VA Plan' | 'QRIS Report Plan';

export interface MerchantFormData {
  namaCompany: string;
  mid: string;
  plan: MerchantPlan;
}

// ── Page Object ────────────────────────────────────────────────────────────────

export class MerchantFormPage extends BasePage {

  // ── Locators ────────────────────────────────────────────────────────────

  /** Text input: Nama Company */
  readonly inputNamaCompany: Locator;

  /** Text input: MID (Merchant ID) */
  readonly inputMid: Locator;

  /** Submit button inside the form */
  readonly btnSimpan: Locator;

  /** Validation / error message area — role=alert */
  readonly alertMessage: Locator;

  /** Generic error text below a field (non-alert inline validation) */
  readonly inlineValidation: Locator;

  // ── Constructor ──────────────────────────────────────────────────────────

  constructor(page: Page) {
    super(page);

    this.inputNamaCompany  = page.getByLabel('Nama Company');
    this.inputMid          = page.getByLabel('MID');
    this.btnSimpan         = page.getByRole('button', { name: 'Simpan Merchant' });
    this.alertMessage      = page.getByRole('alert');
    this.inlineValidation  = page.locator('[role="alert"], .field-error, .text-red-500');
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Selects a plan using the radio group.
   *
   * @param plan - one of the MerchantPlan values
   */
  async selectPlan(plan: MerchantPlan): Promise<void> {
    await this.page
      .getByRole('radio', { name: plan })
      .check();
  }

  /**
   * Fills and submits the full merchant creation form.
   *
   * @param data - merchant form data
   */
  async fillAndSubmit(data: MerchantFormData): Promise<void> {
    await this.inputNamaCompany.fill(data.namaCompany);
    await this.inputMid.fill(data.mid);
    await this.selectPlan(data.plan);
    await this.btnSimpan.click();
  }

  /**
   * Clears all form fields (useful for re-use within one test).
   */
  async clearForm(): Promise<void> {
    await this.inputNamaCompany.clear();
    await this.inputMid.clear();
  }

  // ── Assertions ───────────────────────────────────────────────────────────

  /**
   * Asserts the form is visible (modal or page has rendered).
   */
  async expectFormVisible(): Promise<void> {
    await expect(
      this.btnSimpan,
      '"Simpan Merchant" button should be visible — form did not open',
    ).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Asserts a specific validation message is shown — used for negative TCs.
   *
   * @param expectedText - partial text expected in the validation area
   */
  async expectValidationMessage(expectedText: string): Promise<void> {
    await expect(
      this.inlineValidation,
      `Validation message containing "${expectedText}" should be visible`,
    ).toContainText(expectedText, { timeout: 8_000 });
  }

  /**
   * Asserts an error alert is visible with the given text.
   *
   * @param expectedText - partial text expected inside the alert
   */
  async expectErrorAlert(expectedText: string): Promise<void> {
    await expect(
      this.alertMessage,
      `Error alert containing "${expectedText}" should be visible`,
    ).toContainText(expectedText, { timeout: 8_000 });
  }

  /**
   * Asserts that the "Nama Company" field shows a required-field error.
   * Wraps expectValidationMessage with the known Indonesian required-field text.
   */
  async expectNamaCompanyRequired(): Promise<void> {
    await this.expectValidationMessage('wajib');   // e.g. "Field ini wajib diisi"
  }

  /**
   * Asserts that the MID duplicate error is shown.
   */
  async expectMidDuplicateError(): Promise<void> {
    // Backend returns: "MID sudah terdaftar" — checked via alert role or inline
    const dupError = this.page.locator('text=MID sudah terdaftar').or(
      this.page.getByRole('alert').filter({ hasText: 'MID sudah terdaftar' }),
    );
    await expect(
      dupError,
      '"MID sudah terdaftar" error should appear when a duplicate MID is submitted',
    ).toBeVisible({ timeout: 10_000 });
  }
}
