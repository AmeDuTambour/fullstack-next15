import Image from "next/image";
import { CameraOff } from "lucide-react";
import { cn, isValidUrl } from "@/lib/utils";

/**
 * Image de contenu, avec son repli quand elle manque.
 *
 * Quatre fichiers géraient le cas « pas d'image » avec leur propre icône, leur
 * propre taille et leur propre bordure. Le repli fait donc partie du composant,
 * et non de chaque appelant.
 *
 * `sizes` est exposé et transmis : c'est ce qui évite qu'un téléphone télécharge
 * une image calibrée pour un grand écran. Le projet en compte 33 sans, ce que la
 * spécification 005 corrigera — depuis ce seul fichier pour celles qui passent ici.
 */
type ContentImageProps = {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Largeurs d'affichage réelles, par point de rupture. */
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
          "flex items-center justify-center rounded-sm bg-muted text-muted-foreground",
          className
        )}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <CameraOff className="h-8 w-8" />
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
