import { z } from "zod";
import { PAYMENT_METHODS } from "./constants";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exatcly two decimal places"
  );

export const baseProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  categoryId: z.string().uuid(),
  stock: z.coerce.number(),
  images: z.array(z.string().url()),
  isFeatured: z.boolean().optional().nullable(),
  banner: z.string().url().optional().nullable(),
  price: currency,
  description: z.string(),
  codeIdentifier: z.string().optional().nullable(),
  isPublished: z.boolean().optional().default(false),
});

export const updateBaseProductSchema = baseProductSchema.extend({
  id: z.string().min(1, "ID is required"),
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

export const UpdateProductSpecificationsSchema = z.object({
  productId: z.string().uuid("Invalid UUID format for productId"),
  specifications: z.union([
    drumSpecificationsSchema,
    otherSpecificationsSchema,
  ]),
});

export const ProductSchema = baseProductSchema
  .extend({
    specifications: z
      .union([drumSpecificationsSchema, otherSpecificationsSchema])
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
    { message: "Specifications must be either drum or other, but not both." }
  );

export const UpdateProductSchema = baseProductSchema
  .extend({
    id: z.string().uuid("Invalid UUID format"),
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
    { message: "A product cannot have both drum and other specifications." }
  );

export const insertProductCategory = z.object({
  name: z.string().min(1, "Category must contain at least 1 character"),
});

export const updateProductCategory = insertProductCategory.extend({
  id: z.string().uuid("Invalid UUID format"),
});

export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "slug is required"),
  qty: z.number().int().nonnegative("Quantity is required"),
  image: z.string().optional(),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
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
  name: z.string().min(3, "Name must be at lest 3 characters"),
  email: z.string().min(3, "Email must be at lest 3 characters"),
});

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(1, "Role is required"),
});

export const insertArticleSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character"),
  slug: z.string().min(1, "Slug must be at least 3 characters"),
  thumbnail: z.string().nullable().default("").optional(),
  categoryId: z.string().uuid().optional().nullable(),
  isPublished: z.boolean().nullable().default(false),
  isFeatured: z.boolean().nullable().default(false),
  banner: z.string().nullable(),
});

export const updateArticleSchema = insertArticleSchema.extend({
  id: z.string().min(1, "ID is required"),
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
  sectionId: z.string().min(1, "ID is required"),
});

export const insertArticleCommentSchema = z.object({
  title: z.string().min(1, "Title must contain at least 1 character"),
  body: z.string().min(1, "Body must contain at least 1 character"),
});

export const contactFormSchema = z.object({
  name: z.string().min(3, "Name must contain at least 3 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string(),
  message: z.string().nonempty(),
});
