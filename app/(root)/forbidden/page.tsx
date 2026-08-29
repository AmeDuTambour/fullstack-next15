import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { feedback as t } from "@/lib/labels";

export const metadata: Metadata = {
  title: t.forbiddenTitle,
  robots: { index: false },
};

/**
 * Refus d'accès présenté comme une information, pas comme une panne.
 *
 * Un visiteur connecté qui atteignait une adresse d'administration recevait un
 * écran d'erreur : rien ne s'était pourtant cassé, il n'avait simplement pas
 * les droits. La distinction compte — l'un se réessaie, l'autre non.
 */
const ForbiddenPage = () => (
  <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-5 py-20 text-center">
    <h1 className="page-title">{t.forbiddenTitle}</h1>
    <p className="text-muted-foreground">{t.forbiddenBody}</p>
    <div className="flex flex-wrap justify-center gap-3">
      <Button asChild>
        <Link href="/">{t.backHome}</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/sign-in">{t.signIn}</Link>
      </Button>
    </div>
  </div>
);

export default ForbiddenPage;
