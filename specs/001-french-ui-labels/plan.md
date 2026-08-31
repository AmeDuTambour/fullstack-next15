# Implementation Plan: Interface entièrement en français

**Branch**: `refacto/foundation` | **Date**: 2026-08-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-french-ui-labels/spec.md`

## Summary

Traduire l'intégralité du texte visible — page de commande, espace d'administration, espace
compte, écrans d'authentification et messages de validation — et centraliser les libellés dans
un module typé, de sorte que l'anglais ne puisse plus revenir par inadvertance.

L'approche retenue tient en trois décisions, détaillées dans [research.md](./research.md) :
un module TypeScript ordinaire plutôt qu'une bibliothèque d'internationalisation ; une table de
correspondance d'erreurs avec repli générique, remplaçant le retour du message brut ; et
l'activation d'une règle de linting déjà disponible qui interdit les chaînes littérales dans le
balisage, ce qui transforme la détection exigée par SC-004 en prévention.

## Technical Context

**Language/Version**: TypeScript 5, React 19

**Primary Dependencies**: Next.js 15.5 (App Router), Tailwind 3, shadcn/ui, Zod. **Aucune
dépendance nouvelle n'est introduite par ce travail.**

**Storage**: PostgreSQL via Prisma. Aucune migration : les libellés vivent dans le code.

**Testing**: Jest. Contrat de l'API mobile par HTTP, tests unitaires sur les fonctions de
calcul et de mise en forme.

**Target Platform**: Navigateurs web, mobile et bureau

**Project Type**: Application web monolithique avec une API consommée par un client mobile
externe

**Performance Goals**: Sans objet. La résolution des libellés est statique, à la compilation.

**Constraints**: `next build` doit continuer de passer sans fichier d'environnement ni base
joignable. Le contrat de l'API mobile ne doit pas bouger.

**Scale/Scope**: ~190 littéraux visibles répartis sur quatre surfaces, plus 35 messages de
validation. 111 fichiers de composants au total, dont une minorité concernée.

## Constitution Check

*GATE : à passer avant la Phase 0, à revérifier après la Phase 1.*

| Article | Applicable | Évaluation |
|---|---|---|
| **I — Contrat de l'API mobile gelé** | Oui | Le travail ne touche à aucune route d'API. Les messages de ces routes sont destinés à un client logiciel, pas à un humain : ils **restent en anglais** et sont figés par les tests de contrat. À surveiller : `formatError` est partagé — sa refonte ne doit pas modifier les réponses de l'API. Les 23 tests de contrat sont le garde-fou. |
| **II — Chaque server action se garde elle-même** | Neutre | Aucune garde n'est ajoutée ni retirée. Les messages produits par les gardes existantes sont traduits. |
| **III — Build sans secret ni base** | Oui | Les libellés étant statiques, ils ne créent aucune dépendance nouvelle au moment du build. Vérifié par le contrôle habituel. |
| **IV — Une correction s'accompagne du test qui l'aurait attrapée** | Oui | Satisfait par la règle de linting plutôt que par un test unitaire : c'est elle qui aurait attrapé chaque littéral anglais, et qui les attrapera à l'avenir. Le contrôle de la section 7 du guide de validation le prouve. |
| **V — Interface en français, code en anglais** | Oui | C'est l'objet même du travail. Il rend l'article applicable là où il ne l'était pas. Les clés de libellés restent en anglais, conformément à l'article. |

**Verdict initial** : aucun conflit. Un point de vigilance, la nature partagée de la fonction
de mise en forme des erreurs entre le web et l'API mobile.

**Re-vérification après conception** : la conception confirme le point de vigilance et le
traite. La correspondance d'erreurs distingue les messages destinés à un humain de ceux
destinés à un client logiciel ; seuls les premiers sont traduits. Aucun autre article n'est
mis en tension.

## Project Structure

### Documentation (this feature)

```text
specs/001-french-ui-labels/
├── spec.md              # Spécification
├── plan.md              # Ce fichier
├── research.md          # Phase 0 — les trois décisions et leurs alternatives
├── data-model.md        # Phase 1 — modèle des libellés
├── quickstart.md        # Phase 1 — guide de validation
├── contracts/
│   └── labels.md        # Phase 1 — contrat d'usage du référentiel
└── checklists/
    └── requirements.md  # Validation qualité de la spécification
```

### Source Code (repository root)

Les zones touchées, dans l'ordre de dépendance :

```text
lib/
├── labels/              # NOUVEAU — le référentiel, découpé par surface
├── validators.ts        # 35 messages de validation à traduire
├── utils.ts             # Mise en forme des erreurs : table de correspondance + repli
└── constants/           # Les libellés de moyens de paiement rejoignent le référentiel

app/
├── layout.tsx           # Déclaration de langue du document
├── (auth)/              # ~10 littéraux, contamination intra-composant
├── (root)/order/[id]/   # ~22 littéraux — la surface prioritaire
├── (root)/search/       # Titre de document construit en anglais
├── user/                # ~17 littéraux
└── admin/               # ~140 littéraux, cinq sections et deux éditeurs

eslint.config.mjs        # Interdiction des littéraux, appliquée par répertoire
```

**Structure Decision** : le référentiel est découpé par surface plutôt que par type de
composant, pour qu'un développeur cherchant le libellé d'un écran sache où regarder sans
parcourir un fichier unique. Le découpage suit la navigation réelle, décrit dans
[data-model.md](./data-model.md).

## Ordre de mise en œuvre

L'ordre découle des dépendances, pas de la facilité :

1. **Le référentiel et la déclaration de langue.** Rien d'autre n'est possible avant.
2. **Les messages de validation.** Le vecteur le plus visible, et le seul qui touche la
   vitrine que la spécification croyait déjà francophone.
3. **La correspondance d'erreurs.** Dépend du référentiel. À faire avant les surfaces, dont
   plusieurs affichent ces messages.
4. **La page de commande.** La surface qui a motivé le classement P0.
5. **Les écrans d'authentification, puis l'espace compte.** Petits volumes, effet immédiat.
6. **L'espace d'administration.** Le plus gros volume, le moins urgent : un seul utilisateur,
   qui a appris à s'en accommoder.
7. **Les titres de document.**
8. **La règle de linting, activée par répertoire au fur et à mesure.** Activer avant de
   traduire produirait des centaines d'erreurs sans valeur.

## Risques

| Risque | Traitement |
|---|---|
| La refonte de la mise en forme des erreurs modifie les réponses de l'API mobile | Les 23 tests de contrat sont exécutés à chaque étape. La correspondance distingue les messages destinés à un humain de ceux destinés à un client logiciel. |
| L'interdiction des littéraux se révèle trop bruyante | Application par répertoire, étendue au rythme des traductions. Elle n'est jamais activée sur du code non encore traduit. |
| Le vocabulaire d'administration traduit littéralement reste inadapté à un artisan seul | Hors périmètre, signalé dans la recherche. Traduire d'abord, repenser ensuite si le propriétaire le souhaite. |
| Des littéraux passent entre les mailles — propriétés, concaténations | Réserve explicite dans la recherche. La règle relève le plancher, la relecture couvre le reste. |

## Complexity Tracking

Aucune dérogation à la constitution n'est demandée. Le travail retire de la complexité — une
dépendance de moins que l'alternative envisagée, une fonction de mise en forme d'erreurs plus
simple, et une règle qui rend une classe entière de défauts impossible.
