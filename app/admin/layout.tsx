import BrandLogo from "@/components/shared/brand-logo";
import Menu from "@/components/shared/header/menu";
import Link from "next/link";
import MainNav from "./main-nav";
import AdminSearch from "@/components/admin/admin-search";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col">
        <div className="border-b w-full  mx-auto">
          <div className="flex items-center h-16 px-4">
            <Link href="/" className="w-22">
              <BrandLogo variant="square" height={48} />
            </Link>
            <MainNav className="mx-6" />
            <div className="ml-auto items-center flex space-x-4">
              <AdminSearch />
              <Menu />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
          {children}
        </div>
      </div>
    </>
  );
}
