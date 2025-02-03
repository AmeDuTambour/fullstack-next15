"use server";

import { sendContactRequest } from "@/email";
import { ContactFormData } from "@/types";

export async function handleContactRequest(formData: ContactFormData) {
  try {
    await sendContactRequest(formData);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
}
