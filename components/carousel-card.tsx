const CarouselCard = ({ title, img }) => {
  return (
    <div className="relative w-full h-48 rounded-lg shadow-md overflow-hidden">
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
  );
};

export default CarouselCard;
