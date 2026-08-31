"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * Barre de navigation d'une section applicative.
 *
 * Les barres de l'administration et de l'espace compte ne divergeaient que par
 * leur liste de liens : 9 lignes sur 39.
 */
export type SectionLink = { title: string; href: string };

type SectionNavProps = HTMLAttributes<HTMLElement> & {
  links: SectionLink[];
};

export const SectionNav = ({ links, className, ...props }: SectionNavProps) => {
  const pathName = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathName.includes(link.href) ? "page" : undefined}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathName.includes(link.href) ? "" : "text-muted-foreground"
          )}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

export default SectionNav;
