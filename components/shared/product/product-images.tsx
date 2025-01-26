"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

type ProductImagesProps = {
  images: string[];
};

const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  const [current, setCurrent] = useState<number>(0);
  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300] object-cover object-center"
      />
      <div className="flex">
        {images.map((image, index) => {
          return (
            <div
              key={image}
              onClick={() => setCurrent(index)}
              className={cn(
                "cursor-pointer border mr-2 hover:border-orange-600",
                current === index && "border-orange-500"
              )}
            >
              <Image
                src={image}
                alt="thumbnail image"
                width={100}
                height={100}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImages;
