/**
 * @file create-merchant.spec.ts
 * @description E2E tests for the "Buat Merchant" feature.
 *
 * Tags used:
 *  @smoke      — critical happy-path, runs in every pipeline stage
 *  @regression — full regression suite
 *  @positive   — expected-success scenarios
 *  @negative   — expected-failure / validation scenarios
 *
 * TC IDs:
 *  TC-012 — Tambah merchant dengan Full Plan berhasil   [@positive @smoke]
 *  TC-013 — Tambah merchant dengan POS Plan berhasil    [@positive @regression]
 *  TC-037 — Simpan tanpa Nama Company → validation msg  [@negative @regression]
 *  TC-039 — Input MID duplicate → error MID terdaftar   [@negative @regression]
 *
 * Coding standards followed (COPILOT_INSTRUCTIONS.md):
 *  - POM only — no raw locators in spec
 *  - expect() has descriptive error messages on every call
 *  - No page.waitForTimeout — all waits via expect + timeout
 *  - Soft assertions for non-blocking checks
 *  - Screenshot attachment after each critical assertion
 *  - Test metadata attachment (tc_id, feature, priority) per test
 *  - 2 retries on CI, 0 on local
 */

import { test, expect } from '../../fixtures/tenant-framework.fixture';
import { MerchantListPage } from '../../pages/merchant/MerchantListPage';
import { MerchantFormPage } from '../../pages/merchant/MerchantFormPage';
import { generateMid, attachTestMetadata, attachScreenshot } from '../../utils/test-helper';

// ─── Shared Setup ─────────────────────────────────────────────────────────────

