import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { DashboardSidebarSelector as S } from '../../selectors/dashboard/dashboard-sidebar.selector';

export type DashboardSubMenu = 'Generate QR';

export class DashboardSidebarPage extends BasePage {
  readonly menuDashboard: Locator;
  readonly subMenuGenerateQR: Locator;

  constructor(page: Page) {
    super(page);
    this.menuDashboard = page.locator(S.menuDashboard);
    this.subMenuGenerateQR = page.locator(S.subMenuGenerateQR);
  }

  async expandDashboardMenu(): Promise<void> {
    const isExpanded = await this.subMenuGenerateQR.isVisible().catch(() => false);
    if (!isExpanded) {
      await this.menuDashboard.click();
    }
  }

  async goToGenerateQR(): Promise<void> {
    await this.expandDashboardMenu();
    await this.subMenuGenerateQR.click();
    await this.waitForLoading();
    // Jeda 2.5 detik untuk memperlambat eksekusi secara visual
    await this.page.waitForTimeout(2500);
  }

  async goTo(subMenu: DashboardSubMenu): Promise<void> {
    switch (subMenu) {
      case 'Generate QR': await this.goToGenerateQR(); break;
    }
  }

  async expectDashboardMenuVisible(): Promise<void> {
    await expect(this.menuDashboard).toBeVisible({ timeout: 10_000 });
  }

  async expectDashboardMenuExpanded(): Promise<void> {
    await expect(this.subMenuGenerateQR).toBeVisible({ timeout: 8_000 });
  }
}
