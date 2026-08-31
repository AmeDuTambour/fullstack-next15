import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * État vide, présenté de la même façon partout.
 *
 * Trois rédactions différentes coexistaient, dont deux sur la même page : la
 * boutique disait « Aucun produit trouvé » en haut et « Aucun produit » plus
 * bas, pour la même situation. Un état vide sans issue est aussi une impasse :
 * l'action est donc partie intégrante du composant.
 */
type EmptyStateProps = {
  /** Ce qui n'a rien donné, formulé du point de vue du visiteur. */
  message: string;
  /** L'issue proposée. Un état vide sans action laisse le visiteur bloqué. */
  action?: { label: string; href: string };
};

const EmptyState = ({ message, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-10 text-center">
      <p className="text-muted-foreground">{message}</p>
      {action ? (
        <Button asChild variant="outline">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      ) : null}
    </div>
  );
};

export default EmptyState;
