import type { Metadata } from "next";

import FeaturedCarousel from "@/components/shared/product/featured-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products";
import { getFeaturedArticles } from "@/lib/actions/article.actions";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { catalog as t } from "@/lib/labels";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";

/**
 * Rendu à la demande, jamais au build.
 *
 * Cette page lit le catalogue : la prérendre obligerait `next build` à joindre
 * la base, et un déploiement échouerait dès que Neon dort. Le contenu reste
 * servi en SSR complet, donc indexable.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: APP_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: "/",
  },
};

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  const featuredArticles = await getFeaturedArticles();

  // Le carrousel n'affiche qu'une bannière : un contenu mis en avant sans
  // visuel produisait une image cassée (le repli `/default-banner.jpg`
  // n'existe pas dans public/). On l'écarte plutôt que de l'afficher vide.
  const featuredContent = [
    ...featuredArticles.map((article) => ({
      id: article.id,
      slug: article.slug,
      banner: article.banner,
      title: article.title,
    })),
    ...(Array.isArray(featuredProducts)
      ? featuredProducts.map((product) => ({
          id: product.id,
          slug: product.slug,
          banner: product.banner,
          name: product.name,
        }))
      : []),
  ].filter((item): item is typeof item & { banner: string } =>
    Boolean(item.banner)
  );

  return (
    <>
      {/* Le contenu de l'accueil, ce sont les visuels. Le titre existe pour les
          lecteurs d'écran et l'indexation, sans s'afficher : une accroche
          visible relève de l'artisan, pas d'un texte de configuration. */}
      <h1 className="sr-only">
        {APP_NAME} — {APP_DESCRIPTION}
      </h1>

      {featuredContent.length > 0 && (
        <FeaturedCarousel data={featuredContent} />
      )}
      <ProductList data={latestProducts} title={t.latestArrivals} limit={4} />
      <ViewAllProductsButton />
    </>
  );
};

export default HomePage;
