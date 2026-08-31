import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import Pagination from "@/components/shared/pagination";
import EmptyState from "@/components/shared/empty-state";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { admin as t } from "@/lib/labels";

/**
 * Ossature des écrans de liste d'administration.
 *
 * Les trois écrans — produits, commandes, utilisateurs — répétaient la même
 * structure : titre, bandeau de filtre actif avec son bouton de retrait,
 * tableau, pagination conditionnelle.
 *
 * Le prochain écran de liste hérite de tout cela sans le réécrire. C'est
 * exactement ce qui manquait à la liste des articles, qui n'a ni pagination, ni
 * recherche, ni suppression — non par choix, mais parce qu'il aurait fallu les
 * recopier une quatrième fois.
 */
type AdminListProps = {
  title: string;
  /** Chemin de l'écran, pour le retrait du filtre actif. */
  basePath: string;
  /** Recherche en cours, le cas échéant. */
  query?: string;
  /** Action principale, à droite du titre. */
  action?: ReactNode;
  headers: string[];
  page: number;
  totalPages: number;
  /** Message affiché quand la liste est vide. */
  emptyMessage: string;
  /** Les lignes, rendues par l'appelant : lui seul connaît ses colonnes. */
  children: ReactNode;
  isEmpty: boolean;
};

export const AdminList = ({
  title,
  basePath,
  query,
  action,
  headers,
  page,
  totalPages,
  emptyMessage,
  children,
  isEmpty,
}: AdminListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="page-title">{title}</h1>
          {query ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {t.filteredBy(query)}
              <Button asChild variant="outline" size="sm">
                <Link href={basePath}>{t.clearFilter}</Link>
              </Button>
            </div>
          ) : null}
        </div>
        {action}
      </div>

      {isEmpty ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>{children}</TableBody>
            </Table>
          </div>

          {totalPages > 1 ? (
            <div className="flex justify-end">
              <Pagination page={page} totalPages={totalPages} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default AdminList;
