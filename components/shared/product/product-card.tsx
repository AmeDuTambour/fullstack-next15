import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { CameraOff } from "lucide-react";
import { formatCurrency, isValidUrl } from "@/lib/utils";
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
      <CardHeader className="flex items-center content-center">
        <Link href={`/product/${product.slug}`}>
          {imageUrl && isValidUrl(imageUrl) ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              height={300}
              width={300}
              objectFit="cover"
            />
          ) : (
            <div className="flex items-center justify-center h-[300px] w-[300px]">
              <CameraOff className="h-10 w-10" />
            </div>
          )}
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
