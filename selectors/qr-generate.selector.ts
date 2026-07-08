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

  qrImage: '/* GANTI DGN CSS/XPATH (FE tidak pakai test-id) */',
  qrCanvas: 'canvas.qr-code',
  qrContent: '/* GANTI DGN CSS/XPATH (FE tidak pakai test-id) */',
  referenceNo: '/* GANTI DGN CSS/XPATH (FE tidak pakai test-id) */',
  merchantNameText: '/* GANTI DGN CSS/XPATH (FE tidak pakai test-id) */',

  successMessage: '/* GANTI DGN CSS/XPATH (FE tidak pakai test-id) */',
  errorMessage: '/* GANTI DGN CSS/XPATH (FE tidak pakai test-id) */',
  loadingSpinner: '.qr-loading',
} as const;