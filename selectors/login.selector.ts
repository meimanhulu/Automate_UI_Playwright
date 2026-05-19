// selectors/login.selector.ts

export const LoginSelector = {
  // ── Input Fields ──
  emailInput       : 'input[name="email"]',
  passwordInput    : 'input[name="password"]',

  // ── Buttons ──
  submitButton     : 'button[type="submit"]',
  forgotPassword   : 'a:text("Forgot Password")',
  signUpLink       : 'a:text("Sign Up")',

  // ── Messages ──
  errorMessage     : '[data-testid="error-message"]',
  successMessage   : '[data-testid="success-message"]',

  // ── Loading ──
  spinner          : '.loading-spinner',
} as const;