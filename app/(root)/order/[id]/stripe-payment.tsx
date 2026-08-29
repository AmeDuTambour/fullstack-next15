import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeForm from "./StripeForm";

type StripePaymentProps = {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
};

const StripePayment: React.FC<StripePaymentProps> = ({
  priceInCents,
  orderId,
  clientSecret,
}) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm priceInCents={priceInCents} orderId={orderId} />
    </Elements>
  );
};

export default StripePayment;
