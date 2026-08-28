/**
 * Libellés de l'authentification et de l'espace compte.
 */
export const account = {
  // Connexion
  signInTitle: "Se connecter",
  signInDescription: "Connectez-vous à votre compte",
  signIn: "Se connecter",
  signingIn: "Connexion en cours…",
  noAccount: "Vous n'avez pas de compte ?",
  goSignUp: "Inscrivez-vous",
  goSignIn: "Connectez-vous",

  // Inscription
  signUpTitle: "Créer un compte",
  signUpDescription: "Renseignez vos informations pour créer votre compte",
  signUp: "Créer mon compte",
  signingUp: "Création en cours…",
  hasAccount: "Vous avez déjà un compte ?",
  confirmPassword: "Confirmation du mot de passe",

  // Navigation de l'espace compte
  profile: "Mon profil",
  orders: "Mes commandes",

  // Profil
  profileTitle: "Mon profil",
  updateProfile: "Mettre à jour mon profil",

  // Historique des commandes
  ordersTitle: "Mes commandes",
  orderReference: "Référence",
  orderedOn: "Date",
  paid: "Paiement",
  delivered: "Expédition",
  notPaidShort: "En attente",
  notDeliveredShort: "Pas encore expédiée",
  noOrders: "Vous n'avez pas encore passé de commande.",
} as const;
