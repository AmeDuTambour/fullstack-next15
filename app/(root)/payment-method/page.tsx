import { auth } from "@/auth";
import { Metadata } from "next";
import PaymentMethodForm from "./payment-method-form";
import { getUserById } from "@/lib/actions/user.actions";
import CheckoutSteps from "@/components/shared/checkout-steps";
import OrderSummary from "@/components/shared/order-summary";

export const metadata: Metadata = {
  title: "Méthode de paiement",
};

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={2} />
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div><PaymentMethodForm preferredPaymentMethod={user.paymentMethod} /></div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <OrderSummary />
        </aside>
      </div>
    </>
  );
};

export default PaymentMethodPage;
