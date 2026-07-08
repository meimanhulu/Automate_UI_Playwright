export const LoginLogoutSelector = {
  // ── Login Form ──
  emailInput       : 'input[name="email"]',
  passwordInput    : 'input[name="password"]',
  submitButton     : 'button:has-text("Login")',

  // ── Logout / Header ──
  btnProfile       : 'button:has(span.font-medium)',
  btnLogout        : 'button:has-text("Log Out")',

  // ── Loading ──
  spinner          : '.loading-spinner', // Keep as fallback if needed
} as const;
