import Link from "next/link";

import { Button } from "@/components/ui/button";
import { NAVIGATION } from "./navigation";

const NavigationLinks = () => (
  <nav className="flex items-center gap-1">
    {NAVIGATION.map((link) => (
      <Button key={link.path} asChild variant="ghost" size="sm">
        <Link href={link.path}>{link.title}</Link>
      </Button>
    ))}
  </nav>
);

export default NavigationLinks;
