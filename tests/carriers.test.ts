import {
  CARRIERS,
  checkTrackingNumber,
  getCarrier,
  getTrackingUrl,
} from "@/lib/carriers";

describe("suivi de colis", () => {
  it("construit le lien de suivi à partir du transporteur et du numéro", () => {
    const url = getTrackingUrl("laposte", "6A123456789FR");
    expect(url).toContain("laposte.fr");
    expect(url).toContain("6A123456789FR");
  });

  it("échappe le numéro placé dans l'adresse", () => {
    expect(getTrackingUrl("laposte", "a b&c")).toContain("a%20b%26c");
  });

  it("n'offre aucun lien pour un transporteur qui n'en a pas", () => {
    expect(getTrackingUrl("other", "123456789")).toBeNull();
  });

  it("n'offre aucun lien sans numéro", () => {
    expect(getTrackingUrl("laposte", null)).toBeNull();
    expect(getTrackingUrl("laposte", "")).toBeNull();
  });

  it("n'offre aucun lien pour un transporteur inconnu", () => {
    expect(getTrackingUrl("inventé", "123456789")).toBeNull();
  });

  it("signale un numéro manifestement incompatible", () => {
    expect(checkTrackingNumber("mondialrelay", "6A12FR")).not.toBeNull();
    expect(checkTrackingNumber("mondialrelay", "12345678")).toBeNull();
  });

  it("ne signale rien pour un transporteur sans forme attendue", () => {
    expect(checkTrackingNumber("dhl", "n'importe quoi")).toBeNull();
  });

  it("expose un identifiant unique par transporteur", () => {
    const ids = CARRIERS.map((carrier) => carrier.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("retrouve un transporteur par son identifiant", () => {
    expect(getCarrier("ups")?.label).toBe("UPS");
    expect(getCarrier(null)).toBeUndefined();
  });
});
