"use client";

import { PendingButton } from "@/components/ui/pending-button";
import { common } from "@/lib/labels";
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
    <form onSubmit={handleSubmit}>
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
