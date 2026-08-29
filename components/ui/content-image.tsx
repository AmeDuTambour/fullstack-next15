"use client";

import Image from "next/image";
import { CameraOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn, isValidUrl } from "@/lib/utils";

/**
 * Image de contenu : son ossature d'attente, et son repli quand elle manque.
 *
 * Trois états, une seule boîte. La boîte est dessinée avant de savoir ce
 * qu'elle contiendra — c'est ce qui empêche la page de sauter quand l'image
 * arrive, et ce qui remplace le trou blanc par une forme.
 *
 * Quatre fichiers géraient le cas « pas d'image » avec leur propre icône, leur
 * propre taille et leur propre bordure. Une première version fixait la taille du
 * repli en pixels, ce qui le faisait déborder de sa cellule dès que la grille
 * devenait plus étroite.
 *
 * `sizes` est exposé et transmis : c'est ce qui évite qu'un téléphone
 * télécharge une image calibrée pour un grand écran.
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
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  /**
   * Une image servie depuis le cache est complète avant l'hydratation :
   * `onLoad` ne se déclenchera jamais, React ayant attaché son écouteur après
   * coup. Ce contrôle après montage est le seul moment où l'état réel du nœud
   * est connu.
   */
  useEffect(() => {
    if (imageRef.current?.complete) setLoaded(true);
  }, []);

  /**
   * Le cadre doit réserver sa hauteur lui-même.
   *
   * L'image qu'il contient est en `h-full` : sans hauteur connue d'avance, le
   * cadre s'effondre à zéro et l'ossature ne se voit pas. Le rapport d'aspect
   * du contenu la donne — sauf quand l'appelant a déjà imposé la sienne, par
   * une classe `aspect-…` ou une hauteur fixe, auquel cas c'est la sienne qui
   * fait foi.
   */
  const layout = className ?? "";
  const callerSetsHeight = /(^|\s)(aspect-|h-)/.test(layout);
  const frameStyle = callerSetsHeight
    ? undefined
    : { aspectRatio: `${width} / ${height}` };

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
    <div
      className={cn("relative overflow-hidden", className)}
      style={frameStyle}
    >
      {/* L'ossature est DERRIÈRE l'image, jamais devant.

          Une première version masquait l'image en `opacity: 0` et ne la
          révélait qu'au chargement — donc en JavaScript. Avant l'hydratation,
          ou si le script échoue, plus aucune image n'apparaissait nulle part.

          Ici l'image se peint par-dessus : elle est visible sans qu'aucun
          script n'ait à s'exécuter. Le script ne fait que retirer l'ossature
          une fois qu'elle ne sert plus. */}
      {loaded ? null : (
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        ref={imageRef}
        onLoad={() => setLoaded(true)}
        /* Une image qui échoue ne doit pas laisser une ossature qui pulse pour
           toujours : on découvre le cadre, le repli du navigateur s'affiche. */
        onError={() => setLoaded(true)}
        className={cn("relative h-full w-full", className)}
      />
    </div>
  );
};

export default ContentImage;
