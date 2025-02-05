"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { PAGE_SIZE } from "../constants/index";
import { convertToPlainObject, formatError } from "../utils";
import {
  ProductSchema,
  UpdateProductSchema,
  UpdateProductSpecificationsSchema,
} from "../validators";

import { PrismaClient } from "@prisma/client";
import { Product } from "@/types";

const prisma = new PrismaClient();

async function getProductSpecifications(product: Product) {
  if (!product) {
    console.error("❌ Produit non défini.");
    return null;
  }

  if (product.drum) {
    const drumSpecs = await prisma.drum.findUnique({
      where: { productId: product.id },
      include: { skinType: true, dimensions: true },
    });

    if (!drumSpecs) {
      console.error(
        `❌ Aucune spécification trouvée pour le produit ${product.name}`
      );
    }

    return drumSpecs;
  }

  if (product.other) {
    return await prisma.other.findUnique({
      where: { productId: product.id },
    });
  }

  return {};
}

export async function getLatestProducts() {
  const products = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  const productsWithSpecs = await Promise.all(
    products.map(async (product) => ({
      ...product,
      specifications: await getProductSpecifications(product),
    }))
  );

  return convertToPlainObject(productsWithSpecs);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new Error(`Product with slug "${slug}" not found.`);
  }

  const specifications = await getProductSpecifications(product);

  return convertToPlainObject({ ...product, specifications });
}

