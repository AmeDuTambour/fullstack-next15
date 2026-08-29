/**
 * Explication du vocabulaire du métier, à l'usage de la boutique.
 *
 * Les filtres proposent « Peau de chèvre », « Peau de cerf », des diamètres en
 * centimètres. Un acheteur qui découvre l'instrument n'a aucun moyen de savoir
 * ce que ces choix changent au son, au poids ou à l'entretien — il choisit au
 * hasard, ou il ne choisit pas.
 *
 * Le texte doit venir de Julien : il n'y a rien à inventer ici. Les entrées
 * restent vides, et l'emplacement ne s'affiche pas tant qu'il l'est. Renseigner
 * une clé suffit à faire apparaître l'explication sous le groupe de filtres
 * correspondant, sans toucher au balisage.
 */
export const GLOSSARY: Record<string, string> = {
  // "skinType": "…",
  // "dimensions": "…",
};

export function getGlossaryEntry(key: string): string | undefined {
  const entry = GLOSSARY[key];
  return entry && entry.trim().length > 0 ? entry : undefined;
}
