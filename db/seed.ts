import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

async function main() {
  const prisma = new PrismaClient();

  // Suppression des anciennes données
  await prisma.drum.deleteMany();
  await prisma.other.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.skinType.deleteMany();
  await prisma.drumDimensions.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("🔄 Base de données nettoyée.");

  // Insertion des catégories
  await prisma.productCategory.createMany({
    data: sampleData.categories,
  });

  // Insertion des types de peau
  await prisma.skinType.createMany({
    data: sampleData.skinTypes,
  });

  // Insertion des dimensions des tambours
  await prisma.drumDimensions.createMany({
    data: sampleData.drumDimensions,
  });

  // Insertion des utilisateurs
  await prisma.user.createMany({
    data: sampleData.users,
  });

  console.log("✅ Données de base insérées.");

  // Insertion des produits et gestion des relations
  for (const product of sampleData.products) {
    const category = await prisma.productCategory.findUnique({
      where: { name: product.category },
    });

    if (!category) {
      console.warn(
        `❌ Catégorie non trouvée pour le produit : ${product.name}`
      );
      continue;
    }

    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        images: product.images || [], // Assurer un tableau vide si pas d'image
        price: product.price,
        stock: product.stock,
        isFeatured: product.isFeatured,
        banner: product.banner,
        codeIdentifier: product.codeIdentifier,
        categoryId: category.id,
      },
    });

    console.log(`✅ Produit créé : ${createdProduct.name}`);

    // Si le produit est un tambour
    if (product.category === "Drum" && product.specifications) {
      const skinType = await prisma.skinType.findUnique({
        where: { material: product.specifications.skinType },
      });

      const dimensions = await prisma.drumDimensions.findUnique({
        where: { size: product.specifications.dimensions },
      });

      if (!skinType || !dimensions) {
        console.warn(
          `⚠️ Relations manquantes pour le tambour : ${product.name} (SkinType: ${product.specifications?.skinType}, Dimensions: ${product.specifications?.dimensions})`
        );
        continue;
      }

      await prisma.drum.create({
        data: {
          productId: createdProduct.id,
          skinTypeId: skinType.id,
          dimensionsId: dimensions.id,
        },
      });

      console.log(`🥁 Tambour lié à ${createdProduct.name}`);
    }

    // Si le produit est un accessoire (Other)
    if (product.category === "Other" && product.specifications) {
      await prisma.other.create({
        data: {
          productId: createdProduct.id,
          color: product.specifications.color,
          material: product.specifications.material,
          size: product.specifications.size,
        },
      });

      console.log(`🎯 Accessoire lié à ${createdProduct.name}`);
    }
  }

  console.log("✅ Base de données seedée avec succès.");
}

main().catch((error) => {
  console.error("❌ Erreur lors du seed de la base de données :", error);
  process.exit(1);
});
