import { test, expect } from '../../fixtures/poppay-auth.fixture';
import { TransactionSidebarPage } from '../../pages/transaction/TransactionSidebarPage';
import { OutgoingTransactionPage } from '../../pages/transaction/OutgoingTransactionPage';
import { TopbarPage } from '../../pages/layout/TopbarPage';
import { DownloadsListPage } from '../../pages/downloads/DownloadsListPage';
import { attachTestMetadata, attachScreenshot } from '../../utils/test-helper';

test.describe('Outgoing Transaction Flow @regression', () => {

  let transactionNav: TransactionSidebarPage;
  let outgoingPage: OutgoingTransactionPage;
  let topbarPage: TopbarPage;
  let downloadsPage: DownloadsListPage;

  test.beforeEach(async ({ page }) => {
    transactionNav = new TransactionSidebarPage(page);
    outgoingPage = new OutgoingTransactionPage(page);
    topbarPage = new TopbarPage(page);
    downloadsPage = new DownloadsListPage(page);

    // Navigasi via sidebar (asumsikan user sudah login via auth.fixture)
    await outgoingPage.gotoViaSidebar();
  });

  test(
    '[TC-OUT-001] Validasi menampilkan data Outgoing Transaction @positive',
    async ({ page }) => {
      await attachTestMetadata(test.info(), {
        tc_id: 'TC-OUT-001',
        feature: 'Outgoing Transaction',
        priority: 'High',
      });

      // Verifikasi halaman terbuka dan tabel termuat dari API
      await outgoingPage.expectPageLoaded();
      await outgoingPage.expectTableVisible();

      await attachScreenshot(page, test.info(), 'TC-OUT-001_Data_Loaded');
    }
  );

  test(
    '[TC-OUT-002] Validasi filter data Outgoing Transaction @positive',
    async ({ page }) => {
      await attachTestMetadata(test.info(), {
        tc_id: 'TC-OUT-002',
        feature: 'Outgoing Transaction',
        priority: 'Medium',
      });

      // Terapkan filter (contoh: "Success")
      await outgoingPage.applyFilter('Success');

      // Verifikasi data tabel setelah difilter (bisa ditambahkan fungsi spesifik untuk cek kolom status)
      await outgoingPage.expectTableVisible();

      await attachScreenshot(page, test.info(), 'TC-OUT-002_Filtered_Data');
    }
  );

  test(
    '[TC-OUT-003] Validasi fitur Async Download (S3) data Outgoing (User Flow) @positive',
    async ({ page }) => {
      await attachTestMetadata(test.info(), {
        tc_id: 'TC-OUT-003',
        feature: 'Outgoing Transaction',
        priority: 'High',
      });

      // Click Export -> Click Download All Page
      await outgoingPage.exportAllPages();
      
      // Wait Export Finished (Verifikasi toast export started muncul)
      await outgoingPage.expectExportStartedToast();
      await attachScreenshot(page, test.info(), 'TC-OUT-003_Export_Started_Toast');

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
        '[TC-OUT-003] File CSV harus berhasil terunduh dengan format valid'
      ).toMatch(/\.csv$/i);

      await attachScreenshot(page, test.info(), 'TC-OUT-003_Download_Complete');
    }
  );

  test(
    '[TC-OUT-004] Validasi fitur Async Download (S3) data Outgoing (Show All Downloads) @positive',
    async ({ page }) => {
      await attachTestMetadata(test.info(), {
        tc_id: 'TC-OUT-004',
        feature: 'Outgoing Transaction',
        priority: 'High',
      });

      // 1. Eksekusi request download / export dari dropdown (Download This Page)
      await outgoingPage.exportThisPage();
      
      // 2. Verifikasi toast notifikasi muncul
      await outgoingPage.expectExportStartedToast();
      await attachScreenshot(page, test.info(), 'TC-OUT-004_Export_Started_Toast');

      // 3. Navigasi ke halaman riwayat download melalui Topbar
      await topbarPage.goToShowAllDownloads();
      
      // 4. Verifikasi halaman Downloads terbuka
      await downloadsPage.expectPageLoaded();
      await downloadsPage.expectTableVisible();

      // Mulai menunggu proses download aktual dari browser
      const downloadPromise = page.waitForEvent('download');
      
      // 5. Cari baris dengan report name yang relevan dan tunggu hingga status "Ready", lalu klik
      await downloadsPage.downloadReport('OUTBOUND Transaction Report');
      
      const download = await downloadPromise;

      // 6. Verifikasi bahwa unduhan berhasil
      await expect(
        download.suggestedFilename(),
        '[TC-OUT-004] File harus berhasil terunduh dengan format valid'
      ).toBeTruthy();

      await attachScreenshot(page, test.info(), 'TC-OUT-004_Download_Complete');
    }
  );

});
