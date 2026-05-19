export const QRGenerateSelector = {
  form: '.qr-form',
  merchantSelect: 'select[name="merchant"]',
  amountInput: 'input[name="amount"]',
  descriptionInput: 'input[name="description"]',

  fileInput: 'input[type="file"]',
  submitBulkButton: 'button:text("Submit Bulk")',

  generateButton: 'button:text("Generate QR")',
  resetButton: 'button:text("Reset")',
  downloadButton: 'button:text("Download")',

  qrImage: '[data-testid="qr-image"]',
  qrCanvas: 'canvas.qr-code',
  qrContent: '[data-testid="qr-content"]',
  referenceNo: '[data-testid="reference-no"]',
  merchantNameText: '[data-testid="merchant-name"]',

  successMessage: '[data-testid="success-message"]',
  errorMessage: '[data-testid="error-message"]',
  loadingSpinner: '.qr-loading',
} as const;