import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { TopbarSelector as S } from '../../selectors/layout/topbar.selector';
import { DownloadsPopup } from '../components/DownloadsPopup';

export class TopbarPage extends BasePage {
  readonly iconDownload: Locator;
  readonly dropdownContainer: Locator;
  readonly btnShowAllDownloads: Locator;
  readonly downloads: DownloadsPopup;

  constructor(page: Page) {
    super(page);

    this.iconDownload = page.locator(S.iconDownload);
      
    // ✅ Tetap pakai h3 — ini sudah benar
    this.dropdownContainer = page.getByRole('heading', { name: 'Downloads', level: 1 });

    this.btnShowAllDownloads = page.locator(S.btnShowAllDownloads);

    this.downloads = new DownloadsPopup(page);
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async clickDownloadIcon(): Promise<void> {
    await expect(this.iconDownload).toBeVisible();
    await this.iconDownload.click();
  }

  async openDownloads(): Promise<void> {
    await expect(this.iconDownload).toBeVisible();
    await this.iconDownload.click();
    await expect(this.downloads.title).toBeVisible({ timeout: 5000 });
  }

  async goToShowAllDownloads(): Promise<void> {
    if (await this.dropdownContainer.isVisible().catch(() => false)) {
      await this.iconDownload.click();
      await expect(this.dropdownContainer).toBeHidden({ timeout: 2000 });
    }

    await expect(this.iconDownload).toBeVisible();
    await this.iconDownload.click();
    
    await expect(
      this.dropdownContainer,
      'Dropdown Recent Downloads harus terbuka'
    ).toBeVisible({ timeout: 5000 });
    
    await this.btnShowAllDownloads.click();
  }
}
