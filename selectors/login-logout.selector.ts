export const LoginLogoutSelector = {
  // ── Login Form ──
  emailInput       : 'input[name="email"]',
  passwordInput    : 'input[name="password"]',
  submitButton     : 'button:has-text("Login")',

  // ── Logout / Header ──
  // Profile avatar - it's a div, not a button
  btnProfile       : 'div.rounded-full:has(span.font-medium.text-white)',
  
  // Logout button - it's a button with "Log Out" text
  btnLogout        : 'button:has-text("Log Out")',
} as const;
