/**
 * @file MerchantListPage.ts  (versi lengkap — Create Merchant flow)
 * @description Page Object Model untuk halaman Merchant List di Poppay.
 *
 * Navigasi (sesuai UI Poppay):
 *   Sidebar → Tenant (expand) → Merchant
 *
 * Flow yang dicakup (Phase 1 — View Merchant List):
 *   START → Buka fitur Merchant → GET /api/merchants → Tampilkan Data Merchant
 *
 * Kolom tabel (dari screenshot):
 *   NAME | AGGREGATOR | STATUS | DEFAULT FEE (%) | CREATED AT | UPDATED AT | ACTION
 *
 * Locator priority (COPILOT_INSTRUCTIONS.md):
 *   getByRole > getByLabel > getByTestId > CSS (last resort)
 *
 * ⚠️  Ganti nilai selector di:
 *       selectors/merchant/merchant-list.selector.ts
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { TenantSidebarPage } from '../tenant/TenantSidebarPage';
import { MerchantListSelector as S } from '../../selectors/merchant/merchant-list.selector';

export class MerchantListPage extends BasePage {

  // ── Locators ───────────────────────────────────────────────────────────────

  /** Heading utama halaman — konfirmasi kita berada di /merchant */
  readonly pageHeading: Locator;

  /** Tombol "Add Merchant" / "Buat Merchant" — CTA utama */
  readonly btnAddMerchant: Locator;

  /** Kontainer tabel / list data merchant */
  readonly tableContainer: Locator;

  /** Toast / notifikasi (success atau error) */
  readonly toastContainer: Locator;

  /** Input pencarian merchant */
  readonly inputSearch: Locator;

  // ── Constructor ────────────────────────────────────────────────────────────

  constructor(page: Page) {
    super(page);

    // Jika selector sudah diisi di merchant-list.selector.ts, pakai S.*
    // Jika masih kosong (''), fallback ke getByRole / getByTestId.
    this.pageHeading    = S.pageHeading
      ? page.locator(S.pageHeading)
      : page.getByRole('heading', { name: /merchant/i });

    this.btnAddMerchant = S.btnAddMerchant
      ? page.locator(S.btnAddMerchant)
      : page.getByRole('button', { name: /add merchant|buat merchant/i });

    this.tableContainer = S.tableContainer
      ? page.locator(S.tableContainer)
      : page.locator('table, [role="table"]').first();

    this.toastContainer = S.toastContainer
      ? page.locator(S.toastContainer)
      : page.getByRole('alert');

    this.inputSearch    = S.inputSearch
      ? page.locator(S.inputSearch)
      : page.getByRole('searchbox');
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /**
   * Navigasi ke halaman Merchant List via sidebar Poppay.
   *
   * Alur:
   *   1. Klik menu "Tenant" di sidebar (expand)
   *   2. Klik sub-menu "Merchant"
   *   3. Tunggu halaman Merchant List fully loaded
   *
   * Ini adalah metode navigasi **utama** yang sesuai dengan flow UI aktual.
   * Pastikan user sudah login sebelum memanggil method ini.
   *
   * @param fromUrl - (opsional) jika diberikan, navigasi langsung ke URL tersebut
   *                  sebelum klik sidebar. Berguna jika halaman awal bukan dashboard.
   */
  async gotoViaSidebar(fromUrl?: string): Promise<void> {
    if (fromUrl) {
      await this.navigate(fromUrl);
      await this.waitForLoading();
    }

    const tenantNav = new TenantSidebarPage(this.page);
    await tenantNav.expandTenantMenu();
    await tenantNav.goToMerchant();
    await this.expectPageLoaded();
  }

  /**
   * Navigasi langsung ke URL Merchant List (tanpa klik sidebar).
   * Gunakan hanya untuk test yang tidak perlu menguji navigasi sidebar,
   * atau jika URL sudah diketahui pasti.
   *
   * @deprecated Untuk flow E2E yang lengkap, gunakan {@link gotoViaSidebar}.
   */
  async gotoDirectUrl(): Promise<void> {
    await this.navigate('/tenant/merchant');
    await this.waitForLoading();
    await this.expectPageLoaded();
  }

  /**
   * Alias backward-compatible — memanggil {@link gotoViaSidebar}.
   * Dipertahankan agar test lama tidak patah.
   */
  async goto(): Promise<void> {
    await this.gotoViaSidebar();
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Klik tombol "Add Merchant" / "Buat Merchant".
   */
  async clickAddMerchant(): Promise<void> {
    await this.btnAddMerchant.click();
  }

  /**
   * Alias backward-compatible untuk {@link clickAddMerchant}.
   * Dipertahankan agar `create-merchant.spec.ts` (lama) tidak patah.
   *
   * @deprecated Gunakan {@link clickAddMerchant} pada code baru.
   */
  async clickBuatMerchant(): Promise<void> {
    await this.clickAddMerchant();
  }

  /**
   * Cari merchant berdasarkan nama.
   *
   * @param merchantName - nama merchant yang dicari
   */
  async searchMerchant(merchantName: string): Promise<void> {
    await this.inputSearch.fill(merchantName);
    await this.page.keyboard.press('Enter');
    await this.waitForLoading();
  }

  /**
   * Kembalikan locator baris tabel berdasarkan nama merchant.
   * Gunakan untuk verifikasi data setelah create.
   *
   * @param merchantName - nama merchant yang dicari di tabel
   */
  getMerchantRow(merchantName: string): Locator {
    return this.page.getByRole('row', { name: merchantName });
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Pastikan halaman Merchant List sudah fully loaded.
   * Dipakai sebagai guard di beforeEach setiap test.
   */
  async expectPageLoaded(): Promise<void> {
    await expect(
      this.pageHeading,
      'Merchant List: page heading harus terlihat setelah navigasi',
    ).toBeVisible({ timeout: 15_000 });

    await expect(
      this.btnAddMerchant,
      'Merchant List: tombol "Add Merchant" harus tampil di halaman',
    ).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Pastikan tabel / list data merchant terlihat (data sudah di-load dari API).
   */
  async expectTableVisible(): Promise<void> {
    await expect(
      this.tableContainer,
      'Merchant List: tabel data merchant harus tampil setelah API selesai',
    ).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Pastikan merchant baru tampil di tabel (soft assertion — non-blocking).
   *
   * @param merchantName - nama merchant yang harus tampil di list
   */
  async expectMerchantInList(merchantName: string): Promise<void> {
    await expect.soft(
      this.getMerchantRow(merchantName),
      `Merchant List: merchant "${merchantName}" harus tampil di tabel setelah dibuat`,
    ).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Pastikan toast sukses tampil dengan teks yang diharapkan.
   *
   * @param message - teks partial yang diharapkan ada di dalam toast
   */
  async expectSuccessToast(message: string): Promise<void> {
    await expect(
      this.toastContainer,
      `Merchant List: toast sukses dengan teks "${message}" harus muncul`,
    ).toContainText(message, { timeout: 10_000 });
  }

  /**
   * Pastikan toast error tampil dengan teks yang diharapkan.
   *
   * @param message - teks partial yang diharapkan ada di dalam toast error
   */
  async expectErrorToast(message: string): Promise<void> {
    await expect(
      this.toastContainer,
      `Merchant List: toast error dengan teks "${message}" harus muncul`,
    ).toContainText(message, { timeout: 10_000 });
  }
}
