import { execFileSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");

/**
 * Un seul thème, une seule palette.
 *
 * Ces deux règles se dégradent silencieusement : une classe `bg-gray-100`
 * copiée d'un exemple, une variante `dark:` héritée d'un composant trouvé en
 * ligne. Rien ne casse — le site devient simplement un peu moins cohérent à
 * chaque fois, jusqu'à ce que plus personne ne sache quelle est la couleur
 * juste.
 *
 * Les primitives de `components/ui/` sont exclues : elles sont recopiées telles
 * quelles depuis shadcn et le voile noir d'une fenêtre modale n'est pas une
 * décision de palette.
 */
function grep(pattern: string): string[] {
  try {
    const out = execFileSync(
      "grep",
      ["-rnoE", pattern, "app", "components", "--include=*.tsx"],
      { cwd: ROOT, encoding: "utf8" }
    );
    return out
      .split("\n")
      .filter(Boolean)
      .filter((line) => !line.startsWith("components/ui/"));
  } catch {
    // grep sort en 1 quand il ne trouve rien.
    return [];
  }
}

describe("thème", () => {
  it("n'utilise aucune couleur littérale de Tailwind", () => {
    const offenders = grep(
      "\\b(bg|text|border|from|to|via|ring|fill|stroke)-(gray|slate|zinc|neutral|stone|white|black|red|green|blue|yellow|amber|orange|indigo|violet|pink|teal|cyan|lime|emerald|rose|sky|fuchsia|purple)(-[0-9]{2,3})?\\b"
    );
    expect(offenders).toEqual([]);
  });

  it("ne contient plus aucune variante de mode sombre", () => {
    expect(grep("\\bdark:")).toEqual([]);
  });
});
