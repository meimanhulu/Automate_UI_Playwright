export const TenantSidebarSelector = {

  sidebar: 'button:has(svg)',
  menuTenant: 'li[role="presentation"]:has(p:text-is("Tenant")) > div > button',
  menuTenantExpanded: 'li[role="presentation"]:has(> div p:text-is("Tenant")) button.rotate-180',
  subMenuAggregate: '',
  subMenuMerchant: '',
  subMenuAccountRecipient: '',

  /** Sub-menu "Merchant Account" di bawah Tenant */
  subMenuMerchantAccount: '',           // contoh: '#id' atau '.class' atau '[name="..."]'
  // atau   : 'a[href*="/tenant/merchant-account"]'

  // ── Active State Indicator ─────────────────────────────────────────────────
  /** Class / attribute yang menandakan sub-menu sedang aktif (selected) */
  activeSubMenu: '',                    // contoh: '.submenu-item.active'
  // atau   : '[aria-current="page"]'

  // ── Other Sidebar Menu Items (untuk referensi navigasi lain) ─────────────
  /** Menu "Dashboard" */
  menuDashboard: '',                    // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Menu "Master" */
  menuMaster: '',                       // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Menu "Integration" */
  menuIntegration: '',                  // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Menu "Access Management" */
  menuAccessManagement: '',             // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Menu "User Management" */
  menuUserManagement: '',               // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Menu "Transaction" */
  menuTransaction: '',                  // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Menu "Log" */
  menuLog: '',                          // contoh: '#id' atau '.class' atau '[name="..."]'

  /** Menu "Settings" */
  menuSettings: '',                     // contoh: '#id' atau '.class' atau '[name="..."]'

} as const;
