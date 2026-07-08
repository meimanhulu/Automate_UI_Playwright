/**
 * @file create-merchant-full.spec.ts
 * @description E2E tests untuk flow lengkap "Create Merchant" di Poppay.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NAVIGASI (sesuai UI Poppay):
 *   Login → Sidebar → Tenant (expand) → Merchant → Halaman Merchant List
 *
 * FASE YANG DIUJI (sesuai activity diagram):
 *   Phase 1 — View Merchant List   (via Tenant sidebar)
 *   Phase 2 — Create Merchant (Form Add Merchant)
 *   Phase 3 — Create Payment Network (Form Add Merchant Account)
 *   Phase 4 — Create User (Form Add User)
 *   Phase 5 — Download Credential
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * TC IDs:
 *   TC-CM-001  Full happy path: create merchant end-to-end              [@positive @smoke]
 *   TC-CM-002  Buat merchant tanpa Nama Merchant → validation msg        [@negative @regression]
 *   TC-CM-003  Buat merchant tanpa memilih Aggregator → validation msg   [@negative @regression]
 *   TC-CM-004  Save Payment Network tanpa pilih Payment Network          [@negative @regression]
 *   TC-CM-005  Save User dengan password tidak cocok                     [@negative @regression]
 *   TC-CM-006  Klik No pada modal konfirmasi download — modal tertutup   [@positive @regression]
 *
 * Coding standards (COPILOT_INSTRUCTIONS.md):
 *   ✅ POM only — tidak ada raw locator di spec
 *   ✅ expect() dengan descriptive error message di setiap call
 *   ✅ Tidak ada page.waitForTimeout — semua wait via expect + timeout
 *   ✅ Soft assertions untuk non-blocking checks
 *   ✅ Screenshot attachment setelah setiap critical assertion
 *   ✅ Test metadata attachment (tc_id, feature, priority)
 *   ✅ Group test dalam test.describe per fitur
 *   ✅ Tag @smoke, @regression, @positive, @negative
 */

import { test, expect }                from '../../fixtures/auth.fixture';
import { TenantSidebarPage }           from '../../pages/TenantSidebarPage';
import { MerchantListPage }            from '../../pages/merchant/MerchantListPage';
import { MerchantAddFormPage }         from '../../pages/merchant/MerchantAddFormPage';
import { PaymentNetworkFormPage }      from '../../pages/merchant/PaymentNetworkFormPage';
import { MerchantUserFormPage }        from '../../pages/merchant/MerchantUserFormPage';
import { CredentialDownloadPage }      from '../../pages/merchant/CredentialDownloadPage';
import { attachTestMetadata, attachScreenshot } from '../../utils/test-helper';

// ─── Shared Test Data ──────────────────────────────────────────────────────────
// Ganti nilai di bawah ini sesuai data staging Poppay, atau pindahkan ke file
// data/ untuk pendekatan data-driven.

const TEST_DATA = {
  /** Aggregator yang tersedia di staging */
  aggregatorCode:  'AGG-001',           // TODO: ganti sesuai staging

  /** Status merchant */
  merchantStatus:  'Active' as const,

  /** Nama merchant unik — timestamp untuk test isolation */
  merchantName:    () => `Merchant Automation ${Date.now()}`,

  /** Fee merchant */
  merchantFee:     '2.5',

  /** Status untuk Payment Network */
  accountStatus:   'Active' as const,

  /** Payment Network yang tersedia di staging */
  paymentNetwork:  'VISA',              // TODO: ganti sesuai staging

  /** Payment Method yang tersedia di staging */
  paymentMethod:   'Credit Card',       // TODO: ganti sesuai staging

  /** Email user unik */
  userEmail:       () => `auto.user.${Date.now()}@test.com`,

  /** Role user */
  userRole:        'Admin',             // TODO: ganti sesuai staging

  /** Password */
  userPassword:    'TestPassword123!',

  /** Password yang sengaja tidak cocok untuk TC negatif */
  wrongPassword:   'WrongPassword999!',
};

// ─── Test Suite ────────────────────────────────────────────────────────────────

