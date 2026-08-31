import { redirect } from "next/navigation";

import AppShell from "@/components/shared/app-shell";
import { isAdmin } from "@/lib/auth-guards";
import AdminSearch from "@/components/admin/admin-search";
import { admin as t } from "@/lib/labels";

const LINKS = [
  { title: t.nav.overview, href: "/admin/overview" },
  { title: t.nav.products, href: "/admin/products" },
  { title: t.nav.orders, href: "/admin/orders" },
  { title: t.nav.users, href: "/admin/users" },
  { title: t.nav.articles, href: "/admin/articles" },
];

/**
 * Refus d'accès présenté comme une information, pas comme une panne.
 *
 * Ce contrôle ne peut pas vivre dans le middleware : `auth.config.ts` est
 * dépourvu de callback `session` — c'est ce qui le garde compatible Edge — donc
 * le rôle n'y est jamais lisible. Ici, côté Node, la session est complète.
 *
 * Il ne remplace pas les gardes des pages et des actions : celles-ci restent
 * seules responsables du contrôle d'accès. Il évite seulement de présenter une
 * exception là où il n'y a qu'un manque de droits.
 */
export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!(await isAdmin())) redirect("/forbidden");

  return (
    <AppShell links={LINKS} actions={<AdminSearch />}>
      {children}
    </AppShell>
  );
}
