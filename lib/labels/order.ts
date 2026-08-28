/**
 * Libellés du panier, du tunnel d'achat et de la page de commande.
 */
export const order = {
  // Page de commande
  title: (reference: string) => `Commande ${reference}`,
  paymentMethod: "Moyen de paiement",
  shippingAddress: "Adresse de livraison",
  items: "Articles commandés",

  // Colonnes du récapitulatif
  itemsSubtotal: "Sous-total",
  tax: "Dont TVA",
  shipping: "Livraison",
  total: "Total",

  // États de paiement et de livraison
  paidAt: (date: string) => `Payée le ${date}`,
  awaitingPayment: "En attente de paiement",
  deliveredAt: (date: string) => `Expédiée le ${date}`,
  notDelivered: "Pas encore expédiée",

  // Actions d'administration
  markAsPaid: "Marquer comme payée",
  markAsDelivered: "Marquer comme expédiée",

  // Paiement par carte
  cardPaymentTitle: "Paiement par carte bancaire",
  payAmount: (amount: string) => `Payer ${amount}`,
  paymentInProgress: "Paiement en cours…",
  paymentError: "Le paiement n'a pas abouti. Merci de réessayer.",
  paypalLoading: "Chargement de PayPal…",
  paypalError: "PayPal n'a pas pu être chargé.",

  // Virement bancaire — une étape à venir, pas un échec
  transferPendingTitle: "Votre commande est enregistrée",
  transferPendingBody:
    "Nous vous envoyons par e-mail les coordonnées bancaires pour le virement. " +
    "Votre tambour est réservé le temps que le paiement nous parvienne.",

  // Confirmation
  thanksTitle: "Merci pour votre commande",
  thanksBody: "Nous préparons votre envoi et vous tenons informé par e-mail.",
  viewOrder: "Voir ma commande",
} as const;
