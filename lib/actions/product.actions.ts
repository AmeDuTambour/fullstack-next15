"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { PAGE_SIZE } from "../constants/index";
import {
  convertToPlainObject,
  formatError,
  getProductCategory,
} from "../utils";
import {
  baseProductSchema,
  updateBaseProductSchema,
  UpdateProductSchema,
} from "../validators";

import { PrismaClient } from "@prisma/client";
import { DrumSpecs, OtherSpecs, Product } from "@/types";

const prisma = new PrismaClient();

async function getProductSpecifications(productId: string, category: string) {
  if (!productId) {
    return null;
  }

  if (category === "Drum") {
    const drumSpecs = await prisma.drum.findUnique({
      where: { productId: productId },
      include: { skinType: true, dimensions: true },
    });

    return drumSpecs;
  }

  if (category === "Other") {
    return await prisma.other.findUnique({
      where: { productId: productId },
    });
  }

  return {};
}

export async function getLatestProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
    },
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  const categories = await getAllProductCategories();

  const productsWithSpecs = await Promise.all(
    products.map(async (product) => {
      const { name } = getProductCategory(product.categoryId, categories);
      const specifications = await getProductSpecifications(product.id, name);

      return {
        ...product,
        price: product.price.toString(),
        specifications:
          specifications && Object.keys(specifications).length > 0
            ? (specifications as DrumSpecs)
            : null,
      };
    })
  );

  return convertToPlainObject(productsWithSpecs) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new Error(`Product with slug "${slug}" not found.`);
  }

  const categories = await getAllProductCategories();
  const { name } = getProductCategory(product.categoryId, categories);
  const specifications = (await getProductSpecifications(
    product.id,
    name
  )) as DrumSpecs;

  return convertToPlainObject({
    ...product,
    price: product.price.toString(),
    specifications,
  }) satisfies Product;
}

export async function getProductById(
  productId: string,
  withSpecs: boolean = false
): Promise<Product | undefined> {
  // ✅ Assurer que le type de retour est correct
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
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
    });

    if (!product) {
      return undefined;
    }

    let specifications: DrumSpecs | OtherSpecs | null = null;

    if (withSpecs) {
      const categories = await getAllProductCategories();
      const { name } = getProductCategory(product.categoryId, categories);
      const fetchedSpecifications = await getProductSpecifications(
        product.id,
        name
      );

      specifications =
        fetchedSpecifications && Object.keys(fetchedSpecifications).length > 0
          ? (fetchedSpecifications as DrumSpecs)
          : product.drum && Object.keys(product.drum).length > 0
            ? (product.drum as DrumSpecs)
            : product.other && Object.keys(product.other).length > 0
              ? (product.other as OtherSpecs)
              : null;
    }

    return convertToPlainObject({
      ...product,
      price: product.price.toString(),
      specifications,
    }) as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return undefined;
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

