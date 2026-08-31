import { cn } from "@/lib/utils";

/**
 * Ossature d'attente.
 *
 * Elle occupe exactement la place de ce qui arrive, et rend l'attente muette :
 * pas de texte à traduire, pas de tourniquet qui informe seulement que « ça
 * charge ». La page ne bouge pas quand le contenu se substitue à elle.
 *
 * `aria-hidden` est délibéré : le lecteur d'écran n'a rien à annoncer d'une
 * forme grise. C'est à la région qui la contient de porter `aria-busy`.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
export default Skeleton;
