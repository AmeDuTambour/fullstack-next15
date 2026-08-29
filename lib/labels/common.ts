/**
 * Libellés partagés par plusieurs écrans.
 *
 * Les clés sont en anglais, comme le reste du code, et décrivent le rôle du
 * texte — pas sa formulation. Une clé nommée d'après le texte français devrait
 * changer à chaque révision de rédaction.
 */
export const common = {
  // Actions
  save: "Enregistrer",
  cancel: "Annuler",
  delete: "Supprimer",
  edit: "Modifier",
  create: "Créer",
  confirm: "Confirmer",
  back: "Retour",
  next: "Suivant",
  previous: "Précédent",
  details: "Détails",
  search: "Rechercher",

  // États transitoires
  loading: "Chargement…",
  submitting: "Envoi en cours…",
  processing: "Traitement en cours…",
  deleting: "Suppression en cours…",

  // Champs récurrents
  name: "Nom",
  email: "E-mail",
  password: "Mot de passe",
  role: "Rôle",
  date: "Date",
  price: "Prix",
  quantity: "Quantité",
  total: "Total",
  actions: "Actions",
  product: "Produit",
  status: "Statut",

  // États vides
  none: "Aucun élément",
  deleteComment: "Supprimer ce commentaire",
  send: "Envoyer",
  publish: "Publier",
  placeOrder: "Passer la commande",
  uploadFailed: "L'envoi de l'image a échoué :",
} as const;
