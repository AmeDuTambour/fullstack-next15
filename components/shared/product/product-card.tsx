import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import { CameraOff } from "lucide-react";
import { isValidUrl } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.images[0];
  console.log(isValidUrl(imageUrl));

  return (
    <Card>
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
      <CardContent className="='p-4 grid gap-4">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">Stock épuisé</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
