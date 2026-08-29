"use client";

import { useState } from "react";

import ContentImage from "@/components/ui/content-image";
import { catalog as t } from "@/lib/labels";
import { cn } from "@/lib/utils";

type ProductImagesProps = {
  images: string[];
  /** Nom du produit : c'est lui qui décrit l'image, pas le mot « image ». */
  name: string;
};

/**
 * Galerie de la fiche produit.
 *
 * Elle redisait à sa façon ce que `ContentImage` sait déjà faire — repli sans
 * image, cadre stable — et ses vignettes étaient des `div` cliquables :
 * inatteignables au clavier, invisibles pour un lecteur d'écran. Ce sont
 * maintenant des boutons qui annoncent laquelle est affichée.
 */
const ProductImages: React.FC<ProductImagesProps> = ({ images, name }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <ContentImage
        src={images[current]}
        alt={name}
        width={500}
        height={500}
        sizes="(min-width: 768px) 40vw, 100vw"
        priority
        className="aspect-square w-full rounded-lg object-cover object-center"
      />

      {images.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={t.showImage(index + 1)}
              aria-current={current === index ? "true" : undefined}
              className={cn(
                "overflow-hidden rounded-md border transition-colors",
                current === index
                  ? "border-primary"
                  : "border-border hover:border-foreground"
              )}
            >
              <ContentImage
                src={image}
                alt=""
                width={100}
                height={100}
                sizes="100px"
                className="h-20 w-20 object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ProductImages;
