import { Page, Locator, expect } from '@playwright/test';

export class DownloadsPopup {
    readonly title: Locator;
    readonly firstDownload: Locator;

    constructor(private page: Page) {
        this.title = this.page.getByRole('heading', { name: 'Recent Downloads' });
        this.firstDownload = this.page.getByRole('button', { name: 'Download', exact: true }).first();
    }

    async downloadLatest(): Promise<import('@playwright/test').Download> {
        await expect(this.title).toBeVisible();
        
        await this.page.waitForTimeout(2500);

        // ✅ waitForEvent('download') intercepts at network level
        // → prevents new tab from opening entirely
        const [download] = await Promise.all([
            this.page.waitForEvent('download', { timeout: 30_000 }),
            this.firstDownload.click(),
        ]);

        return download;
    }
}
