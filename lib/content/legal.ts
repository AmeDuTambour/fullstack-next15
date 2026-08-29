/**
 * Pages d'information : mentions légales, conditions de vente, retours,
 * confidentialité.
 *
 * Le texte de ces pages engage juridiquement Julien. Il n'y a rien à inventer
 * ici et rien à recopier d'un autre site : ce contenu doit venir de lui ou de
 * son conseil. La structure, les adresses et les liens existent donc avant le
 * texte — une page annoncée mais introuvable est pire que pas de page.
 *
 * Chaque page reste accessible tant qu'elle est vide, et le dit franchement au
 * visiteur plutôt que de lui présenter un cadre creux. Renseigner `sections` et
 * `updatedAt` suffit à la publier ; aucun balisage n'est à toucher.
 */
export type LegalSection = {
  heading: string;
  body: string;
};

export type LegalPage = {
  /** Segment d'adresse, en anglais comme le reste des routes. */
  slug: string;
  title: string;
  description: string;
  /** Date de dernière mise à jour, au format ISO. Absente tant que vide. */
  updatedAt?: string;
  sections: LegalSection[];
};

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: "notice",
    title: "Mentions légales",
    description:
      "Identité du vendeur, hébergeur du site et informations légales de L'Âme Du Tambour.",
    sections: [],
  },
  {
    slug: "terms",
    title: "Conditions générales de vente",
    description:
      "Commande, prix, paiement, livraison et garanties applicables aux instruments de L'Âme Du Tambour.",
    sections: [],
  },
  {
    slug: "shipping-returns",
    title: "Livraison et retours",
    description:
      "Délais d'expédition, modalités de livraison et droit de rétractation pour les commandes passées sur L'Âme Du Tambour.",
    sections: [],
  },
  {
    slug: "privacy",
    title: "Politique de confidentialité",
    description:
      "Données personnelles collectées par L'Âme Du Tambour, usage qui en est fait et droits des visiteurs.",
    sections: [],
  },
];

export function getLegalPage(slug: string): LegalPage | undefined {
  return LEGAL_PAGES.find((page) => page.slug === slug);
}

/** Une page vide reste en ligne, mais n'est pas proposée aux moteurs. */
export function isLegalPageWritten(page: LegalPage): boolean {
  return page.sections.length > 0;
}
