import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";
import CategoryDrawer from "./category-drawer";
import Search from "./search";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoryDrawer />
          <Link href="/" className="flex-start">
            <div className="relative w-16 h-16 ml-4">
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
            <div className="relative h-16 aspect-[3/1] ">
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
        <div className="hidden md:block">
          <Search />
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
