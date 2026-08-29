import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Landmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOrderById } from "@/lib/actions/order.actions";
import { order as t } from "@/lib/labels";
import { formatCurrency, formatId } from "@/lib/utils";

export const metadata: Metadata = {
  title: t.thanksTitle,
};

/**
 * Fin de parcours, commune aux trois moyens de paiement.
 *
 * Elle n'existait que pour Stripe. PayPal reposait un message dans un toast
 * éphémère, et le virement renvoyait vers le détail de commande, où
 * l'acheteur devait deviner que sa commande était bien passée. Trois issues
 * pour un même acte, dont deux sans confirmation.
 *
 * Le message diffère parce que la situation diffère : payé pour la carte et
 * PayPal, à payer pour le virement — mais la page, elle, est la même.
 */
const ThankYouPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const awaitingTransfer = order.paymentMethod === "Transfer" && !order.isPaid;

  return (
    <div className="mx-auto max-w-xl space-y-6 py-8 text-center">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"
        aria-hidden="true"
      >
        {awaitingTransfer ? (
          <Landmark className="h-7 w-7" />
        ) : (
          <CheckCircle2 className="h-7 w-7" />
        )}
      </div>

      <h1 className="page-title">
        {awaitingTransfer ? t.transferPendingTitle : t.thanksTitle}
      </h1>

      <p className="text-muted-foreground">
        {awaitingTransfer ? t.transferPendingBody : t.thanksBody}
      </p>

      <Card className="text-left">
        <CardContent className="space-y-2 p-4 text-sm">
          <div className="flex justify-between">
            <span>{t.orderReference}</span>
            <span className="font-medium">{formatId(order.id)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.total}</span>
            <span className="font-medium">
              {formatCurrency(order.totalPrice)}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href={`/order/${order.id}`}>{t.viewOrder}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/search">{t.continueShopping}</Link>
        </Button>
      </div>
    </div>
  );
};

export default ThankYouPage;
