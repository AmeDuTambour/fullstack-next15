import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentResultSchema,
  insertReviewSchema,
  insertArticleSchema,
  insertArticleSectionSchema,
  insertArticleCommentSchema,
  contactFormSchema,
} from "@/lib/validators";
import { z } from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
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
export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};

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
