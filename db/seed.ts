/**
 * Remplit la base de développement avec un catalogue de démonstration.
 *
 * ⚠️  Ce script est destructif : il vide les tables produits, articles et
 * utilisateurs avant d'écrire. Il exige donc `--force` et affiche l'hôte visé
 * avant d'agir, pour qu'on ne l'exécute jamais par réflexe sur la mauvaise base.
 *
 *   npm run seed -- --force
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();

import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

const prisma = new PrismaClient();

function targetHost() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return "hôte illisible";
  }
}

async function main() {
  const host = targetHost();

  if (!host) {
    console.error(
      "❌ DATABASE_URL est absent. Vérifiez votre .env avant de relancer."
    );
    process.exit(1);
  }

  console.log(`\n🎯 Base visée : ${host}`);

  if (!process.argv.includes("--force")) {
    console.log(
      "\n⚠️  Ce script SUPPRIME les produits, articles et utilisateurs de cette base.\n" +
        "   Relancez avec :  npm run seed -- --force\n"
    );
    process.exit(1);
  }

  await prisma.articleSection.deleteMany();
  await prisma.articleComment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.articleCategory.deleteMany();
  await prisma.drum.deleteMany();
  await prisma.other.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.skinType.deleteMany();
  await prisma.drumDimensions.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("🔄 Base de données nettoyée.");

  await prisma.productCategory.createMany({ data: sampleData.categories });
  await prisma.skinType.createMany({ data: sampleData.skinTypes });
  await prisma.drumDimensions.createMany({ data: sampleData.drumDimensions });
  await prisma.user.createMany({ data: sampleData.users });

  console.log("✅ Catégories, peaux, dimensions et utilisateurs insérés.");

  let published = 0;
  let comments = 0;

  for (const product of sampleData.products) {
    const category = await prisma.productCategory.findUnique({
      where: { name: product.category },
    });

    if (!category) {
      console.warn(`❌ Catégorie introuvable pour : ${product.name}`);
      continue;
    }

    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        images: product.images ?? [],
        price: product.price,
        stock: product.stock,
        // Sans cette ligne, tout le catalogue restait `isPublished: false` et
        // la boutique s'affichait vide : c'était l'oubli d'origine.
        isPublished: product.isPublished,
        isFeatured: product.isFeatured,
        banner: product.banner,
        codeIdentifier: product.codeIdentifier,
        categoryId: category.id,
      },
    });

    if (product.isPublished) published++;

    if (product.category === "Drum" && product.specifications) {
      const skinType = await prisma.skinType.findUnique({
        where: { material: product.specifications.skinType },
      });
      const dimensions = await prisma.drumDimensions.findUnique({
        where: { size: product.specifications.dimensions },
      });

      if (!skinType || !dimensions) {
        console.warn(`⚠️  Relations manquantes pour : ${product.name}`);
        continue;
      }

      await prisma.drum.create({
        data: {
          productId: createdProduct.id,
          skinTypeId: skinType.id,
          dimensionsId: dimensions.id,
        },
      });
    }

    if (product.category === "Other" && product.specifications) {
      await prisma.other.create({
        data: {
          productId: createdProduct.id,
          color: product.specifications.color,
          material: product.specifications.material,
          size: product.specifications.size,
        },
      });
    }
  }

  console.log(
    `✅ ${sampleData.products.length} produits insérés, dont ${published} publiés.`
  );

  for (const article of sampleData.articles) {
    const category = await prisma.articleCategory.upsert({
      where: { id: article.categoryId },
      update: {},
      create: { id: article.categoryId, name: article.categoryName },
    });

    const createdArticle = await prisma.article.create({
      data: {
        title: article.title,
        slug: article.slug,
        isPublished: article.isPublished,
        isFeatured: article.isFeatured,
        banner: article.banner,
        thumbnail: article.thumbnail,
        categoryId: category.id,
        sections: {
          create: article.sections.map((section, index) => ({
            position: index + 1,
            title: section.title,
            body: section.body,
            image: section.image ?? null,
          })),
        },
      },
    });

    for (const comment of article.comments) {
      const author = await prisma.user.findUnique({
        where: { email: comment.authorEmail },
      });

      if (!author) {
        console.warn(`⚠️  Auteur introuvable : ${comment.authorEmail}`);
        continue;
      }

      await prisma.articleComment.create({
        data: {
          articleId: createdArticle.id,
          userId: author.id,
          title: comment.title,
          body: comment.body,
        },
      });
      comments++;
    }
  }

  console.log(
    `✅ ${sampleData.articles.length} articles insérés, avec ${comments} commentaires.`
  );

  // Trois commandes de démonstration, une par état, pour que les écrans de
  // commande et l'historique aient quelque chose à montrer. Sans elles, les
  // deux pages sont vides et invérifiables.
  // Rattachées au compte client, pas à un administrateur : sur la page de
  // commande, un administrateur voit en plus les actions de gestion, donc la
  // vue serait celle du gestionnaire et non celle de l'acheteur.
  const buyer = await prisma.user.findFirstOrThrow({
    where: { email: "cliente@example.test" },
  });
  const soldDrums = await prisma.product.findMany({
    where: { images: { isEmpty: false } },
    take: 3,
  });

  const shippingAddress = {
    fullName: "Marie Lefèvre",
    streetAddress: "12 rue des Couteliers",
    city: "Mirepoix",
    postalCode: "09500",
    country: "France",
  };

  const orderStates = [
    {
      method: "Stripe",
      isPaid: true,
      isDelivered: true,
      carrier: "laposte",
      trackingNumber: "6A123456789FR",
    },
    { method: "Stripe", isPaid: true, isDelivered: false },
    { method: "Transfer", isPaid: false, isDelivered: false },
  ];

  for (const [index, state] of orderStates.entries()) {
    const product = soldDrums[index];
    if (!product) continue;

    const itemsPrice = Number(product.price);
    const shippingPrice = itemsPrice > 150 ? 0 : 10;

    await prisma.order.create({
      data: {
        userId: buyer.id,
        shippingAddress,
        paymentMethod: state.method,
        itemsPrice,
        shippingPrice,
        taxPrice: Math.round((itemsPrice / 6) * 100) / 100,
        totalPrice: itemsPrice + shippingPrice,
        isPaid: state.isPaid,
        paidAt: state.isPaid ? new Date() : null,
        isDelivered: state.isDelivered,
        deliveredAt: state.isDelivered ? new Date() : null,
        carrier: state.carrier ?? null,
        trackingNumber: state.trackingNumber ?? null,
        orderitems: {
          create: {
            productId: product.id,
            qty: 1,
            price: product.price,
            name: product.name,
            slug: product.slug,
            image: product.images[0] ?? "",
          },
        },
      },
    });
  }

  console.log(`✅ ${orderStates.length} commandes de démonstration insérées.`);
  console.log("\n🥁 Base de démonstration prête.\n");
}

main()
  .catch((error) => {
    console.error("❌ Erreur lors du seed :", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
