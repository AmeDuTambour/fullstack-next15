/**
 * Règles métier d'affichage d'un produit.
 *
 * Elles vivent ici, hors des composants, pour une raison précise : trois écrans
 * interprétaient le stock par un simple `stock > 0`, chacun de son côté. C'est
 * ce qui faisait qu'un tambour vendu — parti pour de bon — et un accessoire
 * momentanément épuisé se ressemblaient exactement.
 */

/**
 * Un tambour existe en un seul exemplaire, déjà fabriqué : vendu, il ne revient
 * pas. Un accessoire existe en plusieurs et se réapprovisionne.
 *
 * La distinction est portée par la catégorie, jamais déduite du stock : un
 * accessoire peut légitimement n'avoir qu'un exemplaire restant.
 */
export type ProductNature = "unique" | "reproducible";

export type Availability = "available" | "sold" | "outOfStock";

/**
 * Catégories dont les produits sont des pièces uniques.
 *
 * ⚠️ Une catégorie ajoutée plus tard hérite du comportement de repli
 * (« reproductible ») : elle n'interdira rien et ne promettra aucune rareté.
 * C'est le choix le moins destructeur, mais il est silencieux — une nouvelle
 * catégorie de pièces uniques devra être déclarée ici.
 */
const UNIQUE_PIECE_CATEGORIES = ["Drum"];

export function getProductNature(
  categoryName: string | null | undefined
): ProductNature {
  if (!categoryName) return "reproducible";
  return UNIQUE_PIECE_CATEGORIES.includes(categoryName)
    ? "unique"
    : "reproducible";
}

export function getAvailability(
  nature: ProductNature,
  stock: number
): Availability {
  if (stock > 0) return "available";
  return nature === "unique" ? "sold" : "outOfStock";
}

/** Une pièce unique ne se commande jamais en plusieurs exemplaires. */
export function getMaxOrderableQuantity(
  nature: ProductNature,
  stock: number
): number {
  if (nature === "unique") return Math.min(stock, 1);
  return Math.max(stock, 0);
}

/** Vrai quand l'interface doit proposer de choisir une quantité. */
export function allowsQuantitySelection(nature: ProductNature): boolean {
  return nature === "reproducible";
}
