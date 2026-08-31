import AppShell from "@/components/shared/app-shell";
import { account as t } from "@/lib/labels";

const LINKS = [
  { title: t.profile, href: "/user/profile" },
  { title: t.orders, href: "/user/orders" },
];

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell links={LINKS}>{children}</AppShell>;
}
