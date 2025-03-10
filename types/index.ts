import {
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentResultSchema,
  insertArticleSchema,
  insertArticleSectionSchema,
  insertArticleCommentSchema,
  contactFormSchema,
  ProductSchema,
} from "@/lib/validators";
import { z } from "zod";

export type DrumSpecs = {
  skinType: {
    id: string;
    material: string;
  };
  dimensions: {
    id: string;
    size: string;
  };
};

export type OtherSpecs = {
  size: string;
  color: string;
  material: string;
};

export type Product = Omit<z.infer<typeof ProductSchema>, "price"> & {
  id: string;
  price: string;
  specifications?: DrumSpecs | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
  paymentResult: PaymentResult;
};
export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type Article = z.infer<typeof insertArticleSchema> & {
  id: string;
  thumbnail?: string | null;
  sections: ArticleSection[];
  comments: ArticleComment[];
  category: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ArticleSection = z.infer<typeof insertArticleSectionSchema> & {
  sectionId: string;
};

export type ArticleComment = z.infer<typeof insertArticleCommentSchema> & {
  id: string;
  userId: string;
  articleId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactFormData = z.infer<typeof contactFormSchema>;
