import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { ContactFormData, Order } from "@/types";
import { email as t } from "@/lib/labels";
import { formatId } from "@/lib/utils";
import PurchaseReceiptEmail from "./purchase-receipt";
import ShipmentNoticeEmail from "./shipment-notice";
import { ContactRequest } from "./contact-message";
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();

/**
 * Instancié à la demande, et non au chargement du module : `new Resend()` lève
 * si la clé est absente, ce qui faisait échouer `next build` sur la collecte de
 * /api/webhooks/stripe avant même que le code ne s'exécute.
 */
let client: Resend | null = null;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY est absent : impossible d'envoyer l'e-mail."
    );
  }
  if (!client) client = new Resend(apiKey);
  return client;
}

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await getResend().emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: t.receiptSubject(formatId(order.id)),
    react: <PurchaseReceiptEmail order={order} />,
  });
};

export const sendContactRequest = async (data: ContactFormData) => {
  await getResend().emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: `${SENDER_EMAIL}`,
    subject: data.subject || t.contactSubject,
    react: <ContactRequest {...data} />,
  });
};

/**
 * L'échec d'envoi ne doit pas faire échouer l'expédition : le colis est parti,
 * c'est le fait qui compte. L'appelant enregistre l'incident et poursuit.
 */
export const sendShipmentNotice = async ({ order }: { order: Order }) => {
  await getResend().emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: t.shipmentSubject(formatId(order.id)),
    react: <ShipmentNoticeEmail order={order} />,
  });
};
