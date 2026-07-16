/**
 * Outgoing Transaction Flow — Test Suite
 *
 * Uses poppay-framework.fixture which provides:
 *  - Auto login / logout (poppay-auth.fixture)
 *  - Auto failure screenshot (framework.fixture)
 *  - Structured file logging per test (framework.fixture)
 *  - Universal download validator (framework.fixture)
 */

import { test, expect }              from '../../fixtures/poppay-framework.fixture';
import { OutgoingTransactionPage }   from '../../pages/transaction/OutgoingTransactionPage';
import { TopbarPage }                from '../../pages/layout/TopbarPage';
import { DownloadsListPage }         from '../../pages/downloads/DownloadsListPage';
import { attachTestMetadata }        from '../../utils/test-helper';
import { milestone }                 from '../../utils/ScreenshotHelper';

test.describe('Outgoing Transaction Flow @regression', () => {

  let outgoingPage:  OutgoingTransactionPage;
  let topbarPage:    TopbarPage;
  let downloadsPage: DownloadsListPage;

  test.beforeEach(async ({ page }) => {
    outgoingPage  = new OutgoingTransactionPage(page);
    topbarPage    = new TopbarPage(page);
    downloadsPage = new DownloadsListPage(page);
    await outgoingPage.gotoViaSidebar();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-OUT-001 — Validasi menampilkan data Outgoing Transaction
  // ─────────────────────────────────────────────────────────────────────────

  test('[TC-OUT-001] Validasi menampilkan data Outgoing Transaction @positive', async ({ page, logger }) => {
    const testInfo = test.info();
    await attachTestMetadata(testInfo, { tc_id: 'TC-OUT-001', feature: 'Outgoing Transaction', priority: 'High' });

    await test.step('Validate Outgoing Transaction page loaded', async () => {
      logger.step(1, 'Validate Outgoing Transaction page loaded');
      await outgoingPage.expectPageLoaded();
      logger.pass('Outgoing Transaction page displayed');
    });

    await test.step('Validate transaction table visible', async () => {
      logger.step(2, 'Validate transaction table visible');
      await outgoingPage.expectTableVisible();
      logger.pass('Transaction table is visible');
    });

    await milestone(page, testInfo, 'TC-OUT-001_Transaction_Loaded');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-OUT-002 — Validasi filter data Outgoing Transaction
  // ─────────────────────────────────────────────────────────────────────────

  test('[TC-OUT-002] Validasi filter data Outgoing Transaction @positive', async ({ page, logger }) => {
    const testInfo = test.info();
    await attachTestMetadata(testInfo, { tc_id: 'TC-OUT-002', feature: 'Outgoing Transaction', priority: 'Medium' });

    await test.step('Apply Status filter: Success', async () => {
      logger.step(1, 'Apply Status filter: Success');
      await outgoingPage.applyFilter('Success');
      logger.pass('Filter applied: Success');
    });

    await test.step('Validate filtered table visible', async () => {
      logger.step(2, 'Validate filtered table visible');
      await outgoingPage.expectTableVisible();
      logger.pass('Filtered table is visible');
    });

    await milestone(page, testInfo, 'TC-OUT-002_Filter_Applied');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-OUT-003 — Validasi Async Download (User Flow via Recent Downloads popup)
  // ─────────────────────────────────────────────────────────────────────────

  test('[TC-OUT-003] Validasi fitur Async Download (S3) data Outgoing (User Flow) @positive', async ({ page, logger, downloadValidator }) => {
    const testInfo = test.info();
    await attachTestMetadata(testInfo, { tc_id: 'TC-OUT-003', feature: 'Outgoing Transaction', priority: 'High' });

    await test.step('Export All Pages', async () => {
      logger.step(1, 'Export All Pages');
      await outgoingPage.exportAllPages();
      logger.pass('Export All Pages triggered');
    });

    await test.step('Validate Export Started toast', async () => {
      logger.step(2, 'Validate Export Started toast');
      await outgoingPage.expectExportStartedToast();
      logger.pass('Toast Export Started displayed');
      await milestone(page, testInfo, 'TC-OUT-003_Export_Started');
    });

    await test.step('Open Recent Downloads popup', async () => {
      logger.step(3, 'Open Recent Downloads popup');
      await topbarPage.openDownloads();
      logger.pass('Downloads popup opened');
      await milestone(page, testInfo, 'TC-OUT-003_Downloads_Popup');
    });

    let download: import('@playwright/test').Download;

    await test.step('Download latest report from popup', async () => {
      logger.step(4, 'Download latest report from popup');
      const downloadPromise = page.waitForEvent('download');
      await topbarPage.downloads.downloadLatest();
      download = await downloadPromise;
      logger.pass('Download button clicked');
    });

    await test.step('Validate downloaded CSV', async () => {
      logger.step(5, 'Validate downloaded CSV');
      const result = await downloadValidator.validate(download, 'csv');
      expect(result.filename, '[TC-OUT-003] File must be a CSV').toMatch(/\.csv$/i);
      expect(result.isValid, '[TC-OUT-003] Download must be valid').toBe(true);
      await milestone(page, testInfo, 'TC-OUT-003_Download_Complete');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TC-OUT-004 — Validasi Async Download (Show All Downloads page)
  // ─────────────────────────────────────────────────────────────────────────

  test('[TC-OUT-004] Validasi fitur Async Download (S3) data Outgoing (Show All Downloads) @positive', async ({ page, logger, downloadValidator }) => {
    const testInfo = test.info();
    await attachTestMetadata(testInfo, { tc_id: 'TC-OUT-004', feature: 'Outgoing Transaction', priority: 'High' });

    await test.step('Export This Page', async () => {
      logger.step(1, 'Export This Page');
      await outgoingPage.exportThisPage();
      logger.pass('Export This Page triggered');
    });

    await test.step('Validate Export Started toast', async () => {
      logger.step(2, 'Validate Export Started toast');
      await outgoingPage.expectExportStartedToast();
      logger.pass('Toast Export Started displayed');
      await milestone(page, testInfo, 'TC-OUT-004_Export_Started');
    });

    await test.step('Navigate to Show All Downloads', async () => {
      logger.step(3, 'Navigate to Show All Downloads');
      await topbarPage.goToShowAllDownloads();
      logger.pass('Navigated to Downloads page');
      await milestone(page, testInfo, 'TC-OUT-004_Downloads_Page');
    });

    await test.step('Validate Downloads page loaded', async () => {
      logger.step(4, 'Validate Downloads page loaded');
      await downloadsPage.expectPageLoaded();
      await downloadsPage.expectTableVisible();
      logger.pass('Downloads page loaded');
    });

    await test.step('Wait for OUTBOUND report to be Ready', async () => {
      logger.step(5, 'Wait for OUTBOUND report to be Ready');
      const latestRow = downloadsPage.getLatestReadyReport('OUTBOUND Transaction Report');
      await expect(latestRow, 'Latest OUTBOUND report must have status Ready').toBeVisible({ timeout: 30_000 });
      logger.pass('Latest report status = Ready');
      await milestone(page, testInfo, 'TC-OUT-004_Report_Ready');
    });

    await test.step('Download report and validate', async () => {
      logger.step(6, 'Download report and validate');
      const downloadPromise = page.waitForEvent('download');
      await downloadsPage.downloadReport('OUTBOUND Transaction Report');
      const download = await downloadPromise;

      const result = await downloadValidator.validate(download, 'csv');
      expect(result.filename, '[TC-OUT-004] Filename must not be empty').toBeTruthy();
      expect(result.isValid, '[TC-OUT-004] Download must be valid').toBe(true);
      logger.pass(`CSV downloaded: ${result.filename}  (${result.sizePretty})`);
      await milestone(page, testInfo, 'TC-OUT-004_Download_Complete');
    });
  });

});
