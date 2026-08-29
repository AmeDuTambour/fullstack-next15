import { Loader2 } from "lucide-react";

import { feedback as t } from "@/lib/labels";

/**
 * Attente de navigation.
 *
 * ⚠️ À ne poser que sur des routes qui ne peuvent pas répondre « introuvable ».
 * Une frontière de chargement fait partir la réponse immédiatement : les
 * en-têtes sont déjà envoyés quand `notFound()` s'exécute, et la page rend
 * alors « page introuvable » avec un code 200. Un moteur de recherche indexe
 * un produit qui n'existe pas.
 *
  * Placée à la racine, elle transformait les 404 de `/product/[slug]`,
 * `/blog/[slug]` et `/legal/[slug]` en faux 404. Une frontière couvre tout son
 * sous-arbre : la poser sur `/blog` aurait suffi à recasser `/blog/[slug]`.
 *
 * Elle ne subsiste donc que sur `/search`, qui n'a pas de route imbriquée, et
 * sur `/admin` et `/user`, qui ne sont pas indexés.
 */
const RouteLoading = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[50vh] items-center justify-center"
  >
    <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
    <span className="sr-only">{t.loading}</span>
  </div>
);

export default RouteLoading;
