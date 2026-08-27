import FeaturedCarousel from "@/components/shared/product/featured-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products";
import { getFeaturedArticles } from "@/lib/actions/article.actions";
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
      {featuredContent.length > 0 && (
        <FeaturedCarousel data={featuredContent} />
      )}
      <ProductList data={latestProducts} title="Nouvel arrivage" limit={4} />
      <ViewAllProductsButton />
    </>
  );
};

export default HomePage;
