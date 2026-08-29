import { Loader2 } from "lucide-react";

import { feedback as t } from "@/lib/labels";

/**
 * Attente de navigation.
 *
 * L'ancien écran occupait toute la fenêtre — `h-screen w-screen` — et chassait
 * donc l'en-tête et le pied de page à chaque transition : le site clignotait.
 * Il chargeait aussi une animation GIF de plusieurs dizaines de kilo-octets
 * pour dessiner un cercle qui tourne.
 */
const LoadingPage = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[50vh] items-center justify-center"
  >
    <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
    <span className="sr-only">{t.loading}</span>
  </div>
);

export default LoadingPage;
