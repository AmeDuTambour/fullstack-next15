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

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["Stripe", "Transfer"];

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "Stripe";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 2;

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