export async function getProductById(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new Error(`Product with ID "${productId}" not found.`);
    }

    const specifications = await getProductSpecifications(product);

    return convertToPlainObject({ ...product, specifications });
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new Error("Product not found");

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createProduct(data: z.infer<typeof ProductSchema>) {
  try {
    const baseProduct = ProductSchema.parse(data);

    const createdProduct = await prisma.product.create({
      data: {
        name: baseProduct.name,
        slug: baseProduct.slug,
        categoryId: baseProduct.categoryId,
        stock: baseProduct.stock,
        images: baseProduct.images,
        isFeatured: baseProduct.isFeatured ?? false,
        banner: baseProduct.banner,
        price: Number(baseProduct.price),
        codeIdentifier: baseProduct.codeIdentifier,
      },
    });

    if (baseProduct.productType === "drum") {
      await prisma.drum.create({
        data: {
          productId: createdProduct.id,
          skinTypeId: baseProduct.specifications.skinTypeId,
          dimensionsId: baseProduct.specifications.dimensionsId,
        },
      });
    } else if (baseProduct.productType === "other") {
      await prisma.other.create({
        data: {
          productId: createdProduct.id,
          color: baseProduct.specifications.color,
          material: baseProduct.specifications.material,
          size: baseProduct.specifications.size,
        },
      });
    }

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
  data: z.infer<typeof UpdateProductSchema>
) {
  try {
    const product = UpdateProductSchema.parse(data);

    const existingProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        slug: product.slug,
        categoryId: product.categoryId,
        stock: product.stock,
        images: product.images,
        isFeatured: product.isFeatured ?? false,
        banner: product.banner,
        price: Number(product.price),
        codeIdentifier: product.codeIdentifier,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Base product updated successfully",
      product: convertToPlainObject(updatedProduct),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateProductSpecifications(
  data: z.infer<typeof UpdateProductSpecificationsSchema>
) {
  try {
    const validatedData = UpdateProductSpecificationsSchema.parse(data);
    const { productId, productType, specifications } = validatedData;

    if (productType === "drum") {
      const drumExists = await prisma.drum.findUnique({
        where: { productId },
      });

      if (!drumExists) {
        throw new Error("Drum specifications not found for the product.");
      }

      if ("skinTypeId" in specifications && "dimensionsId" in specifications) {
        await prisma.drum.update({
          where: { productId },
          data: {
            skinTypeId: specifications.skinTypeId,
            dimensionsId: specifications.dimensionsId,
          },
        });
      } else {
        throw new Error("Invalid drum specifications.");
      }
    }

    if (productType === "other") {
      const otherExists = await prisma.other.findUnique({
        where: { productId },
      });

      if (!otherExists) {
        throw new Error("Other specifications not found for the product.");
      }

      if (
        "color" in specifications ||
        "material" in specifications ||
        "size" in specifications
      ) {
        await prisma.other.update({
          where: { productId },
          data: {
            color: specifications.color,
            material: specifications.material,
            size: specifications.size,
          },
        });
      } else {
        throw new Error("Invalid other specifications.");
      }
    }

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product specifications updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllProductCategories() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { name: "asc" },
  });
  return convertToPlainObject(categories);
}

export async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    return products;
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createSkinType(material: string) {
  try {
    const skinType = await prisma.skinType.create({
      data: { material },
    });

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
  const skinTypes = await prisma.skinType.findMany({
    orderBy: { material: "asc" },
  });

  return convertToPlainObject(skinTypes);
}

export async function updateSkinType(id: string, material: string) {
  try {
    const skinTypeExists = await prisma.skinType.findUnique({
      where: { id },
    });

    if (!skinTypeExists) {
      throw new Error("SkinType not found");
    }

    const updatedSkinType = await prisma.skinType.update({
      where: { id },
      data: { material },
    });

    return {
      success: true,
      message: "SkinType updated successfully",
      skinType: convertToPlainObject(updatedSkinType),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteSkinType(id: string) {
  try {
    const skinTypeExists = await prisma.skinType.findUnique({
      where: { id },
    });

    if (!skinTypeExists) {
      throw new Error("SkinType not found");
    }

    await prisma.skinType.delete({
      where: { id },
    });

    return { success: true, message: "SkinType deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createDrumDimensions(size: string) {
  try {
    const drumDimensions = await prisma.drumDimensions.create({
      data: { size },
    });

    return {
      success: true,
      message: "DrumDimensions created successfully",
      drumDimensions: convertToPlainObject(drumDimensions),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllDrumDimensions() {
  const drumDimensionss = await prisma.drumDimensions.findMany({
    orderBy: { size: "asc" },
  });

  return convertToPlainObject(drumDimensionss);
}

export async function updateDrumDimensions(id: string, size: string) {
  try {
    const drumDimensionsExists = await prisma.drumDimensions.findUnique({
      where: { id },
    });

    if (!drumDimensionsExists) {
      throw new Error("DrumDimensions not found");
    }

    const updatedDrumDimensions = await prisma.drumDimensions.update({
      where: { id },
      data: { size },
    });

    return {
      success: true,
      message: "DrumDimensions updated successfully",
      drumDimensions: convertToPlainObject(updatedDrumDimensions),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteDrumDimensions(id: string) {
  try {
    const drumDimensionsExists = await prisma.drumDimensions.findUnique({
      where: { id },
    });

    if (!drumDimensionsExists) {
      throw new Error("DrumDimensions not found");
    }

    await prisma.drumDimensions.delete({
      where: { id },
    });

    return { success: true, message: "DrumDimensions deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllProducts({
  skinType,
  dimensions,
  category,
  sort = "newest",
  page = 1,
  limit = PAGE_SIZE,
}: {
  skinType?: string;
  dimensions?: string;
  category?: string;
  sort?: "newest" | "highest" | "lowest";
  page?: number;
  limit?: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any = {};

  if (category && category !== "all") {
    filters.category = {
      name: category,
    };
  }

  if (skinType && skinType !== "all") {
    filters.drum = {
      is: {
        skinType: {
          material: skinType,
        },
      },
    };
  }

  if (dimensions && dimensions !== "all") {
    if (!filters.drum) {
      filters.drum = { is: {} };
    }
    filters.drum.is.dimensions = {
      size: dimensions,
    };
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };

  if (sort === "lowest") {
    orderBy = { price: "asc" };
  } else if (sort === "highest") {
    orderBy = { price: "desc" };
  }

  const skip = (page - 1) * limit;

  // console.log("🔍 Filtres appliqués :", JSON.stringify(filters, null, 2));
  // console.log("🔽 Tri appliqué :", orderBy);
  // console.log("📄 Pagination :", { page, limit, skip });

  const products = await prisma.product.findMany({
    where: filters,
    include: {
      category: true,
      drum: {
        include: {
          skinType: true,
          dimensions: true,
        },
      },
      other: true,
    },
    orderBy,
    skip,
    take: limit,
  });

  const totalCount = await prisma.product.count({ where: filters });

  return {
    data: products,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
}
