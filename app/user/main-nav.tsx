"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { account as t } from "@/lib/labels";

const links = [
  { title: t.profile, href: "/user/profile" },
  { title: t.orders, href: "/user/orders" },
];

type MainNavProps = React.HTMLAttributes<HTMLElement>;

const MainNav: React.FC<MainNavProps> = ({ className, ...props }) => {
  const pathName = usePathname();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathName.includes(item.href) ? "" : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
