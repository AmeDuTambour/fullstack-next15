"use client";

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
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type CartTableProps = {
  cart?: Cart;
};

const CartTable: React.FC<CartTableProps> = ({ cart }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleOnRemoveItemFromCart = async (itemId: string) => {
    startTransition(async () => {
      const res = await removeItemFromCart(itemId);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      }
    });
  };

  const handleOnAddItemToCart = async (item: CartItem) => {
    startTransition(async () => {
      const res = await addItemToCart(item);
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
      <h1 className="py-4 h2-bold">Paniert</h1>
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
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() =>
                          handleOnRemoveItemFromCart(item.productId)
                        }
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </Button>
                      <span>{item.qty}</span>
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() => handleOnAddItemToCart(item)}
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">€{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                Sous-total (
                {cart.items.reduce((acc, curr) => acc + curr.qty, 0)}
                ):
                <span className="font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className="w-full"
                disabled={isPending}
                onClick={handleProceedCheckout}
              >
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}{" "}
                Passer au paiement
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
