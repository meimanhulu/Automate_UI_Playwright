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

import { test, expect } from '@playwright/test';
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
    async ({ page }) => {

      // ── Metadata attachment ──────────────────────────────────────────
      await attachTestMetadata(test.info(), {
        tc_id:    'TC-012',
        feature:  'User Management - Merchant',
        priority: 'High',
      });

      const mid = generateMid();

      // ── Open form ────────────────────────────────────────────────────
      await listPage.clickBuatMerchant();
      await formPage.expectFormVisible();
      await attachScreenshot(page, test.info(), 'TC012_01_form_opened');

      // ── Fill & submit ────────────────────────────────────────────────
      await formPage.fillAndSubmit({
        namaCompany: 'PT Automation Full Plan',
        mid,
        plan: 'Full Plan',
      });

      // ── Critical assertion: success toast ────────────────────────────
      await expect(
        page.getByRole('alert'),
        '[TC-012] Success toast should appear after creating a Full Plan merchant',
      ).toBeVisible({ timeout: 10_000 });

      await attachScreenshot(page, test.info(), 'TC012_02_success_toast');

      // ── Soft assertion: merchant appears in list ─────────────────────
      await expect
        .soft(
          page.getByRole('cell', { name: 'PT Automation Full Plan' }),
          '[TC-012] New merchant "PT Automation Full Plan" should appear in the merchant list',
        )
        .toBeVisible({ timeout: 10_000 });

      await attachScreenshot(page, test.info(), 'TC012_03_merchant_in_list');
    },
  );

  // ── TC-013 ────────────────────────────────────────────────────────────────

  test(
    '[TC-013] Tambah merchant dengan POS Plan berhasil @positive @regression',
    async ({ page }) => {

      await attachTestMetadata(test.info(), {
        tc_id:    'TC-013',
        feature:  'User Management - Merchant',
        priority: 'High',
      });

      const mid = generateMid();

      // ── Open form ────────────────────────────────────────────────────
      await listPage.clickBuatMerchant();
      await formPage.expectFormVisible();
      await attachScreenshot(page, test.info(), 'TC013_01_form_opened');

      // ── Fill & submit ────────────────────────────────────────────────
      await formPage.fillAndSubmit({
        namaCompany: 'PT Automation POS Plan',
        mid,
        plan: 'POS Plan',
      });

      // ── Critical assertion: success toast ────────────────────────────
      await expect(
        page.getByRole('alert'),
        '[TC-013] Success toast should appear after creating a POS Plan merchant',
      ).toBeVisible({ timeout: 10_000 });

      await attachScreenshot(page, test.info(), 'TC013_02_success_toast');

      // ── Soft assertion: merchant appears in list ─────────────────────
      await expect
        .soft(
          page.getByRole('cell', { name: 'PT Automation POS Plan' }),
          '[TC-013] New merchant "PT Automation POS Plan" should appear in the merchant list',
        )
        .toBeVisible({ timeout: 10_000 });

      await attachScreenshot(page, test.info(), 'TC013_03_merchant_in_list');
    },
  );

  // ── TC-037 ────────────────────────────────────────────────────────────────

  test(
    '[TC-037] Simpan merchant tanpa mengisi Nama Company — harus muncul validation message @negative @regression',
    async ({ page }) => {

      await attachTestMetadata(test.info(), {
        tc_id:    'TC-037',
        feature:  'User Management - Merchant',
        priority: 'Medium',
      });

      // ── Open form ────────────────────────────────────────────────────
      await listPage.clickBuatMerchant();
      await formPage.expectFormVisible();

      // ── Submit without filling Nama Company ──────────────────────────
      await formPage.inputMid.fill(generateMid());
      await formPage.selectPlan('Full Plan');
      await formPage.btnSimpan.click();

      await attachScreenshot(page, test.info(), 'TC037_01_submitted_empty_nama');

      // ── Critical assertion: validation message must appear ────────────
      await formPage.expectNamaCompanyRequired();

      await attachScreenshot(page, test.info(), 'TC037_02_validation_message_visible');

      // ── Soft assertion: form must still be open (not navigated away) ──
      await expect
        .soft(
          formPage.btnSimpan,
          '[TC-037] Form should remain open — must not navigate away on validation failure',
        )
        .toBeVisible({ timeout: 5_000 });
    },
  );

  // ── TC-039 ────────────────────────────────────────────────────────────────

  test(
    '[TC-039] Input MID duplicate — harus muncul error MID sudah terdaftar @negative @regression',
    async ({ page }) => {

      await attachTestMetadata(test.info(), {
        tc_id:    'TC-039',
        feature:  'User Management - Merchant',
        priority: 'High',
      });

      // ── This TC assumes a merchant with MID "DUPLICATE001" already
      //    exists in the staging environment.
      //    If your project uses API setup, replace the value below with
      //    the MID seeded via api-helper.ts beforeAll().
      const KNOWN_DUPLICATE_MID = process.env['DUPLICATE_MID'] ?? 'DUPLICATE001';

      // ── Open form ────────────────────────────────────────────────────
      await listPage.clickBuatMerchant();
      await formPage.expectFormVisible();

      // ── Fill with a duplicate MID ─────────────────────────────────────
      await formPage.fillAndSubmit({
        namaCompany: 'PT Test Duplicate MID',
        mid:         KNOWN_DUPLICATE_MID,
        plan:        'Full Plan',
      });

      await attachScreenshot(page, test.info(), 'TC039_01_submitted_duplicate_mid');

      // ── Critical assertion: duplicate MID error must appear ───────────
      await formPage.expectMidDuplicateError();

      await attachScreenshot(page, test.info(), 'TC039_02_duplicate_error_visible');

      // ── Soft assertion: form must still be open ───────────────────────
      await expect
        .soft(
          formPage.btnSimpan,
          '[TC-039] Form should remain open after a duplicate MID submission',
        )
        .toBeVisible({ timeout: 5_000 });
    },
  );

});
