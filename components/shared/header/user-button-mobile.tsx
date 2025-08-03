import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  History,
  Power,
  ShieldCheck,
  ShoppingCart,
  User,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { signOutUser } from "@/lib/actions/user.actions";

export const UserButtonMobile = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon /> Se connecter
        </Link>
      </Button>
    );
  }
  return (
    <div className="flex flex-col h-full items-start justify-between">
      <nav className="lg:hidden flex flex-col items-start">
        <Button asChild variant="ghost">
          <Link href="/user/profile">
            <User /> Mon profil
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart /> Panier
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/user/orders">
            <History />
            Historique des commandes
          </Link>
        </Button>
        {session?.user?.role === "admin" ? (
          <Button asChild variant="ghost">
            <Link href="/admin/overview">
              <ShieldCheck /> Admin
            </Link>
          </Button>
        ) : null}
      </nav>
      <div className="flex flex-row w-full">
        <div className="flex flex-col space-y-1 mr-6">
          <div className="text-sm font-medium leading-none ">
            {session.user?.name}
          </div>
          <div className="text-sm text-muted-foreground leading-none">
            {session.user?.email}
          </div>
        </div>
        <form action={signOutUser}>
          <Button asChild variant="ghost">
            <Link href="/">
              <Power />
            </Link>
          </Button>
        </form>
      </div>
    </div>
  );
};
