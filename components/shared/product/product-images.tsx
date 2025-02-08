"use client";

import { cn, isValidUrl } from "@/lib/utils";
import { CameraOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type ProductImagesProps = {
  images: string[];
};

const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  const [current, setCurrent] = useState<number>(0);

  return (
    <div className="space-y-4">
      {isValidUrl(images[current]) ? (
        <Image
          src={images[current]}
          alt="product image"
          width={500}
          height={500}
          className="min-h-[300] object-cover object-center"
        />
      ) : (
        <div className="h-[500px] w-full flex justify-center items-center border border-slate-700">
          <CameraOff className="h-10 w-10" />
        </div>
      )}
      <div className="flex">
        {images.map((image, index) => {
          return (
            <div
              key={image}
              onClick={() => setCurrent(index)}
              className={cn(
                "cursor-pointer border mr-2 hover:border-secondary",
                current === index && "border-secondary"
              )}
            >
              {isValidUrl(image) ? (
                <Image
                  src={image}
                  alt="thumbnail image"
                  width={100}
                  height={100}
                />
              ) : (
                <div className="w-[100px] h-[100px]  flex justify-center items-center border border-slate-700">
                  <CameraOff />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImages;
