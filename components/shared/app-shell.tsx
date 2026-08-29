import Link from "next/link";
import BrandLogo from "@/components/shared/brand-logo";
import Menu from "@/components/shared/header/menu";
import SectionNav, { type SectionLink } from "@/components/shared/section-nav";
import type { ReactNode } from "react";

/**
 * Enveloppe des espaces authentifiés — administration et compte.
 *
 * Les deux dispositions ne différaient que par leur liste de liens et par un
 * champ de recherche qui ne fonctionnait pas côté compte.
 */
type AppShellProps = {
  links: SectionLink[];
  /** Zone d'actions à droite de la barre : recherche d'administration, etc. */
  actions?: ReactNode;
  children: ReactNode;
};

export const AppShell = ({ links, actions, children }: AppShellProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="w-full border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/" aria-label="L'Âme Du Tambour">
            {/* Visible sans défilement : chargé sans délai. Le chargement différé
                le laissait invisible, sa boîte mesurant zéro au premier rendu. */}
            <BrandLogo variant="square" height={48} priority />
          </Link>
          <SectionNav links={links} className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            {actions}
            <Menu />
          </div>
        </div>
      </div>
      <div className="container mx-auto flex-1 space-y-4 p-8 pt-6">
        {children}
      </div>
    </div>
  );
};

export default AppShell;
