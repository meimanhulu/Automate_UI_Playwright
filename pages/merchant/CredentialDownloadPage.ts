/**
 * @file CredentialDownloadPage.ts
 * @description Page Object Model untuk halaman "Download Credential"
 *              dalam flow Create Merchant di Poppay.
 *
 * Flow yang dicakup (Phase 5 — Download Credential):
 *   Buka Halaman Download Credential
 *   → Klik Generate → Tampil Dokumen Credential
 *   → Klik Download → Tampil Pop Up Konfirmasi
 *   → Klik Yes → Download Credential File → END
 *
 * Locator priority (COPILOT_INSTRUCTIONS.md):
 *   getByRole > getByLabel > getByTestId > CSS (last resort)
 *
 * ⚠️  Isi selector di:
 *       selectors/merchant/credential-download.selector.ts
 */

import { Page, Locator, Download, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { CredentialDownloadSelector as S } from '../../selectors/merchant/credential-download.selector';

// ── Page Object ────────────────────────────────────────────────────────────────

export class CredentialDownloadPage extends BasePage {

  // ── Locators ───────────────────────────────────────────────────────────────

  /** Kontainer halaman Download Credential */
  readonly pageContainer: Locator;

  /** Tombol "Generate" */
  readonly btnGenerate: Locator;

  /** Area preview dokumen credential */
  readonly credentialPreview: Locator;

  /** Tombol "Download" */
  readonly btnDownload: Locator;

  /** Kontainer modal konfirmasi download */
  readonly modalConfirmation: Locator;

  /** Teks / pesan di dalam modal konfirmasi */
  readonly modalMessage: Locator;

  /** Tombol "Yes" dalam modal konfirmasi */
  readonly btnModalYes: Locator;

  /** Tombol "No" / "Cancel" dalam modal konfirmasi */
  readonly btnModalNo: Locator;

  /** Toast sukses */
  readonly toastSuccess: Locator;

  /** Toast error */
  readonly toastError: Locator;

  // ── Constructor ────────────────────────────────────────────────────────────

  constructor(page: Page) {
    super(page);

    this.pageContainer = S.pageContainer
      ? page.locator(S.pageContainer)
      : page.locator('main, [role="main"]').first();

    this.btnGenerate = S.btnGenerate
      ? page.locator(S.btnGenerate)
      : page.getByRole('button', { name: /generate/i });

    this.credentialPreview = S.credentialPreview
      ? page.locator(S.credentialPreview)
      : page.locator('[class*="preview"], [class*="credential"]').first();

    this.btnDownload = S.btnDownload
      ? page.locator(S.btnDownload)
      : page.getByRole('button', { name: /download/i });

    this.modalConfirmation = S.modalConfirmation
      ? page.locator(S.modalConfirmation)
      : page.getByRole('dialog');

    this.modalMessage = S.modalMessage
      ? page.locator(S.modalMessage)
      : page.getByRole('dialog').locator('p, [class*="message"]').first();

    this.btnModalYes = S.btnModalYes
      ? page.locator(S.btnModalYes)
      : page.getByRole('dialog').getByRole('button', { name: /yes|ya/i });

    this.btnModalNo = S.btnModalNo
      ? page.locator(S.btnModalNo)
      : page.getByRole('dialog').getByRole('button', { name: /no|batal/i });

    this.toastSuccess = S.toastSuccess
      ? page.locator(S.toastSuccess)
      : page.getByRole('alert');

    this.toastError = S.toastError
      ? page.locator(S.toastError)
      : page.getByRole('alert');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Klik tombol "Generate" untuk membuat dokumen credential.
   * Setelah ini, tunggu preview tampil (expectCredentialPreviewVisible).
   */
  async clickGenerate(): Promise<void> {
    await this.btnGenerate.click();
  }

  /**
   * Klik tombol "Download" untuk memulai proses download.
   * Setelah ini, modal konfirmasi akan muncul.
   */
  async clickDownload(): Promise<void> {
    await this.btnDownload.click();
  }

  /**
   * Klik tombol "Yes" dalam modal konfirmasi download.
   * Ini akan memulai download file.
   */
  async clickModalYes(): Promise<void> {
    await this.btnModalYes.click();
  }

  /**
   * Klik tombol "No" dalam modal konfirmasi download.
   * Modal akan tertutup tanpa download.
   */
  async clickModalNo(): Promise<void> {
    await this.btnModalNo.click();
  }

  /**
   * Generate dan Download credential dalam satu action.
   * Menunggu event download Playwright sebelum klik Yes.
   *
   * @returns Promise<Download> — objek download Playwright untuk verifikasi
   *
   * @example
   * const download = await credentialPage.generateAndDownload();
   * expect(download.suggestedFilename()).toContain('.pdf');
   */
  async generateAndDownload(): Promise<Download> {
    // 1. Generate dokumen
    await this.clickGenerate();
    await this.expectCredentialPreviewVisible();

    // 2. Klik Download untuk buka modal konfirmasi
    await this.clickDownload();
    await this.expectConfirmationModalVisible();

    // 3. Daftarkan listener download SEBELUM klik Yes — hindari race condition
    const downloadPromise = this.page.waitForEvent('download');
    await this.clickModalYes();

    return downloadPromise;
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Pastikan halaman Download Credential sudah tampil dan siap.
   */
  async expectPageVisible(): Promise<void> {
    await expect(
      this.btnGenerate,
      'Download Credential: tombol Generate harus tampil — halaman belum terbuka',
    ).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Pastikan preview dokumen credential tampil setelah Generate diklik.
   */
  async expectCredentialPreviewVisible(): Promise<void> {
    await expect(
      this.credentialPreview,
      'Download Credential: preview dokumen credential harus tampil setelah Generate',
    ).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Pastikan tombol Download tampil dan enabled setelah Generate.
   */
  async expectDownloadButtonEnabled(): Promise<void> {
    await expect(
      this.btnDownload,
      'Download Credential: tombol Download harus tampil dan enabled setelah Generate',
    ).toBeEnabled({ timeout: 10_000 });
  }

  /**
   * Pastikan modal konfirmasi download tampil.
   */
  async expectConfirmationModalVisible(): Promise<void> {
    await expect(
      this.modalConfirmation,
      'Download Credential: modal konfirmasi download harus tampil setelah klik Download',
    ).toBeVisible({ timeout: 8_000 });
  }

  /**
   * Pastikan modal konfirmasi download tidak tampil (tertutup).
   */
  async expectConfirmationModalClosed(): Promise<void> {
    await expect(
      this.modalConfirmation,
      'Download Credential: modal konfirmasi harus tertutup setelah klik No',
    ).toBeHidden({ timeout: 8_000 });
  }

  /**
   * Pastikan file yang didownload memiliki nama file yang sesuai.
   *
   * @param download        - objek Download dari Playwright
   * @param expectedPattern - regex atau string partial nama file
   */
  async expectDownloadedFileName(download: Download, expectedPattern: string | RegExp): Promise<void> {
    const filename = download.suggestedFilename();
    const pattern = typeof expectedPattern === 'string'
      ? new RegExp(expectedPattern, 'i')
      : expectedPattern;

    expect(
      filename,
      `Download Credential: nama file yang didownload harus cocok dengan pola "${expectedPattern}"`,
    ).toMatch(pattern);
  }
}
