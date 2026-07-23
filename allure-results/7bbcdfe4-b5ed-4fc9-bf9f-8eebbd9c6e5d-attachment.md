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
"afterAll" hook timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - main [ref=e4]:
      - generic [ref=e5]:
        - main
        - main
        - main
        - generic [ref=e7]:
          - generic [ref=e8]:
            - main [ref=e9]:
              - link [ref=e10] [cursor=pointer]:
                - /url: javascript:;
                - img [ref=e11]
            - heading "Dashboard" [level=1] [ref=e13]
          - img [ref=e15]
        - generic [ref=e21]:
          - generic [ref=e22]:
            - generic [ref=e23]:
              - heading "Balance" [level=1] [ref=e24]
              - link "View All":
                - /url: /merchant-account
                - button "View All" [ref=e25] [cursor=pointer]
            - table [ref=e27]:
              - rowgroup [ref=e28]:
                - row "Payment Method & ID Payment Channel Total Balance Floating Balance Payable Balance Hold Amount" [ref=e29]:
                  - columnheader "Payment Method & ID" [ref=e30]
                  - columnheader "Payment Channel" [ref=e31]
                  - columnheader "Total Balance" [ref=e32]
                  - columnheader "Floating Balance" [ref=e33]
                  - columnheader "Payable Balance" [ref=e34]
                  - columnheader "Hold Amount" [ref=e35]
              - rowgroup [ref=e36]:
                - row "1781683720077 Wahid Merchant 2 - IDR 752.893.593,00 IDR 98.310.276,90 IDR 654.583.316,10 IDR 0,00" [ref=e37]:
                  - rowheader "1781683720077 Wahid Merchant 2" [ref=e38]:
                    - heading [level=1] [ref=e40]:
                      - img [ref=e41]
                    - generic [ref=e43]:
                      - heading "1781683720077" [level=1] [ref=e44]
                      - paragraph [ref=e45]: Wahid Merchant 2
                  - cell "-" [ref=e46]
                  - cell "IDR 752.893.593,00" [ref=e47]
                  - cell "IDR 98.310.276,90" [ref=e48]
                  - cell "IDR 654.583.316,10" [ref=e49]
                  - cell "IDR 0,00" [ref=e50]
                - row "1772784091062 ROLEX - IDR 86.612.547.918,67 IDR 6.185.614,50 IDR 86.606.362.304,17 IDR 0,00" [ref=e51]:
                  - rowheader "1772784091062 ROLEX" [ref=e52]:
                    - heading [level=1] [ref=e54]:
                      - img [ref=e55]
                    - generic [ref=e57]:
                      - heading "1772784091062" [level=1] [ref=e58]
                      - paragraph [ref=e59]: ROLEX
                  - cell "-" [ref=e60]
                  - cell "IDR 86.612.547.918,67" [ref=e61]
                  - cell "IDR 6.185.614,50" [ref=e62]
                  - cell "IDR 86.606.362.304,17" [ref=e63]
                  - cell "IDR 0,00" [ref=e64]
                - row "1773448970093 DK - IDR 611.166.354.668,77 IDR 5.023.757,78 IDR 611.161.330.910,99 IDR 0,00" [ref=e65]:
                  - rowheader "1773448970093 DK" [ref=e66]:
                    - heading [level=1] [ref=e68]:
                      - img [ref=e69]
                    - generic [ref=e71]:
                      - heading "1773448970093" [level=1] [ref=e72]
                      - paragraph [ref=e73]: DK
                  - cell "-" [ref=e74]
                  - cell "IDR 611.166.354.668,77" [ref=e75]
                  - cell "IDR 5.023.757,78" [ref=e76]
                  - cell "IDR 611.161.330.910,99" [ref=e77]
                  - cell "IDR 0,00" [ref=e78]
                - row "1773448967065 DK - IDR 20.635.056,18 IDR 203.450,94 IDR 20.431.605,23 IDR 0,00" [ref=e79]:
                  - rowheader "1773448967065 DK" [ref=e80]:
                    - heading [level=1] [ref=e82]:
                      - img [ref=e83]
                    - generic [ref=e85]:
                      - heading "1773448967065" [level=1] [ref=e86]
                      - paragraph [ref=e87]: DK
                  - cell "-" [ref=e88]
                  - cell "IDR 20.635.056,18" [ref=e89]
                  - cell "IDR 203.450,94" [ref=e90]
                  - cell "IDR 20.431.605,23" [ref=e91]
                  - cell "IDR 0,00" [ref=e92]
                - row "1779345075153 IND TEST - IDR 23.331.398,87 IDR 32.670,00 IDR 23.298.728,87 IDR 0,00" [ref=e93]:
                  - rowheader "1779345075153 IND TEST" [ref=e94]:
                    - heading [level=1] [ref=e96]:
                      - img [ref=e97]
                    - generic [ref=e99]:
                      - heading "1779345075153" [level=1] [ref=e100]
                      - paragraph [ref=e101]: IND TEST
                  - cell "-" [ref=e102]
                  - cell "IDR 23.331.398,87" [ref=e103]
                  - cell "IDR 32.670,00" [ref=e104]
                  - cell "IDR 23.298.728,87" [ref=e105]
                  - cell "IDR 0,00" [ref=e106]
                - row "1773449230653 ROLEX - IDR 18.816.513,39 IDR 13.384,44 IDR 18.803.128,95 IDR 0,00" [ref=e107]:
                  - rowheader "1773449230653 ROLEX" [ref=e108]:
                    - heading [level=1] [ref=e110]:
                      - img [ref=e111]
                    - generic [ref=e113]:
                      - heading "1773449230653" [level=1] [ref=e114]
                      - paragraph [ref=e115]: ROLEX
                  - cell "-" [ref=e116]
                  - cell "IDR 18.816.513,39" [ref=e117]
                  - cell "IDR 13.384,44" [ref=e118]
                  - cell "IDR 18.803.128,95" [ref=e119]
                  - cell "IDR 0,00" [ref=e120]
          - generic [ref=e123]:
            - heading "ADP Time (Average Deposits Paid)" [level=1] [ref=e124]
            - img [ref=e128]:
              - generic [ref=e130]:
                - generic [ref=e131] [cursor=pointer]:
                  - generic [ref=e132]:
                    - img
                  - generic [ref=e133]: QR
                - generic [ref=e134] [cursor=pointer]:
                  - generic [ref=e135]:
                    - img
                  - generic [ref=e136]: Virtual Account
                - generic [ref=e137] [cursor=pointer]:
                  - generic [ref=e138]:
                    - img
                  - generic [ref=e139]: EWallet
                - generic [ref=e140] [cursor=pointer]:
                  - generic [ref=e141]:
                    - img
                  - generic [ref=e142]: Debit Card
                - generic [ref=e143] [cursor=pointer]:
                  - generic [ref=e144]:
                    - img
                  - generic [ref=e145]: Credit Card
                - generic [ref=e146] [cursor=pointer]:
                  - generic [ref=e147]:
                    - img
                  - generic [ref=e148]: Crypto
                - generic [ref=e149] [cursor=pointer]:
                  - generic [ref=e150]:
                    - img
                  - generic [ref=e151]: Bank Transfer
              - generic [ref=e153]:
                - generic "1500" [ref=e154]
                - generic "1000" [ref=e155]
                - generic "500" [ref=e156]
              - generic [ref=e163]:
                - generic "0 - 59s" [ref=e164]
                - generic "1-1:59m" [ref=e165]
                - generic "2-2:59m" [ref=e166]
                - generic "3-3:59m" [ref=e167]
        - generic [ref=e168]:
          - main [ref=e169]:
            - link [ref=e170] [cursor=pointer]:
              - /url: javascript:;
              - img [ref=e171]
          - main [ref=e173]:
            - link [ref=e174] [cursor=pointer]:
              - /url: javascript:;
              - img [ref=e175]
          - main [ref=e178]:
            - link [ref=e179] [cursor=pointer]:
              - /url: javascript:;
              - img [ref=e180]
          - main [ref=e182]:
            - link "ava-icon" [ref=e183] [cursor=pointer]:
              - /url: javascript:;
              - img "ava-icon" [ref=e185]
    - generic [ref=e186]: Pop Pay - Dashboard
  - img
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
> 62  |   test.afterAll(async () => {
      |        ^ "afterAll" hook timeout of 30000ms exceeded.
  63  |     try {
  64  |       await page.waitForTimeout(2000);
  65  |       await new LoginLogoutPage(page).logout();
  66  |       await page.waitForTimeout(1500);
  67  |     } catch (e) {
  68  |       console.warn('[afterAll] Auto-logout failed:', e);
  69  |     } finally {
  70  |       await page.close();
  71  |       await context.close();
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
```