import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  /**
   * Interdit le texte écrit en dur dans le balisage des surfaces traduites.
   *
   * L'objectif n'est pas de détecter l'anglais mais de le rendre impossible :
   * si aucun littéral ne peut apparaître dans le balisage, tout texte visible
   * vient forcément de `lib/labels/`, qui est français.
   *
   * Portée par répertoire, étendue au rythme des traductions. La règle ne voit
   * pas les chaînes passées en propriété ni construites par concaténation :
   * elle relève le plancher, elle ne scelle pas la pièce.
   */
  {
    files: [
      "app/(auth)/**/*.tsx",
      "app/user/**/*.tsx",
      "app/admin/**/*.tsx",
      "app/(root)/order/**/*.tsx",
      "components/admin/**/*.tsx",
    ],
    rules: {
      "react/jsx-no-literals": [
        "error",
        {
          noStrings: true,
          ignoreProps: true,
          allowedStrings: ["·", "—", "–", ":", "/", "€", "(", ")", "%"],
        },
      ],
    },
  },
];

export default eslintConfig;
