export const DashboardSelector = {
  dashboardContainer: '[data-testid="dashboard-page"]',

  menuIcon: '[data-testid="menu-icon"]',
  navMenu: '[data-testid="nav-menu"]',
  generateQRLink: 'text=Generate QR',
  transactionLink: 'text=Transactions',

  merchantName: '[data-testid="merchant-name"]',
  balanceAmount: '[data-testid="balance"]',
} as const;