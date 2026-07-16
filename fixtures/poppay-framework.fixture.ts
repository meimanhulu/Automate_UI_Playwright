/**
 * @file poppay-framework.fixture.ts
 * @description Composed fixture: Poppay auth + Framework capabilities.
 *
 * This is the main entry point for all Poppay UAT tests.
 *
 * Provides automatically (no test code required):
 *  - Auto login to https://uat.pg-poppay.com before each test
 *  - Auto logout after each test
 *  - Auto screenshot on test failure
 *  - Structured execution logging per test
 *
 * Provides on request (destructure from test params):
 *  - logger:            TestLogger    — file-based structured logging
 *  - downloadValidator: DownloadValidator — validates downloads with evidence
 *
 * Usage:
 *   import { test, expect } from '../../fixtures/poppay-framework.fixture';
 *
 *   test('TC-OUT-001', async ({ page, logger, downloadValidator }) => {
 *     // page is already authenticated
 *     // logger writes to reports/logs/
 *     // failure screenshot is automatic
 *   });
 */

import { mergeTests, expect } from '@playwright/test';
import { test as frameworkTest } from './framework.fixture';
import { test as authTest }      from './poppay-auth.fixture';

export const test = mergeTests(frameworkTest, authTest);

export { expect };
