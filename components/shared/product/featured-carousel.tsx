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
  banner?: string | null;
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
        }),
      ]}
    >
      <CarouselContent>
        {data.map((item) => (
          <CarouselItem key={item.id}>
            <Link href={`/${item.name ? "product" : "blog"}/${item.slug}`}>
              <div className="relative mx-auto">
                <Image
                  src={item.banner || "/default-banner.jpg"} // Fallback pour bannière manquante
                  alt={item.name || item.title || "Image"}
                  width={800}
                  height={400}
                  sizes="100vw"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 flex items-end justify-center">
                  <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
                    {item.name || item.title}
                  </h2>
                </div>
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
