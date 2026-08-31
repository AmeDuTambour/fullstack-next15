/**
 * Messages d'échec présentés au visiteur.
 *
 * Le message technique d'origine n'atteint jamais cet objet : il est journalisé
 * côté serveur. `unexpected` est le repli unique, volontairement identique quelle
 * que soit la cause — un visiteur ne doit pas pouvoir déduire la nature d'un
 * échec interne à partir de nuances de formulation.
 */
export const errors = {
  unexpected: "Une erreur est survenue. Merci de réessayer.",
  notAuthenticated: "Vous devez être connecté pour effectuer cette action.",
  notAuthorized: "Vous n'avez pas les droits nécessaires pour cette action.",
  notFound: "Cet élément est introuvable.",

  /** Contrainte d'unicité : le champ est nommé en clair, jamais par sa colonne. */
  alreadyExists: (field: string) => `${field} est déjà utilisé.`,

  /** Noms lisibles des champs, pour les messages ci-dessus. */
  fieldNames: {
    email: "Cette adresse e-mail",
    slug: "Ce lien",
    name: "Ce nom",
    codeIdentifier: "Ce code produit",
    material: "Ce type de peau",
    size: "Cette dimension",
  } as Record<string, string>,
} as const;
