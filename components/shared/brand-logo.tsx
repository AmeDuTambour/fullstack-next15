import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Logo de l'atelier.
 *
 * Huit paires clair/sombre étaient recopiées dans sept fichiers. Regrouper ici
 * a un second effet : la spécification 004 supprime le mode sombre, ce qui
 * deviendra une modification d'un seul fichier au lieu de sept.
 */
type BrandLogoProps = {
  variant?: "square" | "banner" | "plain";
  size?: number;
  className?: string;
  priority?: boolean;
};

const SOURCES = {
  square: ["/images/brand/logo-square-light.png", "/images/brand/logo-square-dark.png"],
  banner: ["/images/brand/logo-banner-light.png", "/images/brand/logo-banner-dark.png"],
  plain: ["/images/brand/logo-no-bg-light.png", "/images/brand/logo-no-bg-dark.png"],
} as const;

export const BrandLogo = ({
  variant = "square",
  size = 48,
  className,
  priority,
}: BrandLogoProps) => {
  const [light, dark] = SOURCES[variant];
  const alt = `${APP_NAME} logo`;

  return (
    <>
      <Image
        src={light}
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        className={cn("object-contain dark:hidden", className)}
      />
      <Image
        src={dark}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        priority={priority}
        className={cn("object-contain hidden dark:block", className)}
      />
    </>
  );
};

export default BrandLogo;