export async function createProduct(data: z.infer<typeof baseProductSchema>) {
  try {
    const baseProduct = baseProductSchema.parse(data);

    const createdProduct = await prisma.product.create({
      data: {
        name: baseProduct.name,
        slug: baseProduct.slug,
        categoryId: baseProduct.categoryId,
        stock: baseProduct.stock,
        images: baseProduct.images,
        description: baseProduct.description,
        isFeatured: baseProduct.isFeatured ?? false,
        banner: baseProduct.banner,
        price: Number(baseProduct.price),
        codeIdentifier: baseProduct.codeIdentifier,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
      data: convertToPlainObject(createdProduct),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateBaseProduct(
  data: z.infer<typeof updateBaseProductSchema>
) {
  try {
    const product = UpdateProductSchema.parse(data);
    console.log("Validating product: ", product);

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
        description: product.description,
        isPublished: product.isPublished ?? false,
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
      data: convertToPlainObject(updatedProduct),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateProductSpecifications(
  id: string,
  data: Record<string, string>
) {
  try {
    const product = await prisma.product.findFirst({
      where: { id },
    });

    if (!product) throw new Error("Product not found");
    const categories = await getAllProductCategories();
    const productCategory = getProductCategory(product.categoryId, categories);

    if (productCategory.name === "Drum") {
      const specs = await prisma.drum.findFirst({
        where: { productId: id },
      });
      if (!specs) {
        await prisma.drum.create({
          data: {
            productId: id,
            skinTypeId: data.skinTypeId,
            dimensionsId: data.dimensionsId,
          },
        });
        revalidatePath(`/admin/products/editor/${id}/product-specifications`);
        return {
          success: true,
          message: "Specifications updated successfully",
        };
      }
      await prisma.drum.update({
        where: { productId: id },
        data: {
          productId: id,
          skinTypeId: data.skinTypeId,
          dimensionsId: data.dimensionsId,
        },
      });
      revalidatePath(`/admin/products/editor/${id}/product-specifications`);
      return { success: true, message: "Specifications created successfully" };
    } else {
      const specs = await prisma.other.findFirst({
        where: { productId: id },
      });
      if (!specs) {
        await prisma.other.create({
          data: {
            productId: id,
            color: data.color,
            material: data.material,
            size: data.size,
          },
        });
        revalidatePath(`/admin/products/editor/${id}/product-specifications`);
        return {
          success: true,
          message: "Specifications updated successfully",
        };
      }
      await prisma.other.update({
        where: { productId: id },
        data: {
          productId: id,
          color: data.color,
          material: data.material,
          size: data.size,
        },
      });
      revalidatePath(`/admin/products/editor/${id}/product-specifications`);
      return { success: true, message: "Specifications created successfully" };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
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
        isPublished: true,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    return products;
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

export async function getAllDrumDimensions() {
  const drumDimensionss = await prisma.drumDimensions.findMany({
    orderBy: { size: "asc" },
  });

  return convertToPlainObject(drumDimensionss);
}

export async function getAllProducts({
  query,
  skinType,
  dimensions,
  category,
  sort = "newest",
  page = 1,
  limit = PAGE_SIZE,
}: {
  query?: string;
  skinType?: string;
  dimensions?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any = {};

  if (query && query !== "all") {
    filters.name = {
      contains: query,
      mode: "insensitive",
    };
  }

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

  const formattedProducts = products.map((product) => {
    const specifications =
      product.drum && Object.keys(product.drum).length > 0
        ? (product.drum as DrumSpecs)
        : product.other && Object.keys(product.other).length > 0
          ? product.other
          : null;

    return {
      ...product,
      price: product.price.toString(),
      specifications,
    };
  });

  return {
    data: convertToPlainObject(formattedProducts) as Product[],
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
}

export async function getProductByCodeIdentifier(codeIdentifier: string) {
  const product = await prisma.product.findFirst({
    where: { codeIdentifier },
  });

  return convertToPlainObject(product);
}

export async function blockProductUnit(id: string, quantity: number) {
  console.log("===============Product id=====================");
  console.log(id);
  console.log("====================================");
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock === 0) {
    throw new Error("Cannot block units. Stock quantity is zero.");
  }

  const updatedProduct = await prisma.product.update({
    where: { id: product.id },
    data: {
      stock: product.stock - quantity,
      blockedQuantity: product.blockedQuantity + quantity,
    },
  });

  return convertToPlainObject(updatedProduct);
}

export async function releaseProductUnit(id: string, quantity: number) {
  const product = await prisma.product.findFirst({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.blockedQuantity === 0) {
    throw new Error("Cannot release units. Blocked quantity is zero.");
  }

  const updatedProduct = await prisma.product.update({
    where: { id: product.id },
    data: {
      stock: product.stock + quantity,
      blockedQuantity: product.blockedQuantity - quantity,
    },
  });

  return convertToPlainObject(updatedProduct);
}
