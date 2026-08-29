import AppShell from "@/components/shared/app-shell";
import AdminSearch from "@/components/admin/admin-search";
import { admin as t } from "@/lib/labels";

const LINKS = [
  { title: t.nav.overview, href: "/admin/overview" },
  { title: t.nav.products, href: "/admin/products" },
  { title: t.nav.orders, href: "/admin/orders" },
  { title: t.nav.users, href: "/admin/users" },
  { title: t.nav.articles, href: "/admin/articles" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppShell links={LINKS} actions={<AdminSearch />}>
      {children}
    </AppShell>
  );
}
