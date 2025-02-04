"use server";

import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { PAGE_SIZE } from "../constants/index";
import { convertToPlainObject, formatError } from "../utils";
import {
  insertBaseProductSchema,
  insertDrumProduct,
  insertOtherProduct,
  updateBaseProductSchema,
} from "../validators";
import { Prisma } from "@prisma/client";

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        drum: {
          include: {
            diameter: true,
            skinType: true,
          },
        },
        other: true,
      },
    });

    if (!product) {
      throw new Error(`Product with slug "${slug}" not found.`);
    }

    return convertToPlainObject(product);
  } catch (error) {
    return { sucess: true, message: formatError(error) };
  }
}

export async function getProductById(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        drum: {
          include: {
            diameter: true,
            skinType: true,
          },
        },
        other: true,
      },
    });

    if (!product) {
      throw new Error(`Product with ID "${productId}" not found.`);
    }

    return convertToPlainObject(product);
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  skinType,
  diameter,
  sort,
  productType,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  skinType?: string;
  diameter?: string;
  sort?: string;
  productType?: "drum" | "other";
}) {
  // Filtre de recherche par nom
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          },
        }
      : {};

  // Filtre par catégorie
  const categoryFilter: Prisma.ProductWhereInput =
    category && category !== "all"
      ? {
          category: {
            name: category,
          },
        }
      : {};

  // Filtre par type de produit (drum ou other)
  const productTypeFilter: Prisma.ProductWhereInput =
    productType === "drum"
      ? { drum: { isNot: null } }
      : productType === "other"
        ? { other: { isNot: null } }
        : {};

  // Filtre par type de peau (skinType)
  const skinTypeFilter: Prisma.ProductWhereInput =
    skinType && skinType !== "all"
      ? {
          drum: {
            skinType: {
              material: {
                equals: skinType,
                mode: "insensitive",
              },
            },
          },
        }
      : {};

  const diameterFilter: Prisma.ProductWhereInput =
    diameter && diameter !== "all"
      ? {
          drum: {
            diameter: {
              size: Number(diameter),
            },
          },
        }
      : {};

  // Requête principale
  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...productTypeFilter,
      ...skinTypeFilter,
      ...diameterFilter,
    },
    include: {
      category: true,
      drum: {
        include: {
          diameter: true,
          skinType: true,
        },
      },
      other: true,
    },
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
          ? { price: "desc" }
          : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  // Compter le nombre total de produits correspondant aux filtres
  const dataCount = await prisma.product.count({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...productTypeFilter,
      ...skinTypeFilter,
      ...diameterFilter,
    },
  });

  return {
    data: convertToPlainObject(data),
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    return { success: true, message: formatError(error) };
  }
}

export async function createProduct(
  data: z.infer<typeof insertBaseProductSchema>
) {
  try {
    const baseProduct = insertBaseProductSchema.parse(data);

    const createdProduct = await prisma.product.create({
      data: {
        name: baseProduct.name,
        slug: baseProduct.slug,
        categoryId: baseProduct.categoryId ?? "",
        stock: baseProduct.stock,
        images: baseProduct.images,
        isFeatured: baseProduct.isFeatured,
        banner: baseProduct.banner,
        price: Number(baseProduct.price),
        codeIdentifier: baseProduct.codeIdentifier,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
      product: convertToPlainObject(createdProduct),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateBaseProduct(
  data: z.infer<typeof updateBaseProductSchema>
) {
  try {
    const product = updateBaseProductSchema.parse(data);

    const productExists = await prisma.product.findUnique({
      where: { id: product.id },
    });

    if (!productExists) {
      throw new Error("Product not found");
    }

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        slug: product.slug,
        categoryId: product.categoryId ?? "",
        stock: product.stock,
        images: product.images,
        isFeatured: product.isFeatured,
        banner: product.banner,
        price: Number(product.price),
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully",
      product: convertToPlainObject(updatedProduct),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createDrumProduct(
  data: z.infer<typeof insertDrumProduct> & { productId: string }
) {
  try {
    const drumData = insertDrumProduct.parse(data);

    const productExists = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!productExists) {
      throw new Error("Base product not found");
    }

    const existingDrum = await prisma.drum.findUnique({
      where: { productId: data.productId },
    });

    if (existingDrum) {
      throw new Error("Drum already exists for this product");
    }

    const drum = await prisma.drum.create({
      data: {
        productId: data.productId,
        skinTypeId: drumData.skinTypeId || "",
        diameterId: drumData.diameterId || "",
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Drum created successfully",
      drum: convertToPlainObject(drum),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createOtherProduct(
  data: z.infer<typeof insertOtherProduct> & { productId: string }
) {
  try {
    const otherData = insertOtherProduct.parse(data);

    const productExists = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!productExists) {
      throw new Error("Base product not found");
    }

    const existingOther = await prisma.other.findUnique({
      where: { productId: data.productId },
    });

    if (existingOther) {
      throw new Error("Other already exists for this product");
    }

    const other = await prisma.other.create({
      data: {
        productId: data.productId,
        color: otherData.color || null,
        material: otherData.material || null,
        size: otherData.size || null,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Other created successfully",
      other: convertToPlainObject(other),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllProductCategories() {
  const categories = await prisma.productCategory.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return convertToPlainObject(categories);
}

export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return convertToPlainObject(data);
}

export async function createSkinType(data: { material: string }) {
  try {
    const skinType = await prisma.skinType.create({
      data: {
        material: data.material,
      },
    });

    revalidatePath("/admin/skin-types");

    return {
      success: true,
      message: "SkinType created successfully",
      skinType: convertToPlainObject(skinType),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllSkinTypes() {
  try {
    const skinTypes = await prisma.skinType.findMany();
    return convertToPlainObject(skinTypes);
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateSkinType(id: string, data: { material: string }) {
  try {
    const skinType = await prisma.skinType.update({
      where: { id },
      data: {
        material: data.material,
      },
    });

    revalidatePath("/admin/skin-types");

    return {
      success: true,
      message: "SkinType updated successfully",
      skinType: convertToPlainObject(skinType),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteSkinType(id: string) {
  try {
    await prisma.skinType.delete({
      where: { id },
    });

    revalidatePath("/admin/skin-types");

    return { success: true, message: "SkinType deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createDrumDiameter(data: { size: number }) {
  try {
    const diameter = await prisma.drumDiameter.create({
      data: {
        size: data.size,
      },
    });

    revalidatePath("/admin/diameters");

    return {
      success: true,
      message: "DrumDiameter created successfully",
      diameter: convertToPlainObject(diameter),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllDrumDiameters() {
  try {
    const diameters = await prisma.drumDiameter.findMany();
    return convertToPlainObject(diameters);
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateDrumDiameter(id: string, data: { size: number }) {
  try {
    const diameter = await prisma.drumDiameter.update({
      where: { id },
      data: {
        size: data.size,
      },
    });

    revalidatePath("/admin/diameters");

    return {
      success: true,
      message: "DrumDiameter updated successfully",
      diameter: convertToPlainObject(diameter),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteDrumDiameter(id: string) {
  try {
    await prisma.drumDiameter.delete({
      where: { id },
    });

    revalidatePath("/admin/diameters");

    return { success: true, message: "DrumDiameter deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
