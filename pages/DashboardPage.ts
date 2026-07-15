import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { DashboardSelector as S } from '../selectors/dashboard.selector';

export class DashboardPage extends BasePage {
  readonly dashboardContainer: Locator;
  readonly generateQRLink: Locator;
  readonly menuIcon: Locator;
  readonly navMenu: Locator;
  readonly merchantName: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardContainer = page.locator(S.dashboardContainer);
    this.generateQRLink = page.locator(S.generateQRLink);
    this.menuIcon = page.locator(S.menuIcon);
    this.navMenu = page.locator(S.navMenu);
    this.merchantName = page.locator(S.merchantName);
  }

  async goto(): Promise<void> {
    await this.navigate('/dashboard');
  }

  async assertLoaded(): Promise<void> {
    // Wait directly for the dashboard container to be visible without relying on networkidle
    await expect(this.dashboardContainer).toBeVisible({ timeout: 15_000 });
  }

  async goToGenerateQR(): Promise<void> {
    await this.generateQRLink.click();
  }

  async goToQrGenerate(): Promise<void> {
    await this.goToGenerateQR();
  }

  async openMobileMenu(): Promise<void> {
    await this.menuIcon.click();
    await expect(this.navMenu).toBeVisible();
  }

  async getMerchantName(): Promise<string> {
    return (await this.merchantName.textContent()) || '';
  }
}