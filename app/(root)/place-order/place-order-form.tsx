"use client";

import { PendingButton } from "@/components/ui/pending-button";
import Link from "next/link";

import { common, order as t } from "@/lib/labels";
import { createOrder } from "@/lib/actions/order.actions";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <PendingButton
        pending={pending}
        icon={<Check className="h-4 w-4" />}
        className="w-full"
      >
        {common.placeOrder}
      </PendingButton>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <PlaceOrderButton />
      {/* Les conditions et le droit de rétractation sont consultables sans
          quitter le tunnel : les ouvrir dans le même onglet ferait perdre la
          commande en cours. */}
      <p className="text-xs text-muted-foreground">
        {t.acceptTermsPrefix}{" "}
        <Link
          href="/legal/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          {t.termsLink}
        </Link>{" "}
        {t.and}{" "}
        <Link
          href="/legal/shipping-returns"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          {t.returnsLink}
        </Link>
        {"."}
      </p>
    </form>
  );
};

export default PlaceOrderForm;
