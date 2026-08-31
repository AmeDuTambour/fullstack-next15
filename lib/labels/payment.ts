/**
 * Libellés des moyens de paiement.
 *
 * Les clés — `Stripe`, `PayPal`, `Transfer` — sont des identifiants stockés en
 * base. Elles ne changent pas ; seul leur libellé d'affichage est traduit.
 */
export const methodLabels: Record<string, string> = {
  Stripe: "Carte bancaire",
  PayPal: "PayPal",
  Transfer: "Virement bancaire",
};

export const payment = { methodLabels } as const;
