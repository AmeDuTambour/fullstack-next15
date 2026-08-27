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
  ];

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
