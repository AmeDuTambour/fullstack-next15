"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  approvePayPalOrder,
  markOrderAsPaid,
  markOrderAsDelivered,
  createPayPalOrder,
} from "@/lib/actions/order.actions";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import StripePayment from "./stripe-payment";
import { common, order as t } from "@/lib/labels";

type OrderDetailsTableProps = {
  order: Omit<Order, "paymentResult">;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
};

const OrderDetailsTable: React.FC<OrderDetailsTableProps> = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}) => {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const { toast } = useToast();

  // Composée hors du balisage : une adresse est une donnée, pas un libellé.
  const formattedAddress = [
    shippingAddress.streetAddress,
    shippingAddress.city,
    shippingAddress.postalCode,
    shippingAddress.country,
  ]
    .filter(Boolean)
    .join(", ");

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = "";
    if (isPending) {
      status = t.paypalLoading;
    }
    if (isRejected) {
      status = t.paypalError;
    }
    return status;
  };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);
    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
    }
    return res.data;
  };
  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);
    toast({
      variant: res.success ? "default" : "destructive",
      description: res.message,
    });
  };

  const MarkAsPaidButton = () => {
    const { toast } = useToast();

    const [isPending, startTransition] = useTransition();

    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await markOrderAsPaid(order.id);
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message,
            });
          })
        }
      >
        {isPending ? common.processing : t.markAsPaid}
      </Button>
    );
  };

  const MarkAsDeliveredButton = () => {
    const { toast } = useToast();

    const [isPending, startTransition] = useTransition();

    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await markOrderAsDelivered(order.id);
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message,
            });
          })
        }
      >
        {isPending ? common.processing : t.markAsDelivered}
      </Button>
    );
  };

  return (
    <>
      <h1 className="py-4 text-2xl">{t.title(formatId(id))}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-4-y overflow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{t.paymentMethod}</h2>
              <p className="mb-2">{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary">
                  {t.paidAt(formatDateTime(paidAt!).dateTime)}
                </Badge>
              ) : (
                <Badge variant="outline">{t.awaitingPayment}</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="my-2">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{t.shippingAddress}</h2>
              <p>{shippingAddress.fullName}</p>
              <p className="mb-2">{formattedAddress}</p>
              {isDelivered ? (
                <Badge variant="secondary">
                  {t.deliveredAt(formatDateTime(deliveredAt!).dateTime)}
                </Badge>
              ) : (
                <Badge variant="outline">{t.notDelivered}</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="my-2">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{t.items}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{common.product}</TableHead>
                    <TableHead>{common.quantity}</TableHead>
                    <TableHead>{common.price}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            height={50}
                            width={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        €{item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>{t.itemsSubtotal}</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>{t.tax}</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>{t.shipping}</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>{t.total}</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              {!isPaid && paymentMethod === "PayPal" ? (
                <div>
                  <PayPalScriptProvider
                    options={{ clientId: paypalClientId, currency: "EUR" }}
                  >
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              ) : null}

              {/* STRIPE PAYMENT */}

              {!isPaid && paymentMethod === "Stripe" && stripeClientSecret ? (
                <StripePayment
                  priceInCents={Number(order.totalPrice) * 100}
                  orderId={order.id}
                  clientSecret={stripeClientSecret}
                />
              ) : null}

              {!isPaid && paymentMethod === "Transfer" ? (
                <div className="rounded-md border p-3">
                  <p className="font-medium">{t.transferPendingTitle}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t.transferPendingBody}
                  </p>
                </div>
              ) : null}

              {isAdmin && (!isPaid || !isDelivered) ? (
                <div className="rounded-md border p-3">
                  {!isPaid ? <MarkAsPaidButton /> : null}
                  {isPaid && !isDelivered ? <MarkAsDeliveredButton /> : null}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
