"use client";

import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { PendingButton } from "@/components/ui/pending-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { formatCurrency } from "@/lib/utils";
import { Cart, CartItem } from "@/types";
import { ArrowRight, Loader, Minus, Plus, Trash2 } from "lucide-react";
import { catalog as t, common, order } from "@/lib/labels";
import ContentImage from "@/components/ui/content-image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export type CartTableProps = {
  cart?: Cart;
  /** Par identifiant de produit : une pièce unique n'expose pas de quantité. */
  quantityAllowed?: Record<string, boolean>;
};


/**
 * Contrôle de quantité d'une ligne de panier.
 *
 * Une pièce unique n'a pas de quantité à choisir : elle se retire ou elle
 * reste. Un accessoire se compte. La règle vit dans `lib/product.ts` ; ici on
 * n'en rend que la conséquence.
 */
const QuantityControls = ({
  item,
  pending,
  allowsQuantity,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  pending: boolean;
  allowsQuantity: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}) => {
  const spinnerOr = (icon: React.ReactNode) =>
    pending ? <Loader className="h-4 w-4 animate-spin" /> : icon;

  if (!allowsQuantity) {
    return (
      <>
        <span>{item.qty}</span>
        <Button
          disabled={pending}
          variant="ghost"
          size="sm"
          type="button"
          aria-label={t.removeItem}
          onClick={onDecrease}
        >
          {spinnerOr(<Trash2 className="h-4 w-4" />)}
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        disabled={pending}
        variant="outline"
        type="button"
        aria-label={t.decreaseQuantity}
        onClick={onDecrease}
      >
        {spinnerOr(<Minus className="h-4 w-4" />)}
      </Button>
      <span>{item.qty}</span>
      <Button
        disabled={pending}
        variant="outline"
        type="button"
        aria-label={t.increaseQuantity}
        onClick={onIncrease}
      >
        {spinnerOr(<Plus className="h-4 w-4" />)}
      </Button>
    </>
  );
};

const CartTable: React.FC<CartTableProps> = ({ cart, quantityAllowed = {} }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  /**
   * Quelle ligne est en cours de modification.
   *
   * Une seule attente était partagée par tout le tableau : augmenter la
   * quantité d'un article faisait tourner le témoin de chaque ligne et
   * désactivait tous les boutons. L'acheteur ne pouvait pas savoir laquelle
   * de ses actions était en cours.
   */
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);

  const handleOnRemoveItemFromCart = async (itemId: string) => {
    setPendingItemId(itemId);
    startTransition(async () => {
      const res = await removeItemFromCart(itemId);
      setPendingItemId(null);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      }
    });
  };

  const handleOnAddItemToCart = async (item: CartItem) => {
    setPendingItemId(item.productId);
    startTransition(async () => {
      const res = await addItemToCart(item);
      setPendingItemId(null);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      }
    });
  };

  const handleProceedCheckout = () => {
    startTransition(() => {
      router.push("/shipping-address");
    });
  };

  return (
    <>
      <h1 className="page-title py-4">{common.cart}</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Le panier est vide.{" "}
          <Link href="/" className="link underline">
            Retourner vers la boutique
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead className="text-center">Quantité</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <ContentImage
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          sizes="50px"
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <QuantityControls
                        item={item}
                        pending={isPending && pendingItemId === item.productId}
                        allowsQuantity={
                          quantityAllowed[item.productId] !== false
                        }
                        onIncrease={() => handleOnAddItemToCart(item)}
                        onDecrease={() =>
                          handleOnRemoveItemFromCart(item.productId)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="space-y-4 p-4">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt>
                    {order.subtotalWithCount(
                      cart.items.reduce((acc, curr) => acc + curr.qty, 0)
                    )}
                  </dt>
                  <dd>{formatCurrency(cart.itemsPrice.toString())}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{order.shipping}</dt>
                  <dd>
                    {Number(cart.shippingPrice) === 0
                      ? order.freeShipping
                      : formatCurrency(cart.shippingPrice.toString())}
                  </dd>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <dt>{order.total}</dt>
                  <dd>{formatCurrency(cart.totalPrice.toString())}</dd>
                </div>
              </dl>

              {Number(cart.shippingPrice) > 0 ? (
                <p className="text-sm text-muted-foreground">
                  {order.freeShippingFrom(
                    formatCurrency(FREE_SHIPPING_THRESHOLD.toString())
                  )}
                </p>
              ) : null}
              <PendingButton
                className="w-full"
                pending={isPending}
                icon={<ArrowRight className="h-4 w-4" />}
                onClick={handleProceedCheckout}
              >
                {t.proceedToCheckout}
              </PendingButton>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
