/**
 * Libellés du catalogue et de la disponibilité.
 *
 * La distinction entre « vendu » et « épuisé » n'est pas cosmétique : un
 * tambour est une pièce unique, il ne revient pas ; un accessoire se
 * réapprovisionne.
 */
export const catalog = {
  // Disponibilité
  available: "Disponible",
  sold: "Vendu",
  outOfStock: "Momentanément épuisé",
  uniquePiece: "Pièce unique",
  uniquePieceNote:
    "Cet instrument existe en un seul exemplaire. Une fois vendu, il ne sera pas refait à l'identique.",
  soldNote: "Cette pièce a trouvé son propriétaire.",
  seeAvailable: "Voir les pièces disponibles",
  inStockCount: (n: number) =>
    n > 1 ? `${n} exemplaires disponibles` : "Dernier exemplaire",

  // Fiche produit
  addToCart: "Ajouter au panier",
  inCart: "Dans votre panier — voir le panier",
  removeItem: "Retirer cet article du panier",
  decreaseQuantity: "Diminuer la quantité",
  increaseQuantity: "Augmenter la quantité",
  shippingDelay: (delay: string) => `Expédié sous ${delay}`,

  // États vides
  noProducts: "Aucun produit ne correspond à votre recherche.",
  clearFilters: "Effacer les filtres",
  emptyCart: "Votre panier est vide.",
  backToShop: "Découvrir les tambours",
} as const;
