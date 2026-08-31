/**
 * Transporteurs et construction du lien de suivi.
 *
 * Le lien est calculé à partir du transporteur et du numéro : rien n'est saisi
 * à la main, donc rien ne peut être mal collé. Un transporteur dont l'adresse
 * de suivi n'est pas exploitable affiche le numéro sans lien plutôt qu'un lien
 * mort — le numéro reste copiable, c'est ce qui compte.
 *
 * `pattern` sert à prévenir d'une incohérence évidente, pas à valider : un
 * numéro refusé par le transporteur reste un numéro que Julien a sous les yeux.
 */
export type Carrier = {
  /** Identifiant stocké en base, en anglais comme le reste des données. */
  id: string;
  label: string;
  /** Construit l'adresse de suivi, ou `null` si le transporteur n'en offre pas. */
  trackingUrl: ((trackingNumber: string) => string) | null;
  /** Forme attendue du numéro, pour avertir d'une saisie manifestement fausse. */
  pattern?: RegExp;
  patternHint?: string;
};

export const CARRIERS: Carrier[] = [
  {
    id: "laposte",
    label: "La Poste / Colissimo",
    trackingUrl: (n) =>
      `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(n)}`,
    pattern: /^[0-9A-Z]{11,15}$/i,
    patternHint: "11 à 15 caractères, lettres et chiffres",
  },
  {
    id: "mondialrelay",
    label: "Mondial Relay",
    trackingUrl: (n) =>
      `https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=${encodeURIComponent(n)}`,
    pattern: /^[0-9]{8,12}$/,
    patternHint: "8 à 12 chiffres",
  },
  {
    id: "chronopost",
    label: "Chronopost",
    trackingUrl: (n) =>
      `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${encodeURIComponent(n)}`,
    pattern: /^[0-9A-Z]{8,15}$/i,
    patternHint: "8 à 15 caractères",
  },
  {
    id: "dhl",
    label: "DHL",
    trackingUrl: (n) =>
      `https://www.dhl.com/fr-fr/home/tracking.html?tracking-id=${encodeURIComponent(n)}`,
  },
  {
    id: "ups",
    label: "UPS",
    trackingUrl: (n) =>
      `https://www.ups.com/track?loc=fr_FR&tracknum=${encodeURIComponent(n)}`,
  },
  {
    id: "other",
    label: "Autre transporteur",
    trackingUrl: null,
  },
];

export function getCarrier(id: string | null | undefined): Carrier | undefined {
  if (!id) return undefined;
  return CARRIERS.find((carrier) => carrier.id === id);
}

export function getTrackingUrl(
  carrierId: string | null | undefined,
  trackingNumber: string | null | undefined
): string | null {
  if (!trackingNumber) return null;
  const carrier = getCarrier(carrierId);
  if (!carrier?.trackingUrl) return null;
  return carrier.trackingUrl(trackingNumber);
}

/** `null` si le numéro est plausible, sinon la forme attendue. */
export function checkTrackingNumber(
  carrierId: string,
  trackingNumber: string
): string | null {
  const carrier = getCarrier(carrierId);
  if (!carrier?.pattern) return null;
  return carrier.pattern.test(trackingNumber.trim())
    ? null
    : (carrier.patternHint ?? null);
}
