import Link from "next/link";

const CarouselCard = ({
  title,
  img,
  slug,
}: {
  title: string;
  img: string;
  slug: string;
}) => {
  return (
    <Link href={`/blog/${slug}`} passHref>
      <div className="relative w-full h-48 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${img})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        <div className="absolute bottom-0 p-2">
          <h3 className="text-white h3-bold">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default CarouselCard;
