"use client";

import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { common } from "@/lib/labels";
import type { ComponentProps, ReactNode } from "react";

/**
 * Bouton portant son état d'attente.
 *
 * Dix fichiers reconstruisaient ce comportement, chacun à sa façon : certains
 * remplaçaient le libellé, d'autres non ; certains gardaient l'icône, d'autres
 * la substituaient. Un seul endroit décide désormais de quoi a l'air une action
 * en cours.
 */
type PendingButtonProps = ComponentProps<typeof Button> & {
  pending: boolean;
  /** Libellé affiché pendant le traitement. Par défaut : « Envoi en cours… ». */
  pendingLabel?: string;
  /** Icône affichée au repos. Remplacée par l'indicateur de chargement. */
  icon?: ReactNode;
};

export const PendingButton = ({
  pending,
  pendingLabel,
  icon,
  children,
  disabled,
  ...props
}: PendingButtonProps) => {
  return (
    <Button disabled={pending || disabled} {...props}>
      {pending ? <Loader className="h-4 w-4 animate-spin" /> : icon}
      {pending ? (pendingLabel ?? common.submitting) : children}
    </Button>
  );
};

export default PendingButton;
