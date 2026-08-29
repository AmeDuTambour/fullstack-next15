export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "L'Âme Du Tambour";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Fabrication artisanale de tambours traditionnels";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInFormDefaultValues = {
  email: "",
  password: "",
};

export const signUpFormDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};

// Le parsing est `split(", ")` : dans .env, la virgule doit être suivie
// d'une espace. Les libellés affichés sont dans PAYMENT_METHOD_LABELS.
export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["Stripe", "PayPal", "Transfer"];

/**
 * Déplacé dans le référentiel de libellés (`lib/labels/payment.ts`).
 * Réexporté ici pour ne casser aucun appelant existant.
 */
export { methodLabels as PAYMENT_METHOD_LABELS } from "@/lib/labels/payment";

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "Stripe";

// 2 par défaut paginait la boutique deux produits par page.
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const productBaseDefaultValue = {
  name: "",
  slug: "",
  categoryId: "",
  stock: 1,
  images: [],
  price: "0",
  description: "",
  codeIdentifier: "",
  isFeatured: false,
  banner: "",
  isPublished: false,
};

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ")
  : ["admin", "user"];

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";

export const articleFormDefaultValues = {
  title: "",
  slug: "",
  isFeatured: false,
  banner: "",
};

export const articleSectionFormDefaultValues = {
  title: "",
  body: "",
  image: "",
  youTubeUrl: "",
};

/**
 * Délai d'expédition annoncé aux acheteurs.
 *
 * ⚠️ Valeur NON VÉRIFIÉE. Le propriétaire du dépôt n'est pas l'artisan et ne
 * connaît pas le délai réel ; c'est une estimation posée pour débloquer le
 * travail. À confirmer par Julien avant toute mise en ligne, au même titre que
 * les textes de remplissage des articles.
 *
 * En configuration et non dans un composant : la corriger ne doit demander ni
 * recherche dans le code, ni redéploiement.
 */
export const SHIPPING_DELAY =
  process.env.NEXT_PUBLIC_SHIPPING_DELAY || "2 à 4 jours ouvrés";
