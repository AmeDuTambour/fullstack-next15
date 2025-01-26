import IconBoxes from "@/components/icon-boxes";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 ? (
        <ProductCarousel data={featuredProducts} />
      ) : null}
      <ProductList data={latestProducts} title="Newest Arrival" limit={4} />
      <ViewAllProductsButton />
      <IconBoxes />
    </>
  );
};

export default HomePage;
