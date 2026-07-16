import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export abstract class BaseTransactionPage extends BasePage {
  abstract readonly pageHeading: Locator;
  abstract readonly tableContainer: Locator;
  abstract readonly btnExportIcon: Locator;
  abstract readonly menuExportThisPage: Locator;
  abstract readonly menuExportAllPage: Locator;
  abstract readonly toastExportStarted: Locator;
  abstract readonly filterStatus: Locator;
  abstract readonly btnApplyFilter: Locator;

  constructor(page: Page) {
    super(page);
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async applyFilter(status: string): Promise<void> {
    await this.filterStatus.selectOption({ label: status });
    await this.btnApplyFilter.click();
    await this.waitForLoading();
  }

  async exportThisPage(): Promise<void> {
    await this.btnExportIcon.click();
    await this.menuExportThisPage.click();
    await this.page.keyboard.press('Escape');
  }

  async exportAllPages(): Promise<void> {
    await this.btnExportIcon.click();
    await this.menuExportAllPage.click();
    await this.page.keyboard.press('Escape');
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  async expectExportStartedToast(): Promise<void> {
    await expect(
      this.toastExportStarted,
      'Toast notifikasi Export Started harus muncul'
    ).toBeVisible({ timeout: 10_000 });
  }

  async expectTableVisible(pageName: string = 'Transaction'): Promise<void> {
    await expect(
      this.tableContainer,
      `${pageName}: tabel data harus tampil setelah load`
    ).toBeVisible({ timeout: 15_000 });
  }

  async expectPageLoaded(pageName: string = 'Transaction'): Promise<void> {
    await expect(
      this.pageHeading,
      `${pageName}: page heading harus terlihat`
    ).toBeVisible({ timeout: 15_000 });
  }
}
