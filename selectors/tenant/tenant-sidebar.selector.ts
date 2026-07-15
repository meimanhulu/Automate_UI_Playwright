export const TenantSidebarSelector = {

  sidebar: 'button:has(svg)',
  menuTenant: 'li[role="presentation"]:has(p:text-is("Tenant")) > div > button',
  menuTenantExpanded: 'li[role="presentation"]:has(> div p:text-is("Tenant")) button.rotate-180',
  subMenuAggregate: 'li[role="presentation"]:has(> div p:text-is("Aggregator"))',
  subMenuMerchant: 'li[role="presentation"]:has(> div p:text-is("Merchant"))',
  subMenuAccountRecipient: 'li[role="presentation"]:has(> div p:text-is("Account Recipient"))',
  subMenuMerchantAccount: 'li[role="presentation"]:has(> div p:text-is("Merchant Account"))',

  // ── Active State Indicator ─────────────────────────────────────────────────
  /** Class / attribute yang menandakan sub-menu sedang aktif (selected) */
  activeSubMenu: 'ul li[role="presentation"]:has(p:text-is("Merchant"))',

} as const;
