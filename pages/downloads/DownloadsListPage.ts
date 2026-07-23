import { Page, Locator, expect, Download } from '@playwright/test';
import { BasePage } from '../BasePage';
import { DownloadsListSelector as S } from '../../selectors/downloads/downloads-list.selector';

export class DownloadsListPage extends BasePage {
  readonly tableContainer: Locator;
  readonly btnRefresh: Locator;

  constructor(page: Page) {
    super(page);

    this.tableContainer = page.locator(S.tableContainer);
    this.btnRefresh = page.locator(S.btnRefresh);
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  async expectPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/download$/);

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

  async clickRefresh(): Promise<void> {
    await this.btnRefresh.click().catch(() => {});
    await this.waitForLoading();
  }

  /**
   * Mengembalikan locator untuk baris report terbaru yang berstatus "Ready".
   */
  getLatestReadyReport(reportName: string): Locator {
    return this.page
      .locator('table tbody tr')
      .filter({ hasText: reportName })
      .filter({ hasText: /ready/i })
      .first();
  }

  // ── Private ────────────────────────────────────────────────────────────────

  /**
   * Executes a click on the given button while racing a popup download
   * event (Scenario A) against a direct page download event (Scenario B).
   *
   * The application triggers downloads via window.open(presignedS3Url)
   * which opens a popup. The `download` event fires on the popup object,
   * NOT on the main page. Scenario A (popup) must be first in the race.
   */
  private async handleDownloadClick(btn: Locator): Promise<Download> {
    await btn.scrollIntoViewIfNeeded();
    await expect(btn).toBeVisible({ timeout: 10_000 });

    const [result] = await Promise.all([
      Promise.race([
        // Scenario A: window.open → popup → download on popup ❮ FIRST
        this.page.waitForEvent('popup', { timeout: 15_000 }).then(async (popup) => {
          console.log(`[Download] Popup opened: ${popup.url()}`);
          const dl = await popup.waitForEvent('download', { timeout: 15_000 });
          await popup.close().catch(() => {});
          return dl;
        }),

        // Scenario B: direct download on main page (fallback)
        this.page.waitForEvent('download', { timeout: 15_000 }),
      ]),
      btn.click(),
    ]);

    console.log(`✅ Downloaded: ${result.suggestedFilename()}`);
    return result;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Menunggu status file menjadi Ready, scrolls the action column into view,
   * then clicks the download icon and returns the resulting Download object.
   *
   * @param reportName - fragment of the report name heading text
   */
  async downloadReport(reportName: string): Promise<Download> {
    const latestReport = this.getLatestReadyReport(reportName);

    await expect(
      latestReport,
      `Report "${reportName}" terbaru harus berstatus Ready untuk diunduh`
    ).toBeVisible({ timeout: 30_000 });

    // Use selector constant — HTML uses <span role="presentation"><svg>
    const downloadIcon = latestReport.locator(S.btnDownloadFile).first();
    return this.handleDownloadClick(downloadIcon);
  }
}
