import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { order as t } from "@/lib/labels";

/**
 * Barre d'étapes du tunnel.
 *
 * Trois états, alors que seule l'étape courante se distinguait : rien ne
 * séparait une étape franchie d'une étape à venir. Le séparateur était piloté
 * par une comparaison de chaîne restée en anglais après traduction, donc
 * toujours vraie — un trait orphelin s'affichait après la dernière étape.
 *
 * Une étape franchie est atteignable : revenir corriger une adresse ne doit pas
 * passer par le bouton retour du navigateur.
 */
const STEPS = [
  { label: t.stepSignIn, href: null },
  { label: t.stepAddress, href: "/shipping-address" },
  { label: t.stepPayment, href: "/payment-method" },
  { label: t.stepReview, href: "/place-order" },
];

type CheckoutStepsProps = { current?: number };

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ current = 0 }) => {
  return (
    <nav aria-label={t.stepsLabel} className="mb-10">
      <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        {STEPS.map((step, index) => {
          const state =
            index < current ? "done" : index === current ? "current" : "todo";
          const content = (
            <span
              className={cn(
                "block rounded-full px-4 py-2 text-center text-sm transition-colors",
                state === "current" && "bg-secondary text-secondary-foreground font-medium",
                state === "done" && "text-foreground hover:bg-secondary/60",
                state === "todo" && "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          );

          return (
            <React.Fragment key={step.label}>
              <li
                className="md:flex-1"
                aria-current={state === "current" ? "step" : undefined}
              >
                {state === "done" && step.href ? (
                  <Link href={step.href}>{content}</Link>
                ) : (
                  content
                )}
              </li>
              {index < STEPS.length - 1 ? (
                <li
                  aria-hidden="true"
                  className={cn(
                    "hidden h-px flex-1 md:block",
                    index < current ? "bg-foreground/30" : "bg-border"
                  )}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default CheckoutSteps;
