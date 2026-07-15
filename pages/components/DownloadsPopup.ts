import { Page, Locator, expect } from '@playwright/test';

export class DownloadsPopup {
    readonly title: Locator;
    readonly firstDownload: Locator;

    constructor(private page: Page) {
        this.title = this.page.getByRole('heading', { name: 'Recent Downloads' });
        this.firstDownload = this.page.getByRole('button', { name: 'Download', exact: true }).first();
    }

    async downloadLatest() {
        await expect(this.title).toBeVisible();
        
        // Memberikan jeda 2500ms agar proses klik tombol download terlihat jelas
        await this.page.waitForTimeout(2500);
        await this.firstDownload.click();
    }
}
