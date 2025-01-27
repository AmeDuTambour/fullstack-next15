import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  ContactIcon,
  HomeIcon,
  IdCardIcon,
  MenuIcon,
  NewspaperIcon,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

const NavigationDrawer = () => {
  const sections = [
    {
      title: "Accueil",
      path: "/",
      icon: HomeIcon,
    },
    {
      title: "Boutique",
      path: "/search",
      icon: ShoppingBag,
    },
    {
      title: "Blog",
      path: "/blog",
      icon: NewspaperIcon,
    },
    {
      title: "À propos",
      path: "/about",
      icon: IdCardIcon,
    },
    {
      title: "Contact",
      path: "/contact",
      icon: ContactIcon,
    },
  ];

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>Menu</DrawerHeader>
        <div className="space-y-1">
          {sections.map((section) => (
            <DrawerClose asChild key={section.title}>
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
