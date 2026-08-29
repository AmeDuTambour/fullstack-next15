"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { feedback as t } from "@/lib/labels";

/**
 * Écran d'erreur du site.
 *
 * Il n'y en avait aucun : une exception non rattrapée affichait la page grise
 * de Next, hors du site, en anglais, avec une pile d'appels. Le visiteur n'y
 * apprenait rien et n'avait nulle part où aller.
 *
 * Le détail technique n'est jamais montré — il part dans la console du serveur,
 * où il sert à quelque chose. Ce qui est offert ici, ce sont des issues.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-5 py-20 text-center">
      <h1 className="page-title">{t.errorTitle}</h1>
      <p className="text-muted-foreground">{t.errorBody}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>{t.retry}</Button>
        <Button asChild variant="outline">
          <Link href="/">{t.backHome}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">{t.contactUs}</Link>
        </Button>
      </div>
    </div>
  );
}
