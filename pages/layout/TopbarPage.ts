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

    // ✅ FIX: target langsung button "Downloads" dari snapshot
    this.iconDownload = page.getByRole('button', { name: 'Downloads' });
      
    // ✅ Tetap pakai h3 — ini sudah benar
    this.dropdownContainer = page.getByRole('heading', { name: 'Recent Downloads', level: 3 });

    this.btnShowAllDownloads = S.btnShowAllDownloads
      ? page.locator(S.btnShowAllDownloads)
      : page.getByRole('button', { name: /show all/i });

    this.downloads = new DownloadsPopup(page);
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async clickDownloadIcon(): Promise<void> {
    // Kita harus memastikan tidak tertutup toast
    await this.iconDownload.click({ force: true });
  }

  async openDownloads(): Promise<void> {
    await this.iconDownload.click();
    await expect(this.downloads.title).toBeVisible({ timeout: 5000 });
  }

  async goToShowAllDownloads(): Promise<void> {
    // ✅ Tunggu button ready sebelum klik
    await this.iconDownload.waitFor({ state: 'visible' });
    await this.iconDownload.click();
    
    // ✅ h3 akan visible setelah dropdown terbuka
    await expect(
      this.dropdownContainer,
      'Dropdown Recent Downloads harus terbuka'
    ).toBeVisible({ timeout: 5000 });
    
    // Klik tombol untuk ke halaman Downloads 
    // SPA Best Practice: Jangan tunggu waitForURL. Tunggu elemen UI saja di page object tujuan.
    await this.btnShowAllDownloads.click();
    
    // waitForLoading() dihapus karena DownloadsListPage.expectPageLoaded() 
    // akan mengambil alih tugas sinkronisasi dengan menunggu heading muncul.
  }
}
