import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { DashboardSelector as S } from '../selectors/dashboard.selector';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/dashboard');
  }

  async assertLoaded(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.locator(S.dashboardContainer)).toBeVisible();
  }

  async goToGenerateQR(): Promise<void> {
    await this.page.click(S.generateQRLink);
  }

  async goToQrGenerate(): Promise<void> {
    await this.goToGenerateQR();
  }

  async openMobileMenu(): Promise<void> {
    await this.page.click(S.menuIcon);
    await expect(this.page.locator(S.navMenu)).toBeVisible();
  }

  async getMerchantName(): Promise<string> {
    return this.getText(S.merchantName);
  }
}