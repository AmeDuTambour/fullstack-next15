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
        <div className="flex items-center w-full md:w-auto">
          <div className="md:hidden">
            <NavigationDrawer />
          </div>
          <Link
            href="/"
            className="flex flex-1 justify-center md:flex-none md:justify-start"
          >
            <div className="relative h-16 w-16">
              <BrandLogo variant="square" fill priority sizes="64px" />
            </div>
            <div className="relative h-16 aspect-[3/1] ml-4 hidden md:block">
              <BrandLogo variant="banner" fill priority sizes="192px" />
            </div>
          </Link>
        </div>
        <div className="hidden flex-1 items-center gap-4 md:flex">
          <NavigationLinks />
          <div className="ml-auto hidden lg:block">
            <Search />
          </div>
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
