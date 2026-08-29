import { Button } from "@/components/ui/button";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { common } from "@/lib/labels";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";
import { UserButtonMobile } from "./user-button-mobile";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden lg:flex w-full max-w-xs gap-1">
        <Button asChild variant="ghost" size="icon">
          <Link href="/cart" aria-label={common.cart}>
            <ShoppingCart aria-hidden="true" />
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="lg:hidden">
        <Sheet>
          {/* 44 pixels de côté : la taille de cible tactile recommandée. Le
              déclencheur mesurait la hauteur de son icône. */}
          <SheetTrigger
            aria-label={common.openAccountMenu}
            className="flex h-11 w-11 items-center justify-center rounded-md align-middle"
          >
            <EllipsisVertical aria-hidden="true" />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <div className="flex flex-row items-start">
              <SheetTitle>{common.menu}</SheetTitle>
            </div>
            <UserButtonMobile />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
