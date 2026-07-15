import { test, expect, type Page } from '@playwright/test';
import { TransactionSidebarPage } from '../../pages/transaction/TransactionSidebarPage';
import { IncomingTransactionPage } from '../../pages/transaction/IncomingTransactionPage';
import { TopbarPage } from '../../pages/layout/TopbarPage';
import { DownloadsListPage } from '../../pages/downloads/DownloadsListPage';
import { LoginLogoutPage } from '../../pages/LoginLogoutPage';
import { attachTestMetadata, attachScreenshot } from '../../utils/test-helper';

test.describe.serial('Incoming Transaction Flow @regression', () => {
  let page: Page;
  let transactionNav: TransactionSidebarPage;
  let incomingPage: IncomingTransactionPage;
  let topbarPage: TopbarPage;
  let downloadsPage: DownloadsListPage;

  test.beforeAll(async ({ browser }) => {
    // Buat page baru yang akan dibagikan (shared) ke semua test case
    page = await browser.newPage();
    
    // 1. Eksekusi Login SATU KALI saja untuk seluruh file
    const loginLogoutPage = new LoginLogoutPage(page);
    await loginLogoutPage.navigate('https://uat.pg-poppay.com/login');
    const email = process.env.POPPAY_USERNAME || 'ryland@manjo.co.id';
    const password = process.env.POPPAY_PASSWORD || 'Ryland2026';
    await loginLogoutPage.login(email, password);
    await loginLogoutPage.expectLoginSuccess();

    // 2. Inisialisasi semua Page Objects
    transactionNav = new TransactionSidebarPage(page);
    incomingPage = new IncomingTransactionPage(page);
    topbarPage = new TopbarPage(page);
    downloadsPage = new DownloadsListPage(page);

    // 3. Navigasi ke halaman target
    await incomingPage.gotoViaSidebar();
  });

  test.afterAll(async () => {
    // Eksekusi Logout SATU KALI saja setelah semua test case selesai
    try {
      await page.waitForTimeout(3000);
      const loginLogoutPage = new LoginLogoutPage(page);
      await loginLogoutPage.logout();
      await page.waitForTimeout(2000);
      await page.close();
    } catch (e) {
      console.warn('Auto-logout failed during teardown:', e);
    }
  });

  test(
    '[TC-INC-001] Validasi menampilkan data Incoming Transaction @positive',
    async () => {
      await attachTestMetadata(test.info(), {
        tc_id: 'TC-INC-001',
        feature: 'Incoming Transaction',
        priority: 'High',
      });

      // Verifikasi halaman terbuka dan tabel termuat dari API
      await incomingPage.expectPageLoaded();
      await incomingPage.expectTableVisible();

      await attachScreenshot(page, test.info(), 'TC-INC-001_Data_Loaded');
    }
  );

  test(
    '[TC-INC-002] Validasi filter data Incoming Transaction @positive',
    async () => {
      await attachTestMetadata(test.info(), {
        tc_id: 'TC-INC-002',
        feature: 'Incoming Transaction',
        priority: 'Medium',
      });

      // Terapkan filter (contoh: "Success")
      await incomingPage.applyFilter('Success');

      // Verifikasi data tabel setelah difilter (bisa ditambahkan fungsi spesifik untuk cek kolom status)
      await incomingPage.expectTableVisible();

      await attachScreenshot(page, test.info(), 'TC-INC-002_Filtered_Data');
    }
  );

  test(
    '[TC-INC-003] Validasi fitur Async Download (S3) data Incoming (User Flow) @positive',
    async () => {
      await attachTestMetadata(test.info(), {
        tc_id: 'TC-INC-003',
        feature: 'Incoming Transaction',
        priority: 'High',
      });

      // Flow:
      // Login -> Dashboard -> Transaction Menu -> Incoming Menu -> Incoming Transaction Page
      // (Sudah ditangani oleh beforeEach dan auth fixture)

      // Click Export -> Click Download All Page
      await incomingPage.exportAllPages();
      
      // Wait Export Finished (Verifikasi toast export started muncul)
      await incomingPage.expectExportStartedToast();
      await attachScreenshot(page, test.info(), 'TC-INC-003_Export_Started_Toast');

      // 5. Buka Recent Downloads Popup dari Topbar
      await topbarPage.openDownloads();

      // Mulai menunggu proses download aktual dari browser
      const downloadPromise = page.waitForEvent('download');

      // 6. Klik download dari Popup Terbaru
      await topbarPage.downloads.downloadLatest();
      
      const download = await downloadPromise;

      // Verify CSV Downloaded
      await expect(
        download.suggestedFilename(),
        '[TC-INC-003] File CSV harus berhasil terunduh dengan format valid'
      ).toMatch(/\.csv$/i); // Validasi format file harus CSV

      await attachScreenshot(page, test.info(), 'TC-INC-003_Download_Complete');
      
      // Jeda 3 detik setelah download berhasil agar bisa dilihat
      await page.waitForTimeout(3000);
    }
  );
  test(
    '[TC-INC-004] Validasi fitur Async Download (S3) data Incoming (Show All Downloads) @positive',
    async () => {
      await attachTestMetadata(test.info(), {
        tc_id: 'TC-INC-004',
        feature: 'Incoming Transaction',
        priority: 'High',
      });

      // 1. Eksekusi request download / export dari dropdown (Download This Page)
      await incomingPage.exportThisPage();
      
      // 2. Verifikasi toast notifikasi muncul
      await incomingPage.expectExportStartedToast();
      await attachScreenshot(page, test.info(), 'TC-INC-004_Export_Started_Toast');

      // 3. Navigasi ke halaman riwayat download melalui Topbar
      await topbarPage.goToShowAllDownloads();
      
      // 4. Verifikasi halaman Downloads terbuka
      await downloadsPage.expectPageLoaded();
      await downloadsPage.expectTableVisible();

      // Mulai menunggu proses download aktual dari browser
      const downloadPromise = page.waitForEvent('download');
      
      // 5. Cari baris dengan report name yang relevan dan tunggu hingga status "Ready", lalu klik
      await downloadsPage.downloadReport('INBOUND Transaction Report');
      
      const download = await downloadPromise;

      // 6. Verifikasi bahwa unduhan berhasil
      await expect(
        download.suggestedFilename(),
        '[TC-INC-004] File harus berhasil terunduh dengan format valid'
      ).toBeTruthy();

      await attachScreenshot(page, test.info(), 'TC-INC-004_Download_Complete');

      // Jeda 3 detik setelah download berhasil agar bisa dilihat
      await page.waitForTimeout(3000);
    }
  );

});
