/**
 * @file MerchantListPage.ts
 * @description Page Object Model for the Merchant List (/merchant) page.
 *
 * Locator priority followed (per COPILOT_INSTRUCTIONS.md):
 *   getByRole > getByLabel > getByTestId > CSS (last resort)
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class MerchantListPage extends BasePage {

  // ── Locators ──────────────────────────────────────────────────────────────

  /** Primary CTA: opens the Merchant creation form */
  readonly btnBuatMerchant: Locator;

  /** Page-level heading — confirms we are on /merchant */
  readonly pageHeading: Locator;

  /** Toast / notification container — appears after create/update/delete */
  readonly toastContainer: Locator;

  // ── Constructor ───────────────────────────────────────────────────────────

  constructor(page: Page) {
    super(page);
    this.btnBuatMerchant = page.getByRole('button', { name: 'Buat Merchant' });
    this.pageHeading     = page.getByRole('heading', { name: 'Merchant' });
    this.toastContainer  = page.getByRole('alert');
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  /**
   * Navigates to /merchant and waits until the page is fully loaded.
   * BASE_URL is read from the APP_URL env variable (set in .env / CI).
   */
  async goto(): Promise<void> {
    const base = process.env['APP_URL'] ?? '';
    await this.page.goto(`${base}/merchant`);
    await this.waitForLoading();
    await this.expectPageLoaded();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Asserts that the Merchant List page has finished loading.
   * Used as a guard at the start of every test.
   */
  async expectPageLoaded(): Promise<void> {
    await expect(
      this.pageHeading,
      'Merchant list page should be visible — page heading not found',
    ).toBeVisible({ timeout: 15_000 });

    await expect(
      this.btnBuatMerchant,
      '"Buat Merchant" button should be present on the list page',
    ).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Asserts that a success toast with the given message is visible.
   *
   * @param message - partial text expected inside the toast
   */
  async expectSuccessToast(message: string): Promise<void> {
    await expect(
      this.toastContainer,
      `Success toast with message "${message}" should appear after the action`,
    ).toContainText(message, { timeout: 10_000 });
  }

  /**
   * Searches for a merchant by name in the list and returns whether it exists.
   *
   * @param merchantName - the company name to look for
   */
  async isMerchantVisible(merchantName: string): Promise<boolean> {
    const row = this.page.getByRole('row', { name: merchantName });
    return row.isVisible().catch(() => false);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Clicks "Buat Merchant" and waits for the form to open. */
  async clickBuatMerchant(): Promise<void> {
    await this.btnBuatMerchant.click();
  }
}
