import { cn } from "@/lib/utils";
import React from "react";

type CheckoutStepsProps = {
  current: number;
};

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ current = 0 }) => {
  return (
    <div className="flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10">
      {[
        "Connexion utilisateur",
        "Adresse de livraison",
        "Mode de paiement",
        "Passer la commande",
      ].map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "p-2 w-56 rounded-full text-center text-sm",
              index === current ? "bg-secondary text-secondary-foreground" : ""
            )}
          >
            {step}
          </div>
          {step !== "Place Order" ? (
            <hr className="w-16 border border-t-accent  mx-2" />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
