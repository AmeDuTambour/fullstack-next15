import { Metadata } from "next";
import CartTable from "./cart-table";
import { getUserCart } from "@/lib/actions/cart.actions";

export const metadata: Metadata = {
  title: "Shopping Cart",
};
const CartPage = async () => {
  const cart = await getUserCart();
  return (
    <>
      <CartTable cart={cart} />
    </>
  );
};

export default CartPage;
