/**
 * Libellés du journal de l'atelier.
 */
export const blog = {
  title: "Blog",
  noArticles: "Aucun article publié pour le moment.",
  backToBlog: "Tous les articles",
  continueReading: "Poursuivre la lecture",
  /**
   * Le regroupement met les noms de catégorie en minuscules pour les
   * rassembler ; l'affichage leur rend leur majuscule.
   */
  categoryHeading: (category: string, count: number) =>
    `${category.charAt(0).toUpperCase()}${category.slice(1)} (${count})`,
  uncategorized: "Sans catégorie",
} as const;
