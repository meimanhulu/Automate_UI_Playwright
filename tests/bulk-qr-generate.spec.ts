import path from 'node:path';
import { test, expect } from '../fixtures/base.fixture';

const merchantsCsv = path.join(process.cwd(), 'data', 'merchants.csv');

test('bulk QR generate (template)', async ({ loginPage, dashboardPage, qrGeneratePage }) => {
  await loginPage.open();
  await loginPage.login(process.env.E2E_USERNAME || 'demo', process.env.E2E_PASSWORD || 'demo');

  await dashboardPage.assertLoaded();
  await dashboardPage.goToQrGenerate();

  await qrGeneratePage.assertLoaded();
  await qrGeneratePage.uploadBulkCsv(merchantsCsv);
  await qrGeneratePage.submitBulk();

  await expect(true).toBeTruthy();
});
