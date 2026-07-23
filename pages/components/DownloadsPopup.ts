import { Page, Locator, expect, Download } from '@playwright/test';

export class DownloadsPopup {
    readonly title: Locator;

    constructor(private page: Page) {
        // The heading displayed after clicking the topbar Downloads icon
        this.title = this.page.getByRole('heading', { name: 'Downloads', level: 3 });
    }

    // ── Private helpers ────────────────────────────────────────────────────

    private getDownloadBtn(): Locator {
        return this.page.locator('button[title="Download"]').first();
    }

    /**
     * Executes a click on the given button while racing a popup download
     * event (Scenario A) against a direct page download event (Scenario B).
     *
     * The application triggers downloads via window.open(presignedS3Url)
     * which opens a popup. The `download` event fires on the popup object,
     * NOT on the main page. Scenario A (popup) must be first in the race.
     *
     * The download button may be CSS-hidden (e.g. Ant Design responsive
     * tables render a hidden DOM copy). force:true is required because
     * the element is genuinely not user-visible.
     */
    private async handleDownloadClick(btn: Locator): Promise<Download> {
        await btn.scrollIntoViewIfNeeded();

        const [result] = await Promise.all([
            Promise.race([
                // Scenario A: window.open → popup → download on popup ❮ FIRST
                this.page.waitForEvent('popup', { timeout: 15_000 }).then(async (popup) => {
                    console.log(`[Download] Popup opened: ${popup.url()}`);
                    const dl = await popup.waitForEvent('download', { timeout: 15_000 });
                    await popup.close().catch(() => {});
                    return dl;
                }),

                // Scenario B: direct download on main page (fallback)
                this.page.waitForEvent('download', { timeout: 15_000 }),
            ]),
            // Use evaluate to trigger the JavaScript click handler directly,
            // because the button element is CSS-hidden (Ant Design responsive
            // tables render hidden duplicates) and Playwright's actionability
            // checks may block the native click handler from firing.
            btn.evaluate((el: HTMLElement) => el.click()),
        ]);

        console.log(`✅ Downloaded: ${result.suggestedFilename()}`);
        return result;
    }

    // ── Public API ─────────────────────────────────────────────────────────

    /**
     * Verifies the "Downloads" heading is visible, then clicks the
     * first "Download" button and returns the resulting Download object.
     */
    async downloadLatest(): Promise<Download> {
        await expect(this.title).toBeVisible();

        const downloadBtn = this.getDownloadBtn();
        return this.handleDownloadClick(downloadBtn);
    }
}
