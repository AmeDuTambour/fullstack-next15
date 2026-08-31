import type { MetadataRoute } from "next";

import { SERVER_URL } from "@/lib/constants";

/**
 * Ce qui ne doit jamais être indexé : l'administration, l'espace compte, le
 * tunnel d'achat et les commandes. Rien de tout cela n'a de sens hors session,
 * et une commande indexée serait une fuite.
 *
 * L'environnement de développement se retire entièrement : un site de recette
 * indexé fait concurrence au vrai dans les résultats.
 */
// Opt-in explicite : une pré-production indexée fait concurrence au vrai site
// dans les résultats, et rien dans l'environnement ne permet de deviner à coup
// sûr lequel est lequel.
const isProduction =
  process.env.VERCEL_ENV === "production" ||
  process.env.ALLOW_INDEXING === "true";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/user",
        "/order",
        "/cart",
        "/shipping-address",
        "/payment-method",
        "/place-order",
        "/sign-in",
        "/sign-up",
      ],
    },
    sitemap: `${SERVER_URL}/sitemap.xml`,
  };
}
