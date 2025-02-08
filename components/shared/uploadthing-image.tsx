import Image from "next/image";
import { X } from "lucide-react";

type UploadThingImageProps = {
  src: string;
  onDelete: () => void;
};

const UploadThingImage = ({ src, onDelete }: UploadThingImageProps) => {
  return (
    <div className="relative inline-block">
      <button
        onClick={onDelete}
        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
      >
        <X size={14} />
      </button>
      <Image
        src={src}
        alt="uploadthing-image"
        width={100}
        height={100}
        className="w-20 h-20 object-cover object-center rounded-sm"
      />
    </div>
  );
};

export default UploadThingImage;
