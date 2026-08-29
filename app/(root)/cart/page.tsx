import { Metadata } from "next";
import CartTable from "./cart-table";
import { getUserCart } from "@/lib/actions/cart.actions";
import { prisma } from "@/db/prisma";
import { allowsQuantitySelection, getProductNature } from "@/lib/product";

export const metadata: Metadata = {
  title: "Panier",
};
const CartPage = async () => {
  const cart = await getUserCart();

  // Un article de panier ne porte pas sa catégorie. La résoudre ici, côté
  // serveur, plutôt que la figer dans le panier : une donnée dupliquée finit
  // par diverger de sa source.
  const products = cart?.items.length
    ? await prisma.product.findMany({
        where: { id: { in: cart.items.map((item) => item.productId) } },
        select: { id: true, category: { select: { name: true } } },
      })
    : [];

  const quantityAllowed: Record<string, boolean> = Object.fromEntries(
    products.map((product) => [
      product.id,
      allowsQuantitySelection(getProductNature(product.category?.name)),
    ])
  );

  return <CartTable cart={cart} quantityAllowed={quantityAllowed} />;
};

export default CartPage;
