import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/order.actions";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");

  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET est absent.");
    return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    // La vérification de signature n'était pas encadrée : une signature
    // invalide remontait en 500, et Stripe réessayait la livraison en boucle.
    // Une signature invalide est une erreur du client, donc une 400.
    event = Stripe.webhooks.constructEvent(
      await req.text(),
      signature as string,
      secret
    );
  } catch (error) {
    console.error("Signature de webhook Stripe invalide :", error);
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "charge.succeeded") {
    const { object } = event.data;
    await updateOrderToPaid({
      orderId: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: "COMPLETED",
        email_address: object.billing_details.email!,
        pricePaid: (object.amount / 100).toFixed(),
      },
    });

    return NextResponse.json({
      message: "updateOrderToPaid was successful",
    });
  }

  return NextResponse.json({
    message: "event is not charged.succeeded",
  });
}
