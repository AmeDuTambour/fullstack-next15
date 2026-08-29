import { account as t } from "@/lib/labels";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";
import { UserIcon } from "lucide-react";
import Link from "next/link";

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon aria-hidden="true" /> {t.signIn}
        </Link>
      </Button>
    );
  }
  const firstInitial = session.user?.name?.charAt(0).toLocaleUpperCase() ?? "U";

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              aria-label={t.accountMenu}
              className="relative ml-2 flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
            >
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
              <div className="text-sm text-muted-foreground leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href="/user/profile" className="w-full">
              {t.myProfile}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user/orders" className="w-full">
              {t.orderHistory}
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === "admin" ? (
            <DropdownMenuItem>
              <Link href="/admin/overview" className="w-full">
                {t.adminArea}
              </Link>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                variant="ghost"
                className="w-full py-4 px-2 h-4 justify-start"
              >
                Se déconnecter
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
