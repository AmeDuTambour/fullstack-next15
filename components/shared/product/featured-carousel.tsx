"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
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
  return (
    <Carousel
      className="w-full mb-12"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((item, index) => (
          <CarouselItem key={item.id}>
            <Link href={`/${item.name ? "product" : "blog"}/${item.slug}`}>
              {/* Le cadre porte le rapport d'aspect : l'image ne décale plus la
                  page en apparaissant. Seule la première vue est prioritaire —
                  les suivantes ne sont pas à l'écran. */}
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg">
                <Image
                  src={item.banner}
                  alt={item.name || item.title || ""}
                  fill
                  sizes="(min-width: 1280px) 1280px, 100vw"
                  priority={index === 0}
                  className="object-cover"
                />
              </div>
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