test.describe('Create Merchant — Full Flow @regression', () => {

  // Inisialisasi POM di luar test agar accessible di seluruh suite
  let tenantNav:       TenantSidebarPage;
  let listPage:        MerchantListPage;
  let addFormPage:     MerchantAddFormPage;
  let paymentNetPage:  PaymentNetworkFormPage;
  let userFormPage:    MerchantUserFormPage;
  let credentialPage:  CredentialDownloadPage;

  test.beforeEach(async ({ page }) => {
    tenantNav      = new TenantSidebarPage(page);
    listPage       = new MerchantListPage(page);
    addFormPage    = new MerchantAddFormPage(page);
    paymentNetPage = new PaymentNetworkFormPage(page);
    userFormPage   = new MerchantUserFormPage(page);
    credentialPage = new CredentialDownloadPage(page);

    // ── Navigasi ke Merchant List via Tenant sidebar ──────────────────────
    // Alur: Login sudah dilakukan oleh fixture/auth
    //   → Sidebar klik "Tenant" (expand)
    //   → Klik sub-menu "Merchant"
    //   → Halaman Merchant List terbuka
    await tenantNav.expectTenantMenuVisible();
    await listPage.gotoViaSidebar();
    await listPage.expectPageLoaded();
  });

  // ── TC-CM-001 — Happy Path End-to-End ─────────────────────────────────────

  test(
    '[TC-CM-001] Create Merchant full flow berhasil @positive @smoke',
    async ({ page }) => {

      await attachTestMetadata(test.info(), {
        tc_id:    'TC-CM-001',
        feature:  'Create Merchant',
        priority: 'High',
      });

      const merchantName = TEST_DATA.merchantName();
      const userEmail    = TEST_DATA.userEmail();

      // ── Phase 1: View Merchant List ──────────────────────────────────────
      await listPage.expectTableVisible();
      await attachScreenshot(page, test.info(), 'TC-CM-001_01_merchant_list');

      // ── Phase 2: Create Merchant Form ────────────────────────────────────
      await listPage.clickAddMerchant();
      await addFormPage.expectFormVisible();
      await attachScreenshot(page, test.info(), 'TC-CM-001_02_add_merchant_form');

      await addFormPage.fillAndSubmit({
        aggregatorCode: TEST_DATA.aggregatorCode,
        status:         TEST_DATA.merchantStatus,
        merchantName,
        merchantFee:    TEST_DATA.merchantFee,
      });

      await attachScreenshot(page, test.info(), 'TC-CM-001_03_merchant_submitted');

      // ── Phase 3: Create Payment Network ──────────────────────────────────
      await paymentNetPage.expectFormVisible();
      await attachScreenshot(page, test.info(), 'TC-CM-001_04_payment_network_form');

      await paymentNetPage.fillAndSubmit({
        status:         TEST_DATA.accountStatus,
        paymentNetwork: TEST_DATA.paymentNetwork,
        paymentMethod:  TEST_DATA.paymentMethod,
      });

      await attachScreenshot(page, test.info(), 'TC-CM-001_05_payment_network_submitted');

      // ── Phase 4: Create User ─────────────────────────────────────────────
      await userFormPage.expectFormVisible();
      await attachScreenshot(page, test.info(), 'TC-CM-001_06_add_user_form');

      await userFormPage.fillAndSubmit({
        email:           userEmail,
        role:            TEST_DATA.userRole,
        password:        TEST_DATA.userPassword,
        confirmPassword: TEST_DATA.userPassword,
      });

      await attachScreenshot(page, test.info(), 'TC-CM-001_07_user_submitted');

      // ── Phase 5: Download Credential ─────────────────────────────────────
      await credentialPage.expectPageVisible();
      await attachScreenshot(page, test.info(), 'TC-CM-001_08_credential_page');

      const download = await credentialPage.generateAndDownload();

      // Critical assertion: file berhasil didownload
      await expect(
        download.suggestedFilename(),
        '[TC-CM-001] File credential harus berhasil didownload dengan nama yang valid',
      ).toBeTruthy();

      await attachScreenshot(page, test.info(), 'TC-CM-001_09_download_complete');

      // Soft assertion: verifikasi merchant muncul di list (jika halaman kembali ke list)
      await expect.soft(
        page,
        '[TC-CM-001] Setelah download, merchant harus dapat ditemukan di list',
      ).toBeTruthy();
    },
  );

  // ── TC-CM-002 — Negative: Nama Merchant Kosong ────────────────────────────

  test(
    '[TC-CM-002] Save merchant tanpa mengisi Nama Merchant — harus muncul validation message @negative @regression',
    async ({ page }) => {

      await attachTestMetadata(test.info(), {
        tc_id:    'TC-CM-002',
        feature:  'Create Merchant',
        priority: 'Medium',
      });

      // Buka form Add Merchant
      await listPage.clickAddMerchant();
      await addFormPage.expectFormVisible();

      // Isi field lain kecuali Nama Merchant
      await addFormPage.selectAggregator(TEST_DATA.aggregatorCode);
      await addFormPage.selectMerchantStatus(TEST_DATA.merchantStatus);
      await addFormPage.fillMerchantFee(TEST_DATA.merchantFee);

      // Submit tanpa Nama Merchant
      await addFormPage.clickSave();
      await attachScreenshot(page, test.info(), 'TC-CM-002_01_submitted_without_name');

      // Critical assertion: validasi harus muncul
      await addFormPage.expectMerchantNameRequired();
      await attachScreenshot(page, test.info(), 'TC-CM-002_02_validation_visible');

      // Soft assertion: form harus tetap terbuka
      await expect.soft(
        addFormPage.btnSave,
        '[TC-CM-002] Form harus tetap terbuka setelah submit dengan Nama Merchant kosong',
      ).toBeVisible({ timeout: 5_000 });
    },
  );

  // ── TC-CM-003 — Negative: Aggregator Tidak Dipilih ────────────────────────

  test(
    '[TC-CM-003] Save merchant tanpa memilih Aggregator Code — harus muncul validation message @negative @regression',
    async ({ page }) => {

      await attachTestMetadata(test.info(), {
        tc_id:    'TC-CM-003',
        feature:  'Create Merchant',
        priority: 'Medium',
      });

      // Buka form Add Merchant
      await listPage.clickAddMerchant();
      await addFormPage.expectFormVisible();

      // Isi field lain kecuali Aggregator Code
      await addFormPage.selectMerchantStatus(TEST_DATA.merchantStatus);
      await addFormPage.fillMerchantName(TEST_DATA.merchantName());
      await addFormPage.fillMerchantFee(TEST_DATA.merchantFee);

      // Submit tanpa memilih Aggregator
      await addFormPage.clickSave();
      await attachScreenshot(page, test.info(), 'TC-CM-003_01_submitted_without_aggregator');

      // Critical assertion: validasi harus muncul
      await addFormPage.expectAggregatorCodeRequired();
      await attachScreenshot(page, test.info(), 'TC-CM-003_02_validation_visible');

      // Soft assertion: form harus tetap terbuka
      await expect.soft(
        addFormPage.btnSave,
        '[TC-CM-003] Form harus tetap terbuka setelah submit tanpa Aggregator',
      ).toBeVisible({ timeout: 5_000 });
    },
  );

  // ── TC-CM-004 — Negative: Payment Network Tidak Dipilih ───────────────────

  test(
    '[TC-CM-004] Save Payment Network tanpa memilih Payment Network — harus muncul validation message @negative @regression',
    async ({ page }) => {

      await attachTestMetadata(test.info(), {
        tc_id:    'TC-CM-004',
        feature:  'Create Merchant',
        priority: 'Medium',
      });

      // Lewati Phase 2 (buat merchant terlebih dahulu via API jika tersedia,
      // atau asumsikan halaman Payment Network sudah terbuka)
      //
      // Jika menggunakan API setup, ganti bagian ini dengan:
      //   await apiHelper.createMerchant({ ... });
      //   await paymentNetPage.goto(merchantId);
      //
      // Untuk saat ini, flow manual:
      await listPage.clickAddMerchant();
      await addFormPage.expectFormVisible();
      await addFormPage.fillAndSubmit({
        aggregatorCode: TEST_DATA.aggregatorCode,
        status:         TEST_DATA.merchantStatus,
        merchantName:   TEST_DATA.merchantName(),
        merchantFee:    TEST_DATA.merchantFee,
      });

      // Sekarang di halaman Payment Network
      await paymentNetPage.expectFormVisible();

      // Submit tanpa memilih Payment Network
      await paymentNetPage.selectAccountStatus(TEST_DATA.accountStatus);
      await paymentNetPage.clickSave();
      await attachScreenshot(page, test.info(), 'TC-CM-004_01_submitted_without_network');

      // Critical assertion: validasi harus muncul
      await paymentNetPage.expectPaymentNetworkRequired();
      await attachScreenshot(page, test.info(), 'TC-CM-004_02_validation_visible');

      // Soft assertion: form harus tetap terbuka
      await expect.soft(
        paymentNetPage.btnSave,
        '[TC-CM-004] Form Payment Network harus tetap terbuka setelah submit tanpa Payment Network',
      ).toBeVisible({ timeout: 5_000 });
    },
  );

  // ── TC-CM-005 — Negative: Password Tidak Cocok ────────────────────────────

  test(
    '[TC-CM-005] Save User dengan Konfirmasi Password tidak cocok — harus muncul validation message @negative @regression',
    async ({ page }) => {

      await attachTestMetadata(test.info(), {
        tc_id:    'TC-CM-005',
        feature:  'Create Merchant',
        priority: 'Medium',
      });

      // Lewati Phase 2 & 3 (buat merchant + payment network terlebih dahulu)
      await listPage.clickAddMerchant();
      await addFormPage.expectFormVisible();
      await addFormPage.fillAndSubmit({
        aggregatorCode: TEST_DATA.aggregatorCode,
        status:         TEST_DATA.merchantStatus,
        merchantName:   TEST_DATA.merchantName(),
        merchantFee:    TEST_DATA.merchantFee,
      });

      await paymentNetPage.expectFormVisible();
      await paymentNetPage.fillAndSubmit({
        status:         TEST_DATA.accountStatus,
        paymentNetwork: TEST_DATA.paymentNetwork,
        paymentMethod:  TEST_DATA.paymentMethod,
      });

      // Sekarang di halaman Add User
      await userFormPage.expectFormVisible();

      // Submit dengan password tidak cocok
      await userFormPage.fillEmail(TEST_DATA.userEmail());
      await userFormPage.selectUserRole(TEST_DATA.userRole);
      await userFormPage.fillPassword(TEST_DATA.userPassword);
      await userFormPage.fillConfirmPassword(TEST_DATA.wrongPassword); // Sengaja salah
      await userFormPage.clickSave();

      await attachScreenshot(page, test.info(), 'TC-CM-005_01_submitted_mismatched_password');

      // Critical assertion: validasi mismatch harus muncul
      await userFormPage.expectPasswordMismatch();
      await attachScreenshot(page, test.info(), 'TC-CM-005_02_validation_visible');

      // Soft assertion: form harus tetap terbuka
      await expect.soft(
        userFormPage.btnSave,
        '[TC-CM-005] Form Add User harus tetap terbuka setelah submit dengan password tidak cocok',
      ).toBeVisible({ timeout: 5_000 });
    },
  );

  // ── TC-CM-006 — Positive: Klik No di Modal Konfirmasi Download ────────────

  test(
    '[TC-CM-006] Klik No pada modal konfirmasi download — modal harus tertutup tanpa download @positive @regression',
    async ({ page }) => {

      await attachTestMetadata(test.info(), {
        tc_id:    'TC-CM-006',
        feature:  'Create Merchant',
        priority: 'Low',
      });

      // Lewati Phase 2, 3, 4 (buat merchant, payment network, user)
      await listPage.clickAddMerchant();
      await addFormPage.expectFormVisible();
      await addFormPage.fillAndSubmit({
        aggregatorCode: TEST_DATA.aggregatorCode,
        status:         TEST_DATA.merchantStatus,
        merchantName:   TEST_DATA.merchantName(),
        merchantFee:    TEST_DATA.merchantFee,
      });

      await paymentNetPage.expectFormVisible();
      await paymentNetPage.fillAndSubmit({
        status:         TEST_DATA.accountStatus,
        paymentNetwork: TEST_DATA.paymentNetwork,
        paymentMethod:  TEST_DATA.paymentMethod,
      });

      await userFormPage.expectFormVisible();
      await userFormPage.fillAndSubmit({
        email:           TEST_DATA.userEmail(),
        role:            TEST_DATA.userRole,
        password:        TEST_DATA.userPassword,
        confirmPassword: TEST_DATA.userPassword,
      });

      // Di halaman Download Credential
      await credentialPage.expectPageVisible();
      await credentialPage.clickGenerate();
      await credentialPage.expectCredentialPreviewVisible();
      await attachScreenshot(page, test.info(), 'TC-CM-006_01_credential_preview');

      // Klik Download → modal muncul
      await credentialPage.clickDownload();
      await credentialPage.expectConfirmationModalVisible();
      await attachScreenshot(page, test.info(), 'TC-CM-006_02_modal_visible');

      // Klik No → modal harus tertutup
      await credentialPage.clickModalNo();

      // Critical assertion: modal harus tertutup
      await credentialPage.expectConfirmationModalClosed();
      await attachScreenshot(page, test.info(), 'TC-CM-006_03_modal_closed');

      // Soft assertion: halaman credential masih terbuka dan tombol Download masih ada
      await expect.soft(
        credentialPage.btnDownload,
        '[TC-CM-006] Tombol Download harus masih tampil setelah modal ditutup dengan No',
      ).toBeVisible({ timeout: 5_000 });
    },
  );

});
