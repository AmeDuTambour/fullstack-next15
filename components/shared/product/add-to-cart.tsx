"use client";

import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { Plus, Minus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { catalog as t } from "@/lib/labels";

type AddToCartProps = {
  item: CartItem;
  cart?: Cart;
  /** Une pièce unique ne se commande jamais en plusieurs exemplaires : le
   *  sélecteur de quantité n'a pas de sens et promet un second exemplaire qui
   *  n'existe pas. */
  allowsQuantity?: boolean;
};
const AddToCart: React.FC<AddToCartProps> = ({
  item,
  cart,
  allowsQuantity = true,
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      toast({
        description: res.message,
        action: (
          <ToastAction
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            altText="Go To Cart"
            onClick={() => router.push("/cart")}
          >
            Voir le panier
          </ToastAction>
        ),
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });
    });
  };

  const existItem =
    cart && cart.items.find((el) => el.productId === item.productId);

  // Déjà au panier, et pas de quantité à choisir : plus rien à proposer ici.
  if (existItem && !allowsQuantity) {
    return (
      <Button asChild variant="outline" className="w-full">
        <Link href="/cart">{t.inCart}</Link>
      </Button>
    );
  }

  return existItem ? (
    <div>
      <Button
        disabled={isPending}
        type="button"
        variant="outline"
        onClick={handleRemoveFromCart}
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        disabled={isPending}
        type="button"
        variant="outline"
        onClick={handleAddToCart}
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      disabled={isPending}
      className="w-full"
      type="button"
      onClick={handleAddToCart}
    >
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      {t.addToCart}
    </Button>
  );
};

export default AddToCart;
