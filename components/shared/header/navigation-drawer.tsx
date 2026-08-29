import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

import { common } from "@/lib/labels";
import { NAVIGATION } from "./navigation";

const NavigationDrawer = () => {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline" aria-label={common.openMenu}>
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>{common.menu}</DrawerHeader>
        <div className="space-y-1">
          {NAVIGATION.map((section) => (
            <DrawerClose asChild key={section.path}>
              <Link href={section.path}>
                <Button
                  variant="ghost"
                  className="w-full justify-start flex items-center gap-2"
                >
                  <section.icon className="h-5 w-5" />
                  {section.title}
                </Button>
              </Link>
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NavigationDrawer;
