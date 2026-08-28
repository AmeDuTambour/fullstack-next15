import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

/**
 * Complément à `react/jsx-no-literals`, qui ne voit que le texte enfant du
 * balisage. Les attributs porteurs de texte visible — texte d'exemple, intitulé
 * accessible, texte alternatif — lui échappent.
 *
 * Ce contrôle les couvre sur les surfaces traduites, et achève de rendre
 * vérifiable le critère SC-004 de la spécification 001.
 */
const COVERED = [
  "app/(auth)",
  "app/user",
  "app/admin",
  "app/(root)/order",
  "components/admin",
];

const VISIBLE_TEXT_ATTRIBUTES = ["placeholder", "aria-label", "alt", "title"];

function filesUnder(dir: string): string[] {
  try {
    return execSync(`find "${dir}" -name "*.tsx" -type f`, { encoding: "utf8" })
      .split("\n")
      .filter(Boolean);
  } catch {
    return [];
  }
}

describe("aucun texte visible écrit en dur dans les surfaces traduites", () => {
  const files = COVERED.flatMap(filesUnder);

  it("couvre bien des fichiers", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it.each(VISIBLE_TEXT_ATTRIBUTES)(
    "aucun attribut %s ne porte une chaîne littérale",
    (attribute) => {
      const pattern = new RegExp(`${attribute}="[^"]+"`, "g");
      const offenders: string[] = [];

      for (const file of files) {
        const matches = readFileSync(file, "utf8").match(pattern);
        if (matches) offenders.push(`${file} → ${matches.join(", ")}`);
      }

      expect(offenders).toEqual([]);
    }
  );
});
