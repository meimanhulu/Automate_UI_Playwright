/**
 * @file AssertionHelper.ts
 * @description Reusable assertion helpers with mandatory descriptive messages.
 *
 * Senior SDET Standard:
 * Every assertion MUST include context explaining what is being validated and why.
 * This makes debugging faster and reports more meaningful for all stakeholders.
 *
 * Usage:
 *   await assertVisible(page.locator('[data-testid="export-btn"]'), 'Export button should be visible before download');
 *   await assertText(header, 'Dashboard', 'Page title should confirm successful navigation');
 */

import { expect, Locator, Page } from '@playwright/test';
import { TestLogger } from './Logger';

export interface AssertionContext {
  logger?: TestLogger;
  screenshotLabel?: string;
}

/**
 * Assert element is visible with mandatory descriptive message.
 * Logs PASS/FAIL to structured logger if provided.
 */
export async function assertVisible(
  locator: Locator,
  message: string,
  context?: AssertionContext
): Promise<void> {
  try {
    await expect(locator, message).toBeVisible({ timeout: 10000 });
    context?.logger?.pass(message);
  } catch (error) {
    context?.logger?.fail(message, {
      expected: 'visible',
      actual: 'not visible',
      locator: locator.toString(),
    });
    throw error;
  }
}

/**
 * Assert element is hidden with mandatory descriptive message.
 */
export async function assertHidden(
  locator: Locator,
  message: string,
  context?: AssertionContext
): Promise<void> {
  try {
    await expect(locator, message).toBeHidden({ timeout: 10000 });
    context?.logger?.pass(message);
  } catch (error) {
    context?.logger?.fail(message, {
      expected: 'hidden',
      actual: 'visible',
      locator: locator.toString(),
    });
    throw error;
  }
}

/**
 * Assert element contains expected text with mandatory descriptive message.
 */
export async function assertText(
  locator: Locator,
  expectedText: string | RegExp,
  message: string,
  context?: AssertionContext
): Promise<void> {
  try {
    await expect(locator, message).toContainText(expectedText, { timeout: 10000 });
    context?.logger?.pass(message);
  } catch (error) {
    const actualText = await locator.textContent().catch(() => 'N/A');
    context?.logger?.fail(message, {
      expected: typeof expectedText === 'string' ? expectedText : expectedText.source,
      actual: actualText || 'empty',
      locator: locator.toString(),
    });
    throw error;
  }
}

/**
 * Assert element is enabled with mandatory descriptive message.
 */
export async function assertEnabled(
  locator: Locator,
  message: string,
  context?: AssertionContext
): Promise<void> {
  try {
    await expect(locator, message).toBeEnabled({ timeout: 10000 });
    context?.logger?.pass(message);
  } catch (error) {
    context?.logger?.fail(message, {
      expected: 'enabled',
      actual: 'disabled',
      locator: locator.toString(),
    });
    throw error;
  }
}

/**
 * Assert element is disabled with mandatory descriptive message.
 */
export async function assertDisabled(
  locator: Locator,
  message: string,
  context?: AssertionContext
): Promise<void> {
  try {
    await expect(locator, message).toBeDisabled({ timeout: 10000 });
    context?.logger?.pass(message);
  } catch (error) {
    context?.logger?.fail(message, {
      expected: 'disabled',
      actual: 'enabled',
      locator: locator.toString(),
    });
    throw error;
  }
}

/**
 * Assert URL matches expected pattern with mandatory descriptive message.
 */
export async function assertURL(
  page: Page,
  expectedUrl: string | RegExp,
  message: string,
  context?: AssertionContext
): Promise<void> {
  try {
    await expect(page, message).toHaveURL(expectedUrl, { timeout: 10000 });
    context?.logger?.pass(message);
  } catch (error) {
    const actualUrl = page.url();
    context?.logger?.fail(message, {
      expected: typeof expectedUrl === 'string' ? expectedUrl : expectedUrl.source,
      actual: actualUrl,
    });
    throw error;
  }
}

/**
 * Assert element count matches expectation with mandatory descriptive message.
 */
export async function assertCount(
  locator: Locator,
  expectedCount: number,
  message: string,
  context?: AssertionContext
): Promise<void> {
  try {
    await expect(locator, message).toHaveCount(expectedCount, { timeout: 10000 });
    context?.logger?.pass(message);
  } catch (error) {
    const actualCount = await locator.count();
    context?.logger?.fail(message, {
      expected: String(expectedCount),
      actual: String(actualCount),
      locator: locator.toString(),
    });
    throw error;
  }
}

/**
 * Assert input value matches expected with mandatory descriptive message.
 */
export async function assertValue(
  locator: Locator,
  expectedValue: string | RegExp,
  message: string,
  context?: AssertionContext
): Promise<void> {
  try {
    await expect(locator, message).toHaveValue(expectedValue, { timeout: 10000 });
    context?.logger?.pass(message);
  } catch (error) {
    const actualValue = await locator.inputValue().catch(() => 'N/A');
    context?.logger?.fail(message, {
      expected: typeof expectedValue === 'string' ? expectedValue : expectedValue.source,
      actual: actualValue,
      locator: locator.toString(),
    });
    throw error;
  }
}

/**
 * Assert element has specific attribute value with mandatory descriptive message.
 */
export async function assertAttribute(
  locator: Locator,
  attributeName: string,
  expectedValue: string | RegExp,
  message: string,
  context?: AssertionContext
): Promise<void> {
  try {
    await expect(locator, message).toHaveAttribute(attributeName, expectedValue, { timeout: 10000 });
    context?.logger?.pass(message);
  } catch (error) {
    const actualValue = await locator.getAttribute(attributeName).catch(() => null);
    context?.logger?.fail(message, {
      expected: typeof expectedValue === 'string' ? expectedValue : expectedValue.source,
      actual: actualValue || 'null',
      locator: locator.toString(),
    });
    throw error;
  }
}
