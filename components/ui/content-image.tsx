import Image from "next/image";
import { CameraOff } from "lucide-react";
import { cn, isValidUrl } from "@/lib/utils";

/**
 * Image de contenu, avec son repli quand elle manque.
 *
 * Quatre fichiers géraient le cas « pas d'image » avec leur propre icône, leur
 * propre taille et leur propre bordure.
 *
 * Le repli occupe exactement la même boîte que l'image : même `className`, même
 * ratio. Une première version fixait sa taille en pixels, ce qui le faisait
 * déborder de sa cellule dès que la grille devenait plus étroite.
 *
 * `sizes` est exposé et transmis : c'est ce qui évite qu'un téléphone télécharge
 * une image calibrée pour un grand écran.
 */
type ContentImageProps = {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export const ContentImage = ({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  priority,
}: ContentImageProps) => {
  if (!src || !isValidUrl(src)) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{ aspectRatio: `${width} / ${height}` }}
        role="img"
        aria-label={alt}
      >
        <CameraOff className="h-8 w-8" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
};

export default ContentImage;
