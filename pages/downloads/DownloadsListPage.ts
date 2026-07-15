import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { DownloadsListSelector as S } from '../../selectors/downloads/downloads-list.selector';

export class DownloadsListPage extends BasePage {
  readonly tableContainer: Locator;
  readonly btnRefresh: Locator;

  constructor(page: Page) {
    super(page);

    // pageHeading validation removed because Vue renders multiple H1 elements (hidden/visible)
    // We will validate page readiness using URL and stable UI elements (table, rows) instead.
    this.tableContainer = S.tableContainer
      ? page.locator(S.tableContainer)
      : page.locator('table').first();

    this.btnRefresh = S.btnRefresh
      ? page.locator(S.btnRefresh)
      : page.getByRole('button', { name: /refresh/i });
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  async expectPageLoaded(): Promise<void> {
    // 1. Validasi URL (SPA client-side routing)
    await expect(this.page).toHaveURL(/\/download$/);

    // 2. Sinkronisasi UI menggunakan elemen stabil (tabel dan isinya)
    await expect(
      this.tableContainer,
      'Downloads List: tabel data harus tampil'
    ).toBeVisible({ timeout: 15_000 });

    // Pastikan header kolom "Report Name" terlihat untuk memastikan tabel benar-benar ter-render
    await expect(
      this.tableContainer.getByRole('columnheader', { name: /report name/i }).first(),
      'Kolom Report Name harus terlihat'
    ).toBeVisible();

    // Pastikan baris pertama tabel terlihat (menandakan data atau empty state telah selesai dirender)
    await expect(
      this.tableContainer.locator('tbody tr').first(),
      'Baris tabel pertama harus terlihat'
    ).toBeVisible();
  }

  async expectTableVisible(): Promise<void> {
    await expect(
      this.tableContainer,
      'Downloads List: tabel data harus tampil setelah load'
    ).toBeVisible({ timeout: 15_000 });
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Klik tombol refresh untuk memperbarui status file.
   */
  async clickRefresh(): Promise<void> {
    // Tombol refresh mungkin ada di kanan atas tabel
    await this.btnRefresh.click().catch(() => {}); // Optional fallback
    await this.waitForLoading();
  }

  /**
   * Mengembalikan locator baris report terbaru yang berstatus "Ready".
   */
  getLatestReadyReport(reportName: string): Locator {
    // Cari baris dengan nama report dan status "Ready" (case-insensitive)
    // .first() mengambil urutan teratas (terbaru) karena tabel default-nya descending
    return this.page
      .locator('tbody tr')
      .filter({ hasText: new RegExp(`^${reportName}`, 'i') })
      .filter({ hasText: /ready/i })
      .first();
  }

  /**
   * Menunggu status file menjadi Ready, lalu mendownloadnya.
   * Melakukan proses polling jika diperlukan.
   */
  async downloadReport(reportName: string): Promise<void> {
    const latestReport = this.getLatestReadyReport(reportName);
    
    // Karena async background S3 mungkin butuh waktu, kita coba tunggu barisnya muncul (Ready)
    await expect(
      latestReport,
      `Report "${reportName}" terbaru harus berstatus Ready untuk diunduh`
    ).toBeVisible({ timeout: 30_000 }); // Tunggu maksimal 30 detik untuk file terproses
    
    // Karena icon download selalu berada di kolom terakhir, kita targetkan secara spesifik
    const downloadIcon = latestReport.locator('td:last-child span[role="presentation"]');
    
    await expect(
      downloadIcon,
      `Ikon download untuk report "${reportName}" harus terlihat`
    ).toBeVisible({ timeout: 5_000 });

    // Memberikan jeda 2500ms agar proses klik tombol download terlihat jelas
    await this.page.waitForTimeout(2500);

    // Setelah ready dan icon terlihat, klik download
    // Proses waitForEvent('download') harus dilakukan di level Test Script sebelum memanggil fungsi ini
    await downloadIcon.click();
  }
}
