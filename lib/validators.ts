import { z } from "zod";
import { PAYMENT_METHODS } from "./constants";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Le prix doit comporter exactement deux décimales"
  );

export const baseProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  categoryId: z.string().uuid(),
  stock: z.coerce.number(),
  images: z.array(z.string().url()),
  isFeatured: z.boolean(),
  banner: z.string().optional().nullable(),
  price: currency,
  description: z.string().nullable(),
  codeIdentifier: z.string().optional().nullable(),
  isPublished: z.boolean(),
});

export const updateBaseProductSchema = baseProductSchema.extend({
  id: z.string().min(1, "L'identifiant est obligatoire"),
});

export const drumSpecificationsSchema = z.object({
  skinTypeId: z.string().uuid(),
  dimensionsId: z.string().uuid(),
});

export const otherSpecificationsSchema = z.object({
  color: z.string().optional(),
  material: z.string().optional(),
  size: z.string().optional(),
});

export const specificationsSchema = z.union([
  drumSpecificationsSchema,
  otherSpecificationsSchema,
]);

export const UpdateProductSpecificationsSchema = z.object({
  productId: z.string().uuid("Identifiant de produit invalide"),
  specifications: specificationsSchema,
});

export const ProductSchema = baseProductSchema
  .extend({
    specifications: z
      .union([drumSpecificationsSchema, otherSpecificationsSchema])
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.specifications) return true;
      const isDrumSpec = drumSpecificationsSchema.safeParse(
        data.specifications
      ).success;
      const isOtherSpec = otherSpecificationsSchema.safeParse(
        data.specifications
      ).success;

      return isDrumSpec !== isOtherSpec;
    },
    { message: "Les spécifications doivent être celles d'un tambour ou d'un accessoire, pas les deux." }
  );

export const UpdateProductSchema = baseProductSchema
  .extend({
    id: z.string().uuid("Identifiant invalide"),
    drum: drumSpecificationsSchema.optional(),
    other: otherSpecificationsSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.drum && data.other) {
        return false;
      }
      return true;
    },
    { message: "Un produit ne peut pas avoir à la fois des spécifications de tambour et d'accessoire." }
  );

export const insertProductCategory = z.object({
  name: z.string().min(1, "La catégorie doit comporter au moins 1 caractère"),
});

export const updateProductCategory = insertProductCategory.extend({
  id: z.string().uuid("Identifiant invalide"),
});

export const signInFormSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
    email: z.string().email("Adresse e-mail invalide"),
    password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
    confirmPassword: z
      .string()
      .min(6, "La confirmation doit comporter au moins 6 caractères"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Le produit est obligatoire"),
  name: z.string().min(1, "Le nom est obligatoire"),
  slug: z.string().min(1, "Le lien est obligatoire"),
  qty: z.number().int().nonnegative("La quantité est obligatoire"),
  image: z.string().optional(),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Identifiant de panier manquant"),
  userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
  streetAddress: z.string().min(3, "L'adresse doit comporter au moins 3 caractères"),
  city: z.string().min(3, "La ville doit comporter au moins 3 caractères"),
  postalCode: z.string().min(3, "Le code postal doit comporter au moins 3 caractères"),
  country: z.string().min(3, "Le pays doit comporter au moins 3 caractères"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Le moyen de paiement est obligatoire"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Moyen de paiement invalide",
  });

export const insertOrderSchema = z.object({
  userId: z.string().min(1, "L'utilisateur est obligatoire"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Moyen de paiement invalide",
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
  email: z.string().min(3, "L'adresse e-mail doit comporter au moins 3 caractères"),
});

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "L'identifiant est obligatoire"),
  role: z.string().min(1, "Le rôle est obligatoire"),
});

export const insertArticleSchema = z.object({
  title: z.string().min(1, "Le titre doit comporter au moins 1 caractère"),
  slug: z.string().min(1, "Le lien doit comporter au moins 1 caractère"),
  thumbnail: z.string().nullable().default("").optional(),
  categoryId: z.string().uuid().optional().nullable(),
  isPublished: z.boolean().nullable().default(false),
  isFeatured: z.boolean().nullable().default(false),
  banner: z.string().nullable(),
});

export const updateArticleSchema = insertArticleSchema.extend({
  id: z.string().min(1, "L'identifiant est obligatoire"),
});

export const insertArticleSectionSchema = z.object({
  title: z.string().nullable().default(""),
  position: z.coerce.number().int().nonnegative(),
  body: z.string().nullable().default("").optional(),
  image: z.string().nullable().default("").optional(),
  youTubeUrl: z.string().nullable().default("").optional(),
  articleId: z.string().nonempty().optional(),
});

export const updateArticleSectionSchema = insertArticleSectionSchema.extend({
  sectionId: z.string().min(1, "L'identifiant est obligatoire"),
});

export const insertArticleCommentSchema = z.object({
  title: z.string().min(1, "Le titre doit comporter au moins 1 caractère"),
  body: z.string().min(1, "Le message doit comporter au moins 1 caractère"),
});

export const contactFormSchema = z.object({
  name: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
  email: z.string().email("Adresse e-mail invalide"),
  subject: z.string(),
  message: z.string().nonempty(),
});
