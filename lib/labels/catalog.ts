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
  seeAvailable: "Voir les pièces disponibles",
  inStockCount: (n: number) =>
    n > 1 ? `${n} exemplaires disponibles` : "Dernier exemplaire",

  // Fiche produit
  addToCart: "Ajouter au panier",
  removeFromCart: "Retirer du panier",
  removeItem: "Retirer cet article du panier",
  decreaseQuantity: "Diminuer la quantité",
  increaseQuantity: "Augmenter la quantité",
  shippingDelay: (delay: string) => `Expédié sous ${delay}`,

  // États vides
  shopTitle: "La boutique",
  categories: "Catégories",
  skinType: "Type de peau",
  dimensions: "Dimensions",
  allFilter: "Tous",
  drums: "Tambours",
  accessories: "Accessoires",
  sortBy: "Trier par",
  searchPlaceholder: "Rechercher",
  searchResultsFor: (query: string) => `Recherche : « ${query} »`,
  resultCount: (n: number) =>
    n === 0
      ? "Aucun instrument ne correspond."
      : n === 1
        ? "1 instrument trouvé."
        : `${n} instruments trouvés.`,
  clearSearch: "Voir tout le catalogue",
  searchLabel: "Rechercher dans la boutique",
  latestArrivals: "Derniers instruments",
  browseShop: "Voir toute la boutique",
  productCount: (n: number) =>
    n > 1 ? `${n} tambours et accessoires` : `${n} pièce`,
  noProducts: "Aucun produit ne correspond à votre recherche.",
  clearFilters: "Effacer les filtres",
  emptyCart: "Votre panier est vide.",
  backToShop: "Découvrir les tambours",
  proceedToCheckout: "Passer au paiement",
} as const;
