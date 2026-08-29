"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

type FeaturedItem = {
  id: string;
  slug: string;
  /** Obligatoire : le carrousel n'affiche que ce visuel. La home filtre en
   *  amont les contenus qui n'en ont pas. */
  banner: string;
  title?: string;
  name?: string;
};

type FeaturedCarouselProps = {
  data: FeaturedItem[];
};

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ data }) => {
  /**
   * Le greffon vit dans une référence, pas dans le rendu.
   *
   * Écrit en ligne, il était reconstruit à chaque rendu : embla ne lit ses
   * greffons qu'à l'initialisation, et le nouveau minuteur remplaçait l'ancien
   * sans jamais démarrer. Le carrousel restait immobile.
   *
   * `stopOnMouseEnter` a également disparu : la bannière occupe le haut de la
   * page, le curseur s'y trouve dès l'arrivée. Une interaction met en pause,
   * elle n'arrête pas définitivement.
   */
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <Carousel
      className="w-full mb-12"
      opts={{ loop: true }}
      plugins={[autoplay.current]}
    >
      <CarouselContent>
        {data.map((item, index) => (
          <CarouselItem key={item.id}>
            <Link href={`/${item.name ? "product" : "blog"}/${item.slug}`}>
              {/* Les dimensions déclarées sont celles des bannières réelles :
                  elles réservent la place avant l'arrivée de l'image sans
                  jamais la recadrer. Un rapport imposé rognait un tiers du
                  visuel. Seule la première vue est prioritaire — les suivantes
                  ne sont pas à l'écran. */}
              <Image
                src={item.banner}
                alt={item.name || item.title || ""}
                width={1536}
                height={460}
                sizes="(min-width: 1280px) 1280px, 100vw"
                priority={index === 0}
                className="h-auto w-full rounded-lg object-contain"
              />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default FeaturedCarousel;
