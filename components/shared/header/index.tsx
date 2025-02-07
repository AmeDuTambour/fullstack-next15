import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";
import NavigationLinks from "./navigation-links";
import NavigationDrawer from "./navigation-drawer";

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
              <Image
                src="/images/brand/logo-square-light.png"
                alt={`${APP_NAME} logo`}
                fill
                className="object-contain dark:hidden"
                priority={true}
              />
              <Image
                src="/images/brand/logo-square-dark.png"
                alt={`${APP_NAME} logo`}
                fill
                className="object-contain hidden dark:block"
                priority={true}
              />
            </div>
            <div className="relative h-16 aspect-[3/1] ml-4 hidden md:block">
              <Image
                src="/images/brand/logo-banner-light.png"
                alt={`${APP_NAME} logo`}
                fill
                className="object-contain dark:hidden"
                priority={true}
              />
              <Image
                src="/images/brand/logo-banner-dark.png"
                alt={`${APP_NAME} logo`}
                fill
                className="object-contain hidden dark:block"
                priority={true}
              />
            </div>
          </Link>
        </div>
        <div className="hidden flex-1 md:block">
          {/* <Search /> */}
          <NavigationLinks />
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
