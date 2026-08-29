import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import ContactForm from "./contact-form";
import { WORKSHOP } from "@/lib/content/workshop";
import { contact as t } from "@/lib/labels";

export const metadata: Metadata = {
  title: t.title,
  description: t.metaDescription,
};

const ContactPage = () => {
  const details = [
    { icon: MapPin, value: WORKSHOP.address || WORKSHOP.city },
    { icon: Mail, value: WORKSHOP.email, href: `mailto:${WORKSHOP.email}` },
    { icon: Phone, value: WORKSHOP.phone, href: `tel:${WORKSHOP.phone}` },
    { icon: Clock, value: t.replyDelay(WORKSHOP.replyDelay) },
  ].filter((detail) => detail.value);

  return (
    <div className="mx-auto grid max-w-4xl gap-10 py-8 lg:grid-cols-[1fr_18rem]">
      <div className="space-y-6">
        <h1 className="page-title">{t.title}</h1>
        <ContactForm />
      </div>

      <aside className="space-y-3">
        <h2 className="section-title">{t.workshopHeading}</h2>
        <ul className="space-y-3 text-sm">
          {details.map((detail) => (
            <li key={detail.value} className="flex items-start gap-3">
              <detail.icon
                className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              {detail.href ? (
                <a href={detail.href} className="hover:underline">
                  {detail.value}
                </a>
              ) : (
                <span>{detail.value}</span>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default ContactPage;
