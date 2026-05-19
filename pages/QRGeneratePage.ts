import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { QRGenerateSelector as S } from '../selectors/qr-generate.selector';

export class QRGeneratePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/qr/generate');
    await this.page.waitForSelector(S.form);
  }

  async assertLoaded(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.locator(S.form)).toBeVisible();
  }

  async fillForm(data: {
    merchantId?: string;
    amount: string;
    description?: string;
  }): Promise<void> {
    if (data.merchantId) {
      await this.page.selectOption(S.merchantSelect, data.merchantId);
    }
    await this.page.fill(S.amountInput, data.amount);
    if (data.description) {
      await this.page.fill(S.descriptionInput, data.description);
    }
  }

  async clickGenerate(): Promise<void> {
    await this.page.click(S.generateButton);
  }

  async generateQR(data: {
    merchantId?: string;
    amount: string;
    description?: string;
  }): Promise<void> {
    await this.fillForm(data);
    await this.clickGenerate();
  }

  async uploadBulkCsv(filePath: string): Promise<void> {
    await this.page.setInputFiles(S.fileInput, filePath);
  }

  async submitBulk(): Promise<void> {
    await this.page.click(S.submitBulkButton);
  }

  async waitForQR(timeout = 15000): Promise<void> {
    await this.page.waitForSelector(S.qrImage, { timeout });
  }

  async expectQRVisible(): Promise<void> {
    await expect(this.page.locator(S.qrImage)).toBeVisible();
  }

  async expectError(message?: string): Promise<void> {
    const error = this.page.locator(S.errorMessage);
    await expect(error).toBeVisible();
    if (message) {
      await expect(error).toContainText(message);
    }
  }

  async screenshotQR(filename: string): Promise<void> {
    const qr = this.page.locator(S.qrImage);
    await qr.screenshot({ path: `results/screenshots/${filename}.png` });
  }

  async getReferenceNo(): Promise<string> {
    return this.getText(S.referenceNo);
  }

  async getMerchantName(): Promise<string> {
    return this.getText(S.merchantNameText);
  }

  async getQRContent(): Promise<string> {
    return this.getText(S.qrContent);
  }
}