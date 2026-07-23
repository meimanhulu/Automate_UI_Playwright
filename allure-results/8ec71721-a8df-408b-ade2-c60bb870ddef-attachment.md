# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: transaction\incoming-transaction.spec.ts >> Incoming Transaction Flow @regression >> [TC-INC-001] Validasi menampilkan data Incoming Transaction @positive
- Location: tests\transaction\incoming-transaction.spec.ts:95:7

# Error details

```
"beforeAll" hook timeout of 30000ms exceeded.
```

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('li[role="presentation"]:has(p:text-is("Transaction")) > div > button')
    - locator resolved to <button class=" transition-all duration-300 ease-in-out">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    50 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

```

```
Error: browserContext.close: Target page, context or browser has been closed
```

# Test source

```ts
  1   | /**
  2   |  * Incoming Transaction Flow — Test Suite
  3   |  *
  4   |  * Uses test.describe.serial with shared page (single login for all TCs).
  5   |  * Imports from framework.fixture to get: logger, downloadValidator.
  6   |  * Auto failure screenshot is handled via test.afterEach (shared page pattern).
  7   |  */
  8   | 
  9   | import { test, expect }                      from '../../fixtures/framework.fixture';
  10  | import { attachBlankTabAutoClose }           from '../../fixtures/base.fixture';
  11  | import type { Download, Page, BrowserContext } from '@playwright/test';
  12  | import { IncomingTransactionPage }      from '../../pages/transaction/IncomingTransactionPage';
  13  | import { TopbarPage }                   from '../../pages/layout/TopbarPage';
  14  | import { DownloadsListPage }            from '../../pages/downloads/DownloadsListPage';
  15  | import { LoginLogoutPage }              from '../../pages/LoginLogoutPage';
  16  | import { attachTestMetadata }           from '../../utils/test-helper';
  17  | import { milestone }                    from '../../utils/ScreenshotHelper';
  18  | import { assertVisible, assertText }    from '../../utils/AssertionHelper';
  19  | 
  20  | 
  21  | // ─── Shared state (one login for all TCs in this file) ────────────────────────
  22  | 
  23  | test.describe.serial('Incoming Transaction Flow @regression', () => {
  24  |   let context:       BrowserContext;
  25  |   let page:          Page;
  26  |   let incomingPage:  IncomingTransactionPage;
  27  |   let topbarPage:    TopbarPage;
  28  |   let downloadsPage: DownloadsListPage;
  29  | 
  30  |   // ── Login once before all TCs ─────────────────────────────────────────────
  31  | 
  32  |   test.beforeAll(async ({ browser }) => {
  33  |     context = await browser.newContext({
  34  |       baseURL: process.env.APP_URL || 'https://uat.pg-poppay.com',
  35  |       acceptDownloads: true,
  36  |     });
  37  | 
  38  |     // Create main page FIRST
  39  |     page = await context.newPage();
  40  | 
  41  |     // Attach listener AFTER - won't close the main page
  42  |     attachBlankTabAutoClose(context, 150);
  43  | 
  44  |     const loginPage = new LoginLogoutPage(page);
  45  |     await loginPage.navigate('https://uat.pg-poppay.com/login');
  46  | 
  47  |     const email    = process.env.POPPAY_USERNAME ?? 'ryland@manjo.co.id';
  48  |     const password = process.env.POPPAY_PASSWORD ?? 'Ryland2026';
  49  | 
  50  |     await loginPage.login(email, password);
  51  |     await loginPage.expectLoginSuccess();
  52  | 
  53  |     incomingPage  = new IncomingTransactionPage(page);
  54  |     topbarPage    = new TopbarPage(page);
  55  |     downloadsPage = new DownloadsListPage(page);
  56  | 
  57  |     await incomingPage.gotoViaSidebar();
  58  |   });
  59  | 
  60  |   // ── Logout once after all TCs ─────────────────────────────────────────────
  61  | 
  62  |   test.afterAll(async () => {
  63  |     try {
  64  |       await page.waitForTimeout(2000);
  65  |       await new LoginLogoutPage(page).logout();
  66  |       await page.waitForTimeout(1500);
  67  |     } catch (e) {
  68  |       console.warn('[afterAll] Auto-logout failed:', e);
  69  |     } finally {
  70  |       await page.close();
> 71  |       await context.close();
      |       ^ Error: browserContext.close: Target page, context or browser has been closed
  72  |     }
  73  |   });
  74  | 
  75  |   // ── Auto screenshot on failure for shared page ────────────────────────────
  76  |   // The _autoScreenshot fixture from framework.fixture uses the fixture's own
  77  |   // page instance. For this serial suite we use the shared page, so we add
  78  |   // an explicit afterEach to capture the shared page on failure.
  79  |   test.afterEach(async ({}, testInfo) => {
  80  |     if (testInfo.status !== testInfo.expectedStatus) {
  81  |       try {
  82  |         const screenshot = await page.screenshot({ fullPage: true });
  83  |         await testInfo.attach(`❌ FAIL — ${testInfo.title}`, {
  84  |           body:        screenshot,
  85  |           contentType: 'image/png',
  86  |         });
  87  |       } catch { /* page may be closed */ }
  88  |     }
  89  |   });
  90  | 
  91  |   // ─────────────────────────────────────────────────────────────────────────
  92  |   // TC-INC-001 — Validasi menampilkan data Incoming Transaction
  93  |   // ─────────────────────────────────────────────────────────────────────────
  94  | 
  95  |   test('[TC-INC-001] Validasi menampilkan data Incoming Transaction @positive', async ({ logger }) => {
  96  |     const testInfo = test.info();
  97  |     await attachTestMetadata(testInfo, { tc_id: 'TC-INC-001', feature: 'Incoming Transaction', priority: 'High' });
  98  | 
  99  |     await test.step('Validate Incoming Transaction page loaded', async () => {
  100 |       logger.step(1, 'Validate Incoming Transaction page loaded');
  101 |       await incomingPage.expectPageLoaded();
  102 |       logger.pass('Incoming Transaction page displayed');
  103 |     });
  104 | 
  105 |     await test.step('Validate transaction table visible', async () => {
  106 |       logger.step(2, 'Validate transaction table visible');
  107 |       await incomingPage.expectTableVisible();
  108 |       logger.pass('Transaction table is visible');
  109 |     });
  110 | 
  111 |     await milestone(page, testInfo, 'TC-INC-001_Transaction_Loaded');
  112 |   });
  113 | 
  114 |   // ─────────────────────────────────────────────────────────────────────────
  115 |   // TC-INC-002 — Validasi filter data Incoming Transaction
  116 |   // ─────────────────────────────────────────────────────────────────────────
  117 | 
  118 |   test('[TC-INC-002] Validasi filter data Incoming Transaction @positive', async ({ logger }) => {
  119 |     const testInfo = test.info();
  120 |     await attachTestMetadata(testInfo, { tc_id: 'TC-INC-002', feature: 'Incoming Transaction', priority: 'Medium' });
  121 | 
  122 |     await test.step('Apply Status filter: Success', async () => {
  123 |       logger.step(1, 'Apply Status filter: Success');
  124 |       await incomingPage.applyFilter('Success');
  125 |       logger.pass('Filter applied: Success');
  126 |     });
  127 | 
  128 |     await test.step('Validate filtered table visible', async () => {
  129 |       logger.step(2, 'Validate filtered table visible');
  130 |       await incomingPage.expectTableVisible();
  131 |       logger.pass('Filtered table is visible');
  132 |     });
  133 | 
  134 |     await milestone(page, testInfo, 'TC-INC-002_Filter_Applied');
  135 |   });
  136 | 
  137 |   // ─────────────────────────────────────────────────────────────────────────
  138 |   // TC-INC-003 — Validasi Async Download (User Flow via Recent Downloads popup)
  139 |   // ─────────────────────────────────────────────────────────────────────────
  140 | 
  141 |   test('[TC-INC-003] Validasi fitur Async Download (S3) data Incoming (User Flow) @positive', async ({ logger, downloadValidator }) => {
  142 |     const testInfo = test.info();
  143 |     await attachTestMetadata(testInfo, { tc_id: 'TC-INC-003', feature: 'Incoming Transaction', priority: 'High' });
  144 | 
  145 |     await test.step('Export All Pages', async () => {
  146 |       logger.step(1, 'Export All Pages');
  147 |       await incomingPage.exportAllPages();
  148 |       logger.pass('Export All Pages triggered');
  149 |     });
  150 | 
  151 |     await test.step('Validate Export Started toast', async () => {
  152 |       logger.step(2, 'Validate Export Started toast');
  153 |       await incomingPage.expectExportStartedToast();
  154 |       logger.pass('Toast Export Started displayed');
  155 |       await milestone(page, testInfo, 'TC-INC-003_Export_Started');
  156 |     });
  157 | 
  158 |     await test.step('Open Recent Downloads popup', async () => {
  159 |       logger.step(3, 'Open Recent Downloads popup');
  160 |       await topbarPage.openDownloads();
  161 |       logger.pass('Downloads popup opened');
  162 |       await milestone(page, testInfo, 'TC-INC-003_Downloads_Popup');
  163 |     });
  164 | 
  165 |     let download: Download;
  166 | 
  167 |     await test.step('Download latest report from popup', async () => {
  168 |       logger.step(4, 'Download latest report from popup');
  169 |       download = await topbarPage.downloads.downloadLatest();
  170 |       logger.pass('Download button clicked');
  171 |     });
```