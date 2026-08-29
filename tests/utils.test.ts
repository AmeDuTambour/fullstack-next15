import {
  round2,
  formatNumberWithDecimal,
  formatText,
  formatCurrency,
} from "@/lib/utils";

/**
 * `round2` sert au calcul des totaux de panier et de commande. Son
 * parenthésage était faux et arrondissait à l'entier : un panier à 149,90 €
 * était facturé 150 €. Ces tests verrouillent le comportement attendu.
 */
describe("round2", () => {
  it("conserve les centimes", () => {
    expect(round2(149.9)).toBe(149.9);
    expect(round2(10.994)).toBe(10.99);
    expect(round2(0.01)).toBe(0.01);
  });

  it("arrondit à deux décimales, pas à l'entier", () => {
    expect(round2(149.999)).toBe(150);
    expect(round2(1.005)).toBe(1.01);
    expect(round2(2.675)).toBe(2.68);
  });

  it("accepte une chaîne", () => {
    expect(round2("149.90")).toBe(149.9);
    expect(round2("0")).toBe(0);
  });

  it("laisse les entiers intacts", () => {
    expect(round2(10)).toBe(10);
    expect(round2(0)).toBe(0);
  });

  it("gère les négatifs", () => {
    expect(round2(-3.456)).toBe(-3.46);
  });

  it("refuse une valeur non numérique plutôt que de renvoyer NaN", () => {
    expect(() => round2("abc")).toThrow();
  });

  it("additionne un panier réaliste sans perdre de centime", () => {
    const lignes = [39.9, 129.95, 12.5];
    const sousTotal = round2(lignes.reduce((a, b) => a + b, 0));

    expect(sousTotal).toBe(182.35);
    expect(round2(sousTotal + 10)).toBe(192.35);
  });
});

describe("formatNumberWithDecimal", () => {
  it("complète toujours deux décimales", () => {
    expect(formatNumberWithDecimal(10)).toBe("10.00");
    expect(formatNumberWithDecimal(10.5)).toBe("10.50");
    expect(formatNumberWithDecimal(10.55)).toBe("10.55");
  });
});

/**
 * `formatText` s'appuyait sur DOMPurify, indisponible en rendu serveur : chaque
 * section d'article levait « sanitize is not a function ». Le corps venant d'un
 * `<textarea>`, il est désormais échappé plutôt qu'assaini.
 */
describe("formatText", () => {
  it("échappe le HTML au lieu de l'exécuter", () => {
    expect(formatText('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
    expect(formatText("<img onerror=alert(1)>")).not.toContain("<img");
  });

  it("transforme les retours à la ligne en <br />", () => {
    expect(formatText("une ligne\nune autre")).toBe("une ligne<br />une autre");
  });

  it("rend les URL cliquables", () => {
    const out = formatText("voir https://lamedutambour.com pour la suite");
    expect(out).toContain('href="https://lamedutambour.com"');
    expect(out).toContain('rel="noopener noreferrer"');
  });

  it("n'invente pas de lien à partir d'un faux protocole", () => {
    expect(formatText("javascript:alert(1)")).not.toContain("<a ");
  });

  it("fonctionne sans DOM", () => {
    expect(() => formatText("texte simple")).not.toThrow();
    expect(formatText("texte simple")).toBe("texte simple");
  });
});

/**
 * Quatre formats de prix coexistaient, dont trois non conformes au français.
 * Le composant supprimé rendait « € 130 . 00 » : symbole avant, point décimal,
 * décimales détachées — trois écarts dans un seul affichage.
 */
describe("formatCurrency", () => {
  it("place le symbole après le montant", () => {
    expect(formatCurrency(130)).toMatch(/€$/);
  });

  it("utilise la virgule comme séparateur décimal", () => {
    expect(formatCurrency(130.5)).toContain(",");
    expect(formatCurrency(130.5)).not.toContain(".");
  });

  it("affiche toujours deux décimales", () => {
    expect(formatCurrency(130)).toMatch(/130,00/);
    expect(formatCurrency(9.9)).toMatch(/9,90/);
  });

  it("accepte une chaîne comme un nombre", () => {
    expect(formatCurrency("290")).toBe(formatCurrency(290));
  });

  it("rend le même résultat pour une même valeur, quel que soit l'appelant", () => {
    const asNumber = formatCurrency(123.45);
    const asString = formatCurrency("123.45");
    expect(asNumber).toBe(asString);
  });
});
