export const DashboardSidebarSelector = {
  menuDashboard: 'li[role="presentation"]:has(p:text-is("Dashboard")) > div > button',
  menuDashboardExpanded: 'li[role="presentation"]:has(> div p:text-is("Dashboard")) button.rotate-180',
  
  // ── Sub-menus (Draft) ──────────────────────────────────────────────────────
  subMenuGenerateQR: 'li[role="presentation"]:has(> div p:text-is("Generate QR"))',
  
  // ── Active State Indicator ─────────────────────────────────────────────────
  activeSubMenu: 'ul li[role="presentation"]:has(p:text-is("Generate QR"))',
} as const;
