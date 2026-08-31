import Link from "next/link";
import ContentImage from "@/components/ui/content-image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserCart } from "@/lib/actions/cart.actions";
import { SHIPPING_DELAY } from "@/lib/constants";
import { catalog, order as t } from "@/lib/labels";
import { formatCurrency } from "@/lib/utils";

/**
 * Récapitulatif de commande, présent aux quatre étapes du tunnel.
 *
 * Il résout lui-même le panier plutôt que de le recevoir : un composant qui lit
 * sa propre source ne peut pas afficher un montant différent d'un écran à
 * l'autre. Les deux écrans de saisie n'affichaient rien du tout — l'acheteur
 * renseignait son adresse sans voir ce qu'il achetait ni ce qu'il allait payer.
 */
const OrderSummary = async () => {
  const cart = await getUserCart();
  if (!cart || cart.items.length === 0) return null;

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <h2 className="section-title">{t.summaryTitle}</h2>

        <ul className="space-y-3">
          {cart.items.map((item) => (
            <li key={item.slug} className="flex items-center gap-3">
              <ContentImage
                src={item.image}
                alt={item.name}
                width={48}
                height={48}
                sizes="48px"
                className="h-12 w-12 shrink-0 rounded-sm object-cover"
              />
              <Link
                href={`/product/${item.slug}`}
                className="flex-1 text-sm hover:underline"
              >
                {item.name}
              </Link>
              <span className="text-sm text-muted-foreground">
                {item.qty > 1 ? `× ${item.qty}` : null}
              </span>
              <span className="text-sm font-medium">
                {formatCurrency(item.price)}
              </span>
            </li>
          ))}
        </ul>

        <Separator />

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>{t.itemsSubtotal}</dt>
            <dd>{formatCurrency(cart.itemsPrice)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>{t.shipping}</dt>
            <dd>
              {Number(cart.shippingPrice) === 0
                ? t.freeShipping
                : formatCurrency(cart.shippingPrice)}
            </dd>
          </div>
          <div className="flex justify-between font-semibold">
            <dt>{t.total}</dt>
            <dd>{formatCurrency(cart.totalPrice)}</dd>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <dt>{t.tax}</dt>
            <dd>{formatCurrency(cart.taxPrice)}</dd>
          </div>
        </dl>

        <p className="text-sm text-muted-foreground">
          {catalog.shippingDelay(SHIPPING_DELAY)}
        </p>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
