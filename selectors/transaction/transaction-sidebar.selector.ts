export const TransactionSidebarSelector = {
  menuTransaction: 'li[role="presentation"]:has(p:text-is("Transaction")) > div > button',
  menuTransactionExpanded: 'li[role="presentation"]:has(> div p:text-is("Transaction")) button.rotate-180',
  
  // ── Sub-menus ──────────────────────────────────────────────────────────────
  subMenuIncoming: 'p:text-is("Incoming")',
  subMenuOutgoing: 'p:text-is("Outgoing")',

  // ── Active State Indicator ─────────────────────────────────────────────────
  activeSubMenuIncoming: 'ul li[role="presentation"]:has(p:text-is("Incoming"))',
  activeSubMenuOutgoing: 'ul li[role="presentation"]:has(p:text-is("Outgoing"))',
} as const;
