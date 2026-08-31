"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ArticleCard from "@/components/shared/article-card";
import { blog as t } from "@/lib/labels";
import { Article } from "@/types";

/**
 * Une catégorie du journal, et ses articles.
 *
 * Il tournait sur swiper, qui portait une faille critique de pollution de
 * prototype sans montée non cassante. Le projet embarquait déjà embla pour le
 * carrousel de l'accueil : une seule bibliothèque suffit.
 *
 * Les commandes ne sont rendues que s'il y a matière à faire défiler. Une
 * catégorie d'un seul article affichait deux flèches inertes.
 */
const ArticleCarousel = ({
  title,
  data,
}: {
  title: string;
  data: Article[];
}) => {
  const scrollable = data.length > 1;

  return (
    <section className="space-y-4">
      <h2 className="section-title">{t.categoryHeading(title, data.length)}</h2>

      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-4">
          {data.map((article) => (
            <CarouselItem
              key={article.id}
              className="basis-4/5 pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <ArticleCard
                title={article.title}
                slug={article.slug}
                thumbnail={article.thumbnail}
                createdAt={article.createdAt}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {scrollable ? (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        ) : null}
      </Carousel>
    </section>
  );
};

export default ArticleCarousel;
