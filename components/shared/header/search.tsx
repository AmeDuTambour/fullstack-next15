"use client";

import { Search as SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { catalog as t } from "@/lib/labels";

/**
 * Recherche par texte de la vitrine.
 *
 * Elle existait mais était commentée dans l'en-tête : la boutique n'offrait que
 * des filtres par liens, sans aucun moyen de chercher un instrument par son nom.
 */
const Search = () => {
  const params = useSearchParams();

  return (
    <form action="/search" role="search" className="relative w-full max-w-xs">
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        name="query"
        defaultValue={params.get("query") ?? ""}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchLabel}
        className="pl-9"
      />
    </form>
  );
};

export default Search;
