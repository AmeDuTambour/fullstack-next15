"use client";

import { Article } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CarouselCard from "../carousel-card";

/**
 * Carrousel d'articles, sur embla.
 *
 * Il tournait auparavant sur swiper, qui portait une faille critique de
 * pollution de prototype sans montée non cassante disponible. Le projet
 * embarquait déjà embla pour le carrousel de la home : une seule bibliothèque
 * suffit.
 */
const ArticleCarousel = ({
  title,
  data,
}: {
  title: string;
  data: Article[];
}) => {
  return (
    <div className="p-4">
      <h2 className="h2-bold mb-4">{`${title.toUpperCase()} (${data.length})`}</h2>

      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-4">
          {data.map((article) => (
            <CarouselItem
              key={article.id}
              className="pl-4 basis-4/5 sm:basis-1/3 lg:basis-1/4"
            >
              <div className="transition-transform duration-300 hover:scale-105">
                <CarouselCard
                  title={article.title}
                  img={article.thumbnail ?? ""}
                  slug={article.slug}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ArticleCarousel;
