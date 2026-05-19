// tests/qr-generate-mobile.spec.ts

import { test, expect } from '../fixtures/base.fixture';
import { QRGeneratePage } from '../pages/QRGeneratePage';

test.describe('QR Generate — Mobile Web', () => {

  test('Generate QR successfully on Android', async ({
    loggedInMobilePage,
  }) => {
    const qrPage = new QRGeneratePage(loggedInMobilePage);
    await qrPage.goto();

    // ── Generate QR ──
    await qrPage.generateQR({
      amount: '10000',
      description: 'Test Payment',
    });

    // ── Verify ──
    await qrPage.waitForQR();
    await qrPage.expectQRVisible();

    // ── Screenshot ──
    await qrPage.screenshotQR('qr_android_success');

    // ── Assert data ──
    const refNo = await qrPage.getReferenceNo();
    expect(refNo).toBeTruthy();
    console.log(`✅ QR Generated | refNo: ${refNo}`);
  });

  test('Show error for invalid merchant', async ({
    loggedInMobilePage,
  }) => {
    const qrPage = new QRGeneratePage(loggedInMobilePage);
    await qrPage.goto();

    await qrPage.generateQR({
      merchantId: 'INVALID_ID',
      amount: '10000',
    });

    await qrPage.expectError();
  });
});