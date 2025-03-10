import AddToCart from "@/components/shared/product/add-to-cart";
import ProductImages from "@/components/shared/product/product-images";
import ProductPrice from "@/components/shared/product/product-price";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getUserCart } from "@/lib/actions/cart.actions";
import {
  getProductBySlug,
  getAllProductCategories,
} from "@/lib/actions/product.actions";
import { getProductCategory } from "@/lib/utils";

import { notFound } from "next/navigation";

const ProductDetailPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  const categories = await getAllProductCategories();
  const category = getProductCategory(product.categoryId, categories);
  if (!product) notFound();

  const cart = await getUserCart();

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <h1 className="h3-bold">{product.name}</h1>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>
            {category.name === "Drum" ? (
              <div className="flex flex-row gap-8">
                <div className="mt-10">
                  <p className="font-semibold">Type de peau</p>
                  <p>{product?.specifications?.skinType?.material}</p>
                </div>
                <div className="mt-10">
                  <p className="font-semibold">Dimensions</p>
                  <p>{product?.specifications?.dimensions?.size}</p>
                </div>
              </div>
            ) : null}
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">En stock</Badge>
                  ) : (
                    <Badge variant="destructive">Stock épuisé</Badge>
                  )}
                </div>
                {product.stock > 0 ? (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price.toString(),
                        qty: 1,
                        image: product.images[0],
                      }}
                    />
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailPage;