test.describe('User Management - Merchant @regression', () => {

  let listPage: MerchantListPage;
  let formPage: MerchantFormPage;

  test.beforeEach(async ({ page }) => {
    listPage = new MerchantListPage(page);
    formPage = new MerchantFormPage(page);

    await listPage.goto();
    await listPage.expectPageLoaded();
  });

  // ── TC-012 ────────────────────────────────────────────────────────────────

  test(
    '[TC-012] Tambah merchant dengan Full Plan berhasil @positive @smoke',
    async ({ page, logger }) => {

      // ── Metadata attachment ──────────────────────────────────────────
      await attachTestMetadata(test.info(), {
        tc_id:    'TC-012',
        feature:  'User Management - Merchant',
        priority: 'High',
      });

      const mid = generateMid();

      await test.step('Open form', async () => {
        await listPage.clickBuatMerchant();
        await formPage.expectFormVisible();
        await attachScreenshot(page, test.info(), 'TC012_01_form_opened');
        logger.step(1, 'Form opened successfully');
      });

      await test.step('Fill & submit', async () => {
        await formPage.fillAndSubmit({
          namaCompany: 'PT Automation Full Plan',
          mid,
          plan: 'Full Plan',
        });
        logger.step(2, 'Form submitted with Full Plan');
      });

      await test.step('Verify success toast', async () => {
        await expect(
          page.getByRole('alert'),
          '[TC-012] Success toast should appear after creating a Full Plan merchant',
        ).toBeVisible({ timeout: 10_000 });
        await attachScreenshot(page, test.info(), 'TC012_02_success_toast');
        logger.pass('Success toast verified');
      });

      await test.step('Verify merchant in list', async () => {
        await expect
          .soft(
            page.getByRole('cell', { name: 'PT Automation Full Plan' }),
            '[TC-012] New merchant "PT Automation Full Plan" should appear in the merchant list',
          )
          .toBeVisible({ timeout: 10_000 });
        await attachScreenshot(page, test.info(), 'TC012_03_merchant_in_list');
        logger.pass('Merchant visible in list');
      });
    },
  );

  // ── TC-013 ────────────────────────────────────────────────────────────────

  test(
    '[TC-013] Tambah merchant dengan POS Plan berhasil @positive @regression',
    async ({ page, logger }) => {

      await attachTestMetadata(test.info(), {
        tc_id:    'TC-013',
        feature:  'User Management - Merchant',
        priority: 'High',
      });

      const mid = generateMid();

      await test.step('Open form', async () => {
        await listPage.clickBuatMerchant();
        await formPage.expectFormVisible();
        await attachScreenshot(page, test.info(), 'TC013_01_form_opened');
        logger.step(1, 'Form opened successfully');
      });

      await test.step('Fill & submit', async () => {
        await formPage.fillAndSubmit({
          namaCompany: 'PT Automation POS Plan',
          mid,
          plan: 'POS Plan',
        });
        logger.step(2, 'Form submitted with POS Plan');
      });

      await test.step('Verify success toast', async () => {
        await expect(
          page.getByRole('alert'),
          '[TC-013] Success toast should appear after creating a POS Plan merchant',
        ).toBeVisible({ timeout: 10_000 });
        await attachScreenshot(page, test.info(), 'TC013_02_success_toast');
        logger.pass('Success toast verified');
      });

      await test.step('Verify merchant in list', async () => {
        await expect
          .soft(
            page.getByRole('cell', { name: 'PT Automation POS Plan' }),
            '[TC-013] New merchant "PT Automation POS Plan" should appear in the merchant list',
          )
          .toBeVisible({ timeout: 10_000 });
        await attachScreenshot(page, test.info(), 'TC013_03_merchant_in_list');
        logger.pass('Merchant visible in list');
      });
    },
  );

  // ── TC-037 ────────────────────────────────────────────────────────────────

  test(
    '[TC-037] Simpan merchant tanpa mengisi Nama Company — harus muncul validation message @negative @regression',
    async ({ page, logger }) => {

      await attachTestMetadata(test.info(), {
        tc_id:    'TC-037',
        feature:  'User Management - Merchant',
        priority: 'Medium',
      });

      await test.step('Open form', async () => {
        await listPage.clickBuatMerchant();
        await formPage.expectFormVisible();
      });

      await test.step('Submit without filling Nama Company', async () => {
        await formPage.inputMid.fill(generateMid());
        await formPage.selectPlan('Full Plan');
        await formPage.btnSimpan.click();
        await attachScreenshot(page, test.info(), 'TC037_01_submitted_empty_nama');
        logger.step(1, 'Submitted without Nama Company');
      });

      await test.step('Verify validation message', async () => {
        await formPage.expectNamaCompanyRequired();
        await attachScreenshot(page, test.info(), 'TC037_02_validation_message_visible');
        logger.pass('Validation message displayed correctly');
      });

      await test.step('Verify form remains open', async () => {
        await expect
          .soft(
            formPage.btnSimpan,
            '[TC-037] Form should remain open — must not navigate away on validation failure',
          )
          .toBeVisible({ timeout: 5_000 });
        logger.pass('Form remained open');
      });
    },
  );

  // ── TC-039 ────────────────────────────────────────────────────────────────

  test(
    '[TC-039] Input MID duplicate — harus muncul error MID sudah terdaftar @negative @regression',
    async ({ page, logger }) => {

      await attachTestMetadata(test.info(), {
        tc_id:    'TC-039',
        feature:  'User Management - Merchant',
        priority: 'High',
      });

      const KNOWN_DUPLICATE_MID = process.env['DUPLICATE_MID'] ?? 'DUPLICATE001';

      await test.step('Open form', async () => {
        await listPage.clickBuatMerchant();
        await formPage.expectFormVisible();
      });

      await test.step('Fill with duplicate MID', async () => {
        await formPage.fillAndSubmit({
          namaCompany: 'PT Test Duplicate MID',
          mid:         KNOWN_DUPLICATE_MID,
          plan:        'Full Plan',
        });
        await attachScreenshot(page, test.info(), 'TC039_01_submitted_duplicate_mid');
        logger.step(1, 'Submitted with duplicate MID');
      });

      await test.step('Verify duplicate error', async () => {
        await formPage.expectMidDuplicateError();
        await attachScreenshot(page, test.info(), 'TC039_02_duplicate_error_visible');
        logger.pass('Duplicate MID error displayed');
      });

      await test.step('Verify form remains open', async () => {
        await expect
          .soft(
            formPage.btnSimpan,
            '[TC-039] Form should remain open after a duplicate MID submission',
          )
          .toBeVisible({ timeout: 5_000 });
        logger.pass('Form remained open');
      });
    },
  );

});
