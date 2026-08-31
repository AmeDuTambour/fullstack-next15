import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Logo de l'atelier.
 *
 * Huit paires clair/sombre étaient recopiées dans sept fichiers. Regrouper ici
 * a un second effet : la spécification 004 supprime le mode sombre, ce qui
 * deviendra une modification d'un seul fichier au lieu de sept.
 *
 * Deux modes, parce que les appelants n'ont pas le même besoin :
 * — `fill` pour un conteneur déjà dimensionné, qui impose son ratio ;
 * — dimensions explicites sinon.
 * Une première version imposait des dimensions carrées à tous les appelants,
 * ce qui écrasait le logo en bandeau, dont le ratio est de 3 pour 1.
 */
type BrandLogoProps = {
  variant?: "square" | "banner" | "plain";
  /** Occupe le conteneur parent, qui doit être positionné et dimensionné. */
  fill?: boolean;
  /** Utilisé hors mode `fill`. Le ratio de la variante est respecté. */
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

const SOURCES = {
  square: {
    src: "/images/brand/logo-square-light.png",
    ratio: 1,
  },
  banner: {
    src: "/images/brand/logo-banner-light.png",
    ratio: 3,
  },
  plain: {
    src: "/images/brand/logo-no-bg-light.png",
    ratio: 1,
  },
} as const;

export const BrandLogo = ({
  variant = "square",
  fill,
  height = 48,
  className,
  priority,
  sizes,
}: BrandLogoProps) => {
  const source = SOURCES[variant];
  const alt = `${APP_NAME} logo`;

  const dimensions = fill
    ? { fill: true as const }
    : { width: Math.round(height * source.ratio), height };

  /**
   * Hauteur imposée en CSS, et pas seulement par les attributs.
   *
   * La réinitialisation de Tailwind pose `height: auto` sur toute image. Tant
   * qu'elle n'est pas chargée, sa boîte mesure donc zéro — et une image de zéro
   * pixel n'entre jamais dans la zone visible, donc son chargement différé ne se
   * déclenche jamais. Le logo restait invisible indéfiniment.
   */
  const style = fill
    ? undefined
    : { height: `${height}px`, width: "auto" as const };

  return (
    <Image
      src={source.src}
      alt={alt}
      {...dimensions}
      style={style}
      sizes={sizes}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
};

export default BrandLogo;
