/**
 * @file tenant-framework.fixture.ts
 * @description Composed fixture: Tenant auth + Framework capabilities.
 *
 * This is the main entry point for all Tenant/Merchant Management tests.
 *
 * Provides automatically (no test code required):
 *  - Auto login before each test (auth.fixture)
 *  - Auto logout after each test
 *  - Auto screenshot on test failure (framework.fixture)
 *  - Structured execution logging per test (framework.fixture)
 *
 * Provides on request (destructure from test params):
 *  - logger:            TestLogger
 *  - downloadValidator: DownloadValidator
 *
 * Usage:
 *   import { test, expect } from '../../fixtures/tenant-framework.fixture';
 */

import { mergeTests, expect } from '@playwright/test';
import { test as frameworkTest } from './framework.fixture';
import { test as authTest }      from './auth.fixture';

export const test = mergeTests(frameworkTest, authTest);

export { expect };
