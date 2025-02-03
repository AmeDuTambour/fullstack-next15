import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { ContactFormData, Order } from "@/types";
import PurchaseReceiptEmail from "./purchase-receipt";
import { ContactRequest } from "./contact-message";
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseReceiptEmail order={order} />,
  });
};

export const sendContactRequest = async (data: ContactFormData) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: `${SENDER_EMAIL}`,
    subject: data.subject || "New Contact Form Submission",
    react: <ContactRequest {...data} />,
  });
};
