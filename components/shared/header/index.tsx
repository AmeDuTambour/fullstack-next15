import { Suspense } from "react";

import BrandLogo from "@/components/shared/brand-logo";
import Link from "next/link";
import Menu from "./menu";
import NavigationLinks from "./navigation-links";
import NavigationDrawer from "./navigation-drawer";
import Search from "./search";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="flex-between px-6 py-4">
        <div className="flex w-full items-center lg:w-auto">
          <div className="lg:hidden">
            <NavigationDrawer />
          </div>
          <Link
            href="/"
            className="flex flex-1 justify-center lg:flex-none lg:justify-start"
          >
            <div className="relative h-16 w-16">
              <BrandLogo variant="square" fill priority sizes="64px" />
            </div>
            <div className="relative ml-4 hidden aspect-[3/1] h-16 lg:block">
              <BrandLogo variant="banner" fill priority sizes="192px" />
            </div>
          </Link>
        </div>
        <div className="hidden min-w-0 flex-1 items-center gap-4 pl-6 lg:flex">
          <NavigationLinks />
          {/* `useSearchParams` fait basculer tout l'arbre en rendu client si
              rien ne l'isole : les seules pages prérendues du site — les pages
              d'information, générées par `generateStaticParams` — cassaient le
              build avec « useSearchParams should be wrapped in a suspense
              boundary ». La frontière contient ce basculement à ce champ. */}
          <div className="ml-auto hidden xl:block">
            <Suspense fallback={<div className="h-10 w-full max-w-xs" />}>
              <Search />
            </Suspense>
          </div>
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
