export const LoginLogoutSelector = {
  // ── Login Form ──
  emailInput       : 'input[name="email"]',
  passwordInput    : 'input[name="password"]',
  submitButton     : 'button:has-text("Login")',

  // ── Logout / Header ──
  // btnProfile biasanya tidak punya aria-label eksplisit, tapi bisa discoped secara spesifik
  btnProfile       : 'button:has(span.font-medium)',
  
  // Dihapus 'button:has-text("Log Out")' karena memicu strict mode violation
  // Locator untuk logout akan ditangani langsung di Page Object menggunakan getByRole + scoping
} as const;
