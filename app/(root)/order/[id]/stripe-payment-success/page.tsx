import { getOrderById } from "@/lib/actions/order.actions";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";

// Instancié à la demande : au chargement du module, l'absence de clé casse le
// build. Voir la même précaution dans email/index.tsx.
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY est absent.");
  return new Stripe(key);
}

const SuccessPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  const { id } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;

  // Fetch order
  const order = await getOrderById(id);
  if (!order) notFound();

  // Retrieve payment intent
  const paymentIntent =
    await getStripe().paymentIntents.retrieve(paymentIntentId);

  // Check if payment intent is valid
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound();
  }

  // Check if payment is successful
  const isSuccess = paymentIntent.status === "succeeded";

  if (!isSuccess) return redirect(`/order/${id}`);

  // La confirmation est la même pour les trois moyens de paiement. Cette route
  // ne garde que ce qui lui est propre : la vérification de l'intention Stripe.
  redirect(`/order/${id}/thank-you`);
};

export default SuccessPage;
