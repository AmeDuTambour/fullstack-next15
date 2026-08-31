import { Skeleton } from "@/components/ui/skeleton";

/**
 * Ossatures d'attente, dessinées à la forme de ce qui arrive.
 *
 * Un tourniquet dit « ça charge » ; une ossature dit « voilà ce qui vient, et
 * où ». Elle occupe la place exacte du contenu, donc rien ne saute au moment
 * de la substitution.
 *
 * Elles vivent ici, et pas dans chaque `loading.tsx`, pour que la grille de
 * l'attente et celle du contenu ne divergent pas : ce sont les mêmes classes.
 */

/** Une carte produit : visuel carré, nom, prix. */
export const ProductCardSkeleton = () => (
  <div className="rounded-lg border bg-card p-4">
    <Skeleton className="aspect-square w-full rounded-md" />
    <div className="mt-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  </div>
);

/** La grille de la boutique et de l'accueil — mêmes colonnes qu'elles. */
export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: count }, (_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

/** La boutique : ses filtres à gauche, sa grille à droite. */
export const ShopSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-9 w-48" />
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="hidden space-y-6 md:block">
        {Array.from({ length: 3 }, (_, group) => (
          <div key={group} className="space-y-2">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 3 }, (_, item) => (
              <Skeleton key={item} className="h-7 w-24 rounded-full" />
            ))}
          </div>
        ))}
      </div>
      <div className="space-y-4 md:col-span-4">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-48" />
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  </div>
);

/** Une liste d'administration : titre, action, tableau. */
export const AdminListSkeleton = ({ rows = 8 }: { rows?: number }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-9 w-36" />
    </div>
    <div className="rounded-md border">
      <Skeleton className="h-11 w-full rounded-none rounded-t-md" />
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="border-t p-3">
          <Skeleton className="h-5 w-full" />
        </div>
      ))}
    </div>
  </div>
);

/** La grille du journal : visuel large, catégorie, titre, date. */
export const ArticleGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }, (_, index) => (
      <li key={index} className="space-y-3">
        <Skeleton className="aspect-[3/2] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-4 w-24" />
        </div>
      </li>
    ))}
  </ul>
);
