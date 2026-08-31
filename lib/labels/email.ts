export const email = {
  receiptSubject: (reference: string) => `Confirmation de commande ${reference}`,
  contactSubject: "Nouveau message depuis le site",

  shipmentSubject: (reference: string) => `Votre commande ${reference} est partie`,
  shipmentTitle: "Votre commande est en route",
  shipmentBody: (name: string) =>
    `Bonjour ${name}, votre commande a été expédiée.`,
  carrierLine: "Transporteur :",
  trackingLine: "Numéro de suivi :",
  followParcel: "Suivre mon colis",
  viewOrder: "Voir ma commande",
} as const;
