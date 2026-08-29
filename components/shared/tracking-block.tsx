import { ExternalLink, Truck } from "lucide-react";

import { getCarrier, getTrackingUrl } from "@/lib/carriers";
import { order as t } from "@/lib/labels";

/**
 * Suivi du colis, côté acheteur.
 *
 * Ne rend rien tant qu'il n'y a pas de numéro : une zone de suivi vide fait
 * croire à une information manquante, alors qu'il n'y en a simplement pas
 * encore. Le numéro est toujours affiché en entier et sélectionnable — c'est
 * lui que l'acheteur recopiera si le lien ne marche pas.
 */
const TrackingBlock = ({
  carrier,
  trackingNumber,
}: {
  carrier?: string | null;
  trackingNumber?: string | null;
}) => {
  if (!trackingNumber) return null;

  const carrierInfo = getCarrier(carrier);
  const url = getTrackingUrl(carrier, trackingNumber);

  return (
    <div className="space-y-2 rounded-md border p-3">
      <p className="flex items-center gap-2 font-medium">
        <Truck className="h-4 w-4" aria-hidden="true" />
        {t.trackingTitle}
      </p>
      <p className="text-sm text-muted-foreground">
        {carrierInfo?.label ?? t.carrier}
      </p>
      <p className="select-all break-all font-mono text-sm">
        {trackingNumber}
      </p>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm underline hover:text-primary"
        >
          {t.followParcel}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
};

export default TrackingBlock;
