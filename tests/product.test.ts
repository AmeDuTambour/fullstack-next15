import {
  getProductNature,
  getAvailability,
  getMaxOrderableQuantity,
  allowsQuantitySelection,
} from "@/lib/product";

/**
 * Ces règles existent parce que trois écrans lisaient le stock par un simple
 * `stock > 0`, chacun de son côté : un tambour vendu et un accessoire épuisé
 * produisaient exactement le même rendu.
 */
describe("nature d'un produit", () => {
  it("un tambour est une pièce unique", () => {
    expect(getProductNature("Drum")).toBe("unique");
  });

  it("un accessoire est reproductible", () => {
    expect(getProductNature("Other")).toBe("reproducible");
  });

  it("une catégorie inconnue se replie sur reproductible", () => {
    expect(getProductNature("Stages")).toBe("reproducible");
    expect(getProductNature(null)).toBe("reproducible");
    expect(getProductNature(undefined)).toBe("reproducible");
  });

  it("ne déduit rien du stock : un accessoire à un exemplaire reste reproductible", () => {
    expect(getProductNature("Other")).toBe("reproducible");
  });
});

describe("disponibilité", () => {
  it("une pièce unique en stock est disponible", () => {
    expect(getAvailability("unique", 1)).toBe("available");
  });

  it("une pièce unique sans stock est vendue, pas épuisée", () => {
    expect(getAvailability("unique", 0)).toBe("sold");
  });

  it("un article reproductible sans stock est épuisé, pas vendu", () => {
    expect(getAvailability("reproducible", 0)).toBe("outOfStock");
  });

  it("un article reproductible en stock est disponible", () => {
    expect(getAvailability("reproducible", 12)).toBe("available");
  });
});

describe("quantité commandable", () => {
  it("plafonne une pièce unique à un exemplaire", () => {
    expect(getMaxOrderableQuantity("unique", 1)).toBe(1);
    expect(getMaxOrderableQuantity("unique", 5)).toBe(1);
  });

  it("rend zéro pour une pièce unique vendue", () => {
    expect(getMaxOrderableQuantity("unique", 0)).toBe(0);
  });

  it("suit le stock pour un article reproductible", () => {
    expect(getMaxOrderableQuantity("reproducible", 12)).toBe(12);
    expect(getMaxOrderableQuantity("reproducible", 0)).toBe(0);
  });

  it("ne rend jamais de quantité négative", () => {
    expect(getMaxOrderableQuantity("reproducible", -3)).toBe(0);
  });
});

describe("choix de quantité dans l'interface", () => {
  it("n'est jamais proposé pour une pièce unique", () => {
    expect(allowsQuantitySelection("unique")).toBe(false);
  });

  it("est proposé pour un article reproductible", () => {
    expect(allowsQuantitySelection("reproducible")).toBe(true);
  });
});
