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
import { APP_DESCRIPTION, SERVER_URL, SHIPPING_DELAY } from "@/lib/constants";
import type { Metadata } from "next";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Aperçu de partage et métadonnées propres au produit.
 *
 * Chaque tambour partageait le titre générique du site : un lien posté sur
 * Instagram — le canal d'acquisition principal — s'affichait sans image, sans
 * titre et sans description. Le lien de la pièce et celui de la page d'accueil
 * étaient indiscernables.
 */
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const description = product.description?.slice(0, 200) || APP_DESCRIPTION;
  const image = product.images?.[0];

  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `/product/${product.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

const ProductDetailPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categories = await getAllProductCategories();
  const category = getProductCategory(product.categoryId, categories);

  const cart = await getUserCart();

  const nature = getProductNature(category?.name);
  const availability = getAvailability(nature, product.stock);

  // Fiche structurée : sans elle, un moteur voit une page parmi d'autres, pas
  // un objet ayant un prix et une disponibilité. C'est ce qui fait apparaître
  // le prix sous le résultat de recherche.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: product.images?.length ? product.images : undefined,
    sku: product.id,
    category: category?.name || undefined,
    offers: {
      "@type": "Offer",
      url: `${SERVER_URL}/product/${product.slug}`,
      priceCurrency: "EUR",
      price: Number(product.price).toFixed(2),
      availability:
        availability === "available"
          ? "https://schema.org/InStock"
          : nature === "unique"
            ? "https://schema.org/SoldOut"
            : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
