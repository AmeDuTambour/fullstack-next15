import { auth } from "@/auth";
import { getUserCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address-form";
import { ShippingAddress } from "@/types";
import CheckoutSteps from "@/components/shared/checkout-steps";
import OrderSummary from "@/components/shared/order-summary";

export const metadata: Metadata = {
  title: "Adresse de livraison",
};

const ShippingAddressPage = async () => {
  const cart = await getUserCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();

  const userId = session?.user?.id;
  if (!userId) throw new Error("No user ID");

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={1} />
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div><ShippingAddressForm address={user.address as ShippingAddress} /></div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <OrderSummary />
        </aside>
      </div>
    </>
  );
};

export default ShippingAddressPage;
