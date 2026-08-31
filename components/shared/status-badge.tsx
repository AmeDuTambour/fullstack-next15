import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Indicateur d'état, présentation unique.
 *
 * Six écrans affichaient un état — publié, payé, livré — de six manières
 * différentes : deux badges shadcn dans le détail de commande, une icône seule
 * sans légende dans la liste des produits, une icône accolée à du texte dans
 * les articles, du texte nu dans les deux listes de commandes.
 *
 * L'icône n'est jamais seule : elle est décorative, la mention textuelle porte
 * l'information. Un état signalé par la seule couleur ou la seule forme
 * n'existe pas pour qui ne les distingue pas.
 */
export type StatusTone = "done" | "pending" | "muted";

const TONES: Record<StatusTone, string> = {
  done: "border-primary/30 bg-primary/10 text-primary",
  pending: "border-border bg-muted text-muted-foreground",
  muted: "border-border bg-transparent text-muted-foreground",
};

type StatusBadgeProps = {
  tone: StatusTone;
  /** Toujours rendu : c'est lui qui porte l'information. */
  label: string;
  /** Décoratif, masqué aux technologies d'assistance. */
  icon?: ReactNode;
  className?: string;
};

export const StatusBadge = ({
  tone,
  label,
  icon,
  className,
}: StatusBadgeProps) => (
  <span
    className={cn(
      "inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
      TONES[tone],
      className
    )}
  >
    {icon ? (
      <span aria-hidden="true" className="[&>svg]:h-3.5 [&>svg]:w-3.5">
        {icon}
      </span>
    ) : null}
    {label}
  </span>
);

export default StatusBadge;
