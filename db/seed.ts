import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

async function main() {
  const prisma = new PrismaClient();

  // Suppression des anciennes données (ordre important pour éviter des erreurs de contraintes)
  await prisma.drum.deleteMany();
  await prisma.other.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.skinType.deleteMany();
  await prisma.drumDiameter.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Insertion des catégories
  await prisma.productCategory.createMany({
    data: sampleData.categories,
  });

  // Insertion des types de peau
  await prisma.skinType.createMany({
    data: sampleData.skinTypes,
  });

  // Insertion des diamètres
  await prisma.drumDiameter.createMany({
    data: sampleData.drumDiameters,
  });

  // Insertion des utilisateurs
  await prisma.user.createMany({
    data: sampleData.users,
  });

  // Insertion des produits et gestion des relations
  for (const product of sampleData.products) {
    const category = await prisma.productCategory.findUnique({
      where: { name: product.categoryName },
    });

    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        images: product.images,
        price: product.price,
        stock: product.stock,
        isFeatured: product.isFeatured,
        banner: product.banner,
        categoryId: category!.id,
      },
    });

    // Si le produit est un tambour
    if (product.drum) {
      const skinType = await prisma.skinType.findUnique({
        where: { material: product.drum.skinTypeMaterial },
      });

      const diameter = await prisma.drumDiameter.findUnique({
        where: { size: product.drum.diameterSize },
      });

      await prisma.drum.create({
        data: {
          productId: createdProduct.id,
          skinTypeId: skinType!.id,
          diameterId: diameter!.id,
        },
      });
    }

    // Si le produit est un accessoire
    if (product.other) {
      await prisma.other.create({
        data: {
          productId: createdProduct.id,
          color: product.other.color,
          material: product.other.material,
          size: product.other.size,
        },
      });
    }
  }

  console.log("Database seeded successfully.");
}

main().catch((error) => {
  console.error("Error seeding the database:", error);
  process.exit(1);
});
