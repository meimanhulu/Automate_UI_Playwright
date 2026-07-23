/**
 * Incoming Transaction Flow — Test Suite
 *
 * Uses test.describe.serial with shared page (single login for all TCs).
 * Imports from framework.fixture to get: logger, downloadValidator.
 * Auto failure screenshot is handled via test.afterEach (shared page pattern).
 */

import { test, expect }                      from '../../fixtures/framework.fixture';
import { attachPopupAutoClose }              from '../../fixtures/base.fixture';
import type { Download, Page } from '@playwright/test';
import { IncomingTransactionPage }      from '../../pages/transaction/IncomingTransactionPage';
import { TopbarPage }                   from '../../pages/layout/TopbarPage';
import { DownloadsListPage }            from '../../pages/downloads/DownloadsListPage';
import { LoginLogoutPage }              from '../../pages/LoginLogoutPage';
import { attachTestMetadata }           from '../../utils/test-helper';
import { milestone }                    from '../../utils/ScreenshotHelper';
import { assertVisible, assertText }    from '../../utils/AssertionHelper';


// ─── Shared state (one login for all TCs in this file) ────────────────────────

test.describe.serial('Incoming Transaction Flow @regression', () => {
  let page:          Page;
  let incomingPage:  IncomingTransactionPage;
  let topbarPage:    TopbarPage;
  let downloadsPage: DownloadsListPage;

  // ── Login once before all TCs ─────────────────────────────────────────────

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(60_000);
    // Use browser.newPage() so the config `use` block is inherited
    // (viewport: null + --start-maximized). A manually created context
    // would lose those and open at default 1280x720, collapsing the sidebar.
    page = await browser.newPage();

    // Attach popup handler AFTER the main page exists — download-aware,
    // won't close a popup that's actively downloading a file.
    attachPopupAutoClose(page);

    const loginPage = new LoginLogoutPage(page);
    await loginPage.navigate('https://uat.pg-poppay.com/login');

    const email    = process.env.POPPAY_USERNAME ?? 'ryland@manjo.co.id';
    const password = process.env.POPPAY_PASSWORD ?? 'Ryland2026';

    await loginPage.login(email, password);
    await loginPage.expectLoginSuccess();

    incomingPage  = new IncomingTransactionPage(page);
    topbarPage    = new TopbarPage(page);
    downloadsPage = new DownloadsListPage(page);

    await incomingPage.gotoViaSidebar();
  });

  // ── Logout once after all TCs ─────────────────────────────────────────────

  test.afterAll(async () => {
    try {
      if (!page.isClosed()) {
        await page.waitForTimeout(2000).catch(() => {});
        await new LoginLogoutPage(page).logout().catch(() => {});
        await page.waitForTimeout(1500).catch(() => {});
      }
    } catch (e) {
      console.warn('[afterAll] Auto-logout failed:', e);
    }
  });

  // ── Auto screenshot on failure for shared page ────────────────────────────
  // The _autoScreenshot fixture from framework.fixture uses the fixture's own
  // page instance. For this serial suite we use the shared page, so we add
  // an explicit afterEach to capture the shared page on failure.
  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      try {
        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach(`❌ FAIL — ${testInfo.title}`, {
          body:        screenshot,
          contentType: 'image/png',
        });
      } catch { /* page may be closed */ }
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-INC-001 — Validasi menampilkan data Incoming Transaction
  // ─────────────────────────────────────────────────────────────────────────

  test('[TC-INC-001] Validasi menampilkan data Incoming Transaction @positive', async ({ logger }) => {
    const testInfo = test.info();
    await attachTestMetadata(testInfo, { tc_id: 'TC-INC-001', feature: 'Incoming Transaction', priority: 'High' });

    await test.step('Validate Incoming Transaction page loaded', async () => {
      logger.step(1, 'Validate Incoming Transaction page loaded');
      await incomingPage.expectPageLoaded();
      logger.pass('Incoming Transaction page displayed');
    });

    await test.step('Validate transaction table visible', async () => {
      logger.step(2, 'Validate transaction table visible');
      await incomingPage.expectTableVisible();
      logger.pass('Transaction table is visible');
    });

    await milestone(page, testInfo, 'TC-INC-001_Transaction_Loaded');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-INC-002 — Validasi filter data Incoming Transaction
  // ─────────────────────────────────────────────────────────────────────────

  test('[TC-INC-002] Validasi filter data Incoming Transaction @positive', async ({ logger }) => {
    const testInfo = test.info();
    await attachTestMetadata(testInfo, { tc_id: 'TC-INC-002', feature: 'Incoming Transaction', priority: 'Medium' });

    await test.step('Apply Status filter: Success', async () => {
      logger.step(1, 'Apply Status filter: Success');
      await incomingPage.applyFilter('Success');
      logger.pass('Filter applied: Success');
    });

    await test.step('Validate filtered table visible', async () => {
      logger.step(2, 'Validate filtered table visible');
      await incomingPage.expectTableVisible();
      logger.pass('Filtered table is visible');
    });

    await milestone(page, testInfo, 'TC-INC-002_Filter_Applied');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-INC-003 — Validasi Async Download (User Flow via Recent Downloads popup)
  // ─────────────────────────────────────────────────────────────────────────

  test('[TC-INC-003] Validasi fitur Async Download (S3) data Incoming (User Flow) @positive', async ({ logger, downloadValidator }) => {
    test.setTimeout(60_000);
    const testInfo = test.info();
    await attachTestMetadata(testInfo, { tc_id: 'TC-INC-003', feature: 'Incoming Transaction', priority: 'High' });

    await test.step('Export All Pages', async () => {
      logger.step(1, 'Export All Pages');
      await incomingPage.exportAllPages();
      logger.pass('Export All Pages triggered');
    });

    await test.step('Validate Export Started toast', async () => {
      logger.step(2, 'Validate Export Started toast');
      await incomingPage.expectExportStartedToast();
      logger.pass('Toast Export Started displayed');
      await milestone(page, testInfo, 'TC-INC-003_Export_Started');
    });

    await test.step('Open Recent Downloads popup', async () => {
      logger.step(3, 'Open Recent Downloads popup');
      await topbarPage.openDownloads();
      logger.pass('Downloads popup opened');
      await milestone(page, testInfo, 'TC-INC-003_Downloads_Popup');
    });

    let download: Download;

    await test.step('Download latest report from popup', async () => {
      logger.step(4, 'Download latest report from popup');
      download = await topbarPage.downloads.downloadLatest();
      logger.pass('Download button clicked');
    });

    await test.step('Validate downloaded CSV', async () => {
      logger.step(5, 'Validate downloaded CSV');
      const result = await downloadValidator.validate(download, 'csv');
      expect(result.filename, '[TC-INC-003] File must be a CSV').toMatch(/\.csv$/i);
      expect(result.isValid, '[TC-INC-003] Download must be valid').toBe(true);
      logger.pass(`CSV downloaded: ${result.filename}  (${result.sizePretty})`);
      await milestone(page, testInfo, 'TC-INC-003_Download_Complete');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-INC-004 — Validasi Async Download (Show All Downloads page)
  // ─────────────────────────────────────────────────────────────────────────

  test('[TC-INC-004] Validasi fitur Async Download (S3) data Incoming (Show All Downloads) @positive', async ({ logger, downloadValidator }) => {
    test.setTimeout(60_000);
    const testInfo = test.info();
    await attachTestMetadata(testInfo, { tc_id: 'TC-INC-004', feature: 'Incoming Transaction', priority: 'High' });

    await test.step('Ensure Incoming Transaction page is ready', async () => {
      logger.step(0, 'Verify page state after TC-003');
      await page.waitForURL(/.*\/incoming/, { timeout: 10_000 });
      await incomingPage.ensurePageReady();
      logger.pass('Incoming Transaction page is ready');
    });

    await test.step('Export This Page', async () => {
      logger.step(1, 'Export This Page');
      await incomingPage.exportThisPage();
      logger.pass('Export This Page triggered');
    });

    await test.step('Validate Export Started toast', async () => {
      logger.step(2, 'Validate Export Started toast');
      await incomingPage.expectExportStartedToast();
      logger.pass('Toast Export Started displayed');
      await milestone(page, testInfo, 'TC-INC-004_Export_Started');
    });

    await test.step('Navigate to Show All Downloads', async () => {
      logger.step(3, 'Navigate to Show All Downloads');
      await topbarPage.goToShowAllDownloads();
      logger.pass('Navigated to Downloads page');
      await milestone(page, testInfo, 'TC-INC-004_Downloads_Page');
    });

    await test.step('Validate Downloads page loaded', async () => {
      logger.step(4, 'Validate Downloads page loaded');
      await downloadsPage.expectPageLoaded();
      await downloadsPage.expectTableVisible();
      logger.pass('Downloads page loaded');
    });

    await test.step('Wait for INBOUND report to be Ready', async () => {
      logger.step(5, 'Wait for INBOUND report to be Ready');
      const latestRow = downloadsPage.getLatestReadyReport('INBOUND Transaction Report');
      await expect(latestRow, 'Latest INBOUND report must have status Ready').toBeVisible({ timeout: 30_000 });
      logger.pass('Latest report status = Ready');
      await milestone(page, testInfo, 'TC-INC-004_Report_Ready');
    });

    await test.step('Download report and validate', async () => {
      logger.step(6, 'Download report and validate');
      const download = await downloadsPage.downloadReport('INBOUND Transaction Report');

      const result = await downloadValidator.validate(download, 'csv');
      expect(result.filename, '[TC-INC-004] Filename must not be empty').toBeTruthy();
      expect(result.isValid, '[TC-INC-004] Download must be valid').toBe(true);
      logger.pass(`CSV downloaded: ${result.filename}  (${result.sizePretty})`);
      await milestone(page, testInfo, 'TC-INC-004_Download_Complete');
    });
  });

});
