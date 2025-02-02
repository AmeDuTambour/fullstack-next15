"use client";

import { Article } from "@/types";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CarouselCard from "../carousel-card";
import "swiper/css";
import "swiper/css/navigation";

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

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        breakpoints={{
          320: {
            slidesPerView: 1.2,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 3.5,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
      >
        {data.map((slideContent) => (
          <SwiperSlide key={slideContent.id}>
            <div className="transition-transform duration-300 hover:scale-105">
              <CarouselCard
                title={slideContent.title}
                img={slideContent.thumbnail ?? ""}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ArticleCarousel;
