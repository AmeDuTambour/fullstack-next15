import {
  insertBaseProductSchema,
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
  insertProductCategory,
  insertDrumProduct,
  insertOtherProduct,
} from "@/lib/validators";
import { z } from "zod";

export type Product = z.infer<typeof insertBaseProductSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  category: ProductCategory;
  drum?: Drum;
  other?: Other;
};

export type ProductCategory = z.infer<typeof insertProductCategory> & {
  id: string;
  products: Product[];
};

export type Drum = z.infer<typeof insertDrumProduct> & {
  productId: string;
  product: Product;
  diameter?: DrumDiameter;
  skinType?: SkinType;
};

export type DrumDiameter = {
  id: string;
  size: number;
  drums: Drum[];
};

export type SkinType = {
  id: string;
  material: string;
  drum: Drum[];
};

export type Other = z.infer<typeof insertOtherProduct> & {
  productId: string;
  product: Product;
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
