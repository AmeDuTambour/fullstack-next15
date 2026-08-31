import type { MetadataRoute } from "next";

import { prisma } from "@/db/prisma";
import { LEGAL_PAGES, isLegalPageWritten } from "@/lib/content/legal";
import { SERVER_URL } from "@/lib/constants";

/**
 * Plan du site, dérivé de ce qui est réellement publié.
 *
 * Il est calculé, pas écrit : un tambour dépublié disparaît du plan sans que
 * personne ait à y penser. C'est la seule forme qui reste juste après le
 * premier mois d'exploitation.
 */
export const revalidate = 3600;

/**
 * Calculé à la demande, pas au build. Un plan de site figé au déploiement
 * oublie tout ce qui est publié ensuite — et surtout, le build doit rester
 * possible sans base de données.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: { slug: string; updatedAt: Date }[] = [];
  let articles: { slug: string; updatedAt: Date }[] = [];

  try {
    [products, articles] = await Promise.all([
      prisma.product.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.article.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);
  } catch (error) {
    // Un plan de site amputé vaut mieux qu'une page d'erreur servie au moteur.
    console.error("Sitemap: catalogue indisponible", error);
  }

  const staticPages = ["", "/search", "/blog", "/about", "/contact"].map(
    (path) => ({
      url: `${SERVER_URL}${path}`,
      lastModified: new Date(),
      priority: path === "" ? 1 : 0.8,
    })
  );

  return [
    ...staticPages,
    ...products.map((product) => ({
      url: `${SERVER_URL}/product/${product.slug}`,
      lastModified: product.updatedAt,
      priority: 0.9,
    })),
    ...articles.map((article) => ({
      url: `${SERVER_URL}/blog/${article.slug}`,
      lastModified: article.updatedAt,
      priority: 0.6,
    })),
    // Une page d'information encore vide n'est pas proposée à l'indexation.
    ...LEGAL_PAGES.filter(isLegalPageWritten).map((page) => ({
      url: `${SERVER_URL}/legal/${page.slug}`,
      lastModified: new Date(),
      priority: 0.3,
    })),
  ];
}
