/**
 * @file validateStep.ts
 * @description Re-exports ValidationHelper for backward-compatible imports.
 * Use `ValidationHelper.ts` directly in new code.
 */
export { validateVisible, validateURL, validateText, validateDownload } from './ValidationHelper';
export type { ValidateVisibleOpts, ValidateURLOpts, ValidateTextOpts, ValidateDownloadOpts, DownloadResult } from './ValidationHelper';
