import AddToCart from "@/components/shared/product/add-to-cart";
import ProductImages from "@/components/shared/product/product-images";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getUserCart } from "@/lib/actions/cart.actions";
import {
  getProductBySlug,
  getAllProductCategories,
} from "@/lib/actions/product.actions";
import { formatCurrency, getProductCategory } from "@/lib/utils";
import {
  allowsQuantitySelection,
  getAvailability,
  getProductNature,
} from "@/lib/product";
import { catalog as t, common } from "@/lib/labels";
import { SHIPPING_DELAY } from "@/lib/constants";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ProductDetailPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  const categories = await getAllProductCategories();
  const category = getProductCategory(product.categoryId, categories);
  if (!product) notFound();

  const cart = await getUserCart();

  const nature = getProductNature(category?.name);
  const availability = getAvailability(nature, product.stock);

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <h1 className="page-title">{product.name}</h1>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <p className="text-2xl font-semibold">
                  {formatCurrency(product.price)}
                </p>
                {nature === "unique" ? (
                  <Badge variant="secondary">{t.uniquePiece}</Badge>
                ) : null}
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
                  <div>{common.price}</div>
                  <div>{formatCurrency(product.price)}</div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>{common.status}</div>
                  {availability === "available" ? (
                    <Badge variant="outline">
                      {nature === "unique"
                        ? t.available
                        : t.inStockCount(product.stock)}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {availability === "sold" ? t.sold : t.outOfStock}
                    </Badge>
                  )}
                </div>
                {availability === "available" ? (
                  <p className="mb-3 text-sm text-muted-foreground">
                    {t.shippingDelay(SHIPPING_DELAY)}
                  </p>
                ) : null}
                {availability === "available" ? (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      allowsQuantity={allowsQuantitySelection(nature)}
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
                ) : (
                  <div className="space-y-3">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/search">{t.seeAvailable}</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailPage;
