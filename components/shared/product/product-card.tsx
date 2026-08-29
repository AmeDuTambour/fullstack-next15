import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import ContentImage from "@/components/ui/content-image";
import { getAvailability, getProductNature } from "@/lib/product";
import { catalog as t } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.images[0];
  const nature = getProductNature(product.category?.name);
  const availability = getAvailability(nature, product.stock);

  return (
    <Card className="transition-shadow duration-300 hover:shadow-md">
      <CardHeader className="p-4">
        <Link href={`/product/${product.slug}`}>
          {/* Ratio imposé : les photos de l'atelier sont en portrait, d'autres
              produits n'ont pas d'image du tout. Sans cadre commun, les cartes
              d'une même grille n'ont pas la même hauteur. */}
          <ContentImage
            src={imageUrl}
            alt={product.name}
            width={300}
            height={300}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="aspect-square w-full rounded-md object-cover"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <p className="text-lg font-semibold">
            {formatCurrency(product.price)}
          </p>
          {availability !== "available" ? (
            <Badge variant="secondary">
              {availability === "sold" ? t.sold : t.outOfStock}
            </Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
