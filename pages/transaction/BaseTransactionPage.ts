import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export abstract class BaseTransactionPage extends BasePage {
  abstract readonly pageHeading: Locator;
  abstract readonly tableContainer: Locator;
  abstract readonly btnExportIcon: Locator;
  abstract readonly menuExportThisPage: Locator;
  abstract readonly menuExportAllPage: Locator;
  abstract readonly toastExportStarted: Locator;
  abstract readonly btnFilter: Locator;
  abstract readonly filterStatus: Locator;
  abstract readonly btnApplyFilter: Locator;

  constructor(page: Page) {
    super(page);
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async applyFilter(status: string): Promise<void> {
    await this.btnFilter.click();
    await this.page.waitForTimeout(1000);
    await this.filterStatus.click({ timeout: 10_000 });
    await this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option', { hasText: status }).click({ timeout: 10_000 });
    await this.btnApplyFilter.click();
    await this.waitForLoading();
  }

  async ensurePageReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: 10_000 });
    await expect(this.pageHeading, 'Page heading must be visible').toBeVisible();
    await expect(this.tableContainer, 'Table must be visible').toBeVisible();
    
    const loadingOverlay = this.page.locator('.loading-spinner, .ant-spin-spinning, [class*="loading"]');
    await expect(loadingOverlay, 'Loading overlay must be hidden').toBeHidden({ timeout: 5000 }).catch(() => {});
  }

  async exportThisPage(): Promise<void> {
    await this.clickExportMenu(this.menuExportThisPage);
  }

  async exportAllPages(): Promise<void> {
    await this.clickExportMenu(this.menuExportAllPage);
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private async clickExportMenu(menu: Locator): Promise<void> {
    await expect(this.btnExportIcon, 'Export button must be visible').toBeVisible({ timeout: 10_000 });
    await expect(this.btnExportIcon, 'Export button must be enabled').toBeEnabled();
    await this.btnExportIcon.scrollIntoViewIfNeeded();
    await this.btnExportIcon.click();

    await expect(menu, 'Export menu must be visible').toBeVisible({ timeout: 5000 });
    await menu.click();
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
