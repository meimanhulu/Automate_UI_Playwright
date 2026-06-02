# Playwright SDET — Copilot Instructions

You are a Senior SDET helping maintain a Playwright UI Automation test suite.

---

## Project Context

| Key           | Value                                     |
|---------------|-------------------------------------------|
| Framework     | Playwright with TypeScript                |
| Pattern       | Page Object Model (POM)                   |
| Reporter      | HTML + JUnit XML + JSON (multi-reporter)  |
| CI/CD         | GitLab CI / GitHub Actions                |
| Environment   | Staging — `BASE_URL` from env variable    |

---

## Coding Standards

1. **Always use Page Object Model** — never write locators directly in test files.
2. **Locator priority**: `getByRole` > `getByLabel` > `getByTestId` > CSS (last resort).
3. **Every test must have a tag**: `@smoke`, `@regression`, `@positive`, or `@negative`.
4. **Every test must have a TC ID** in the title.
   - Example: `[TC-012] Tambah merchant Full Plan berhasil`
5. **Always add screenshot attachment** on critical assertion steps using `attachScreenshot()` from `utils/test-helper.ts`.
6. **Use soft assertions** (`expect.soft`) for non-blocking validations.
7. **Never use hard-coded waits** (`page.waitForTimeout`) — always use `expect` with `timeout`.
8. **Group tests** using `test.describe` with the feature name.
9. **Retry strategy**: 2 retries on CI, 0 on local.
10. **Always add a custom error message** on every `expect()` call.

---

## File Structure

```
tests/
  merchant/
    create-merchant.spec.ts
    edit-merchant.spec.ts
    delete-merchant.spec.ts
pages/
  BasePage.ts
  merchant/
    MerchantListPage.ts
    MerchantFormPage.ts
utils/
  test-helper.ts    ← generateMid, attachTestMetadata, attachScreenshot
  helpers.ts        ← requireEnv, toNumberString
  api-helper.ts     ← for test data setup via API
data/
  *.json            ← data-driven test inputs
```

---

## Response Format

When generating a test file, **always produce in this order**:

1. **The Page Object file** (e.g. `MerchantFormPage.ts`)
2. **The spec file** (e.g. `create-merchant.spec.ts`)
3. **Any helper needed** (e.g. additions to `utils/test-helper.ts`)

Do not skip any of these three.

---

## Task-Level Prompt (use this every time you generate a new test)

```
Generate a Playwright TypeScript test for the following scenario.

## Feature
[FEATURE NAME — e.g.: User Management - Merchant]

## Test Cases to Cover
Positive:
- [TC-012] Tambah merchant dengan Full Plan berhasil
- [TC-013] Tambah merchant dengan POS Plan berhasil

Negative:
- [TC-037] Simpan merchant tanpa mengisi Nama Company — harus muncul validation message
- [TC-039] Input MID duplicate — harus muncul error MID sudah terdaftar

## Page URL
/merchant

## Key Locators (dari UI)
- Button "Buat Merchant" : role=button, name="Buat Merchant"
- Field "Nama Company"   : label="Nama Company"
- Field "MID"            : label="MID"
- Plan selector          : role=radio (Full Plan / POS Plan / VA Plan / QRIS Report Plan)
- Button "Simpan"        : role=button, name="Simpan Merchant"
- Validation message     : role=alert atau text locator

## Requirements
1. Create the Page Object Model file first
2. Create the spec file with all test cases above
3. Tag each test: @positive or @negative, and @smoke for happy path
4. Add screenshot attachment after each critical assertion
5. Use expect with descriptive error message on every assertion
6. Add test metadata attachment (tc_id, feature, priority) at start of each test
7. Handle both success toast/notification and error message assertions
8. Follow the project coding standards from COPILOT_INSTRUCTIONS.md
```

---

## Helper Reference

### `utils/test-helper.ts`

| Function | Purpose |
|---|---|
| `generateMid(prefix?)` | Generates a unique MID for test isolation |
| `attachTestMetadata(testInfo, { tc_id, feature, priority })` | Attaches TC metadata to the HTML report |
| `attachScreenshot(page, testInfo, label)` | Attaches a full-page screenshot to the HTML report |

### Example usage in a test

```typescript
import { test, expect } from '@playwright/test';
import { MerchantListPage } from '../../pages/merchant/MerchantListPage';
import { MerchantFormPage } from '../../pages/merchant/MerchantFormPage';
import { generateMid, attachTestMetadata, attachScreenshot } from '../../utils/test-helper';

test.describe('User Management - Merchant @regression', () => {

  test('[TC-012] Tambah merchant dengan Full Plan berhasil @positive @smoke', async ({ page }) => {

    await attachTestMetadata(test.info(), {
      tc_id:    'TC-012',
      feature:  'User Management - Merchant',
      priority: 'High',
    });

    const listPage = new MerchantListPage(page);
    const formPage = new MerchantFormPage(page);

    await listPage.goto();
    await listPage.clickBuatMerchant();
    await formPage.expectFormVisible();
    await attachScreenshot(page, test.info(), 'TC012_01_form_opened');

    await formPage.fillAndSubmit({
      namaCompany: 'PT Automation Full Plan',
      mid: generateMid(),
      plan: 'Full Plan',
    });

    await expect(
      page.getByRole('alert'),
      '[TC-012] Success toast should appear after creating a Full Plan merchant',
    ).toBeVisible({ timeout: 10_000 });

    await attachScreenshot(page, test.info(), 'TC012_02_success_toast');
  });

});
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `APP_URL` | Base URL of the staging app | `https://uat-manjo.mitrapembayaran.com` |
| `API_BASE_URL` | Backend API base URL | `https://mmsapi-test.manjo.co.id` |
| `API_KEY` | Alto API key | `akey_...` |
| `VALIDATION_KEY` | Alto HMAC validation key | `vkey_...` |
| `DUPLICATE_MID` | Pre-existing MID for TC-039 duplicate test | `DUPLICATE001` |

---

*Last updated: 2026-05-31*
