# Implementation Plan: Cohérence de l'interface et du parcours d'achat

**Branch**: `refacto/foundation` | **Date**: 2026-08-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-ui-consistency/spec.md`

## Summary

Donner au site un langage de composants unique, et rendre le tunnel d'achat lisible de bout en
bout. Six histoires, dont deux structurantes : le récapitulatif qui suit l'acheteur jusqu'au
paiement, et la distinction entre une pièce unique et un article reproductible — que le code
ne fait aujourd'hui nulle part, puisque les trois endroits interprétant le stock le font tous
par un simple `stock > 0`.

Les décisions techniques sont dans [research.md](./research.md). La plus structurante : la
nature d'un produit découle de sa **catégorie**, résolue en un seul endroit, jamais déduite du
stock au point d'affichage.

## Technical Context

**Language/Version**: TypeScript 5, React 19

**Primary Dependencies**: Next.js 15.5, Tailwind 3, shadcn/ui, embla. **Aucune dépendance
nouvelle.**

**Storage**: PostgreSQL via Prisma. Aucune migration : `stock` et `blockedQuantity` restent
inchangés, c'est leur interprétation qui devient explicite.

**Testing**: Jest. Contrat de l'API mobile par HTTP, contrôles anti-régression sur les
libellés.

**Target Platform**: Navigateurs, de 320 à 1920 pixels de large.

**Project Type**: Application web monolithique avec une API consommée par un client mobile
externe.

**Performance Goals**: Sans objet ici — traité par la spécification 005.

**Constraints**: Le contrat de l'API mobile ne bouge pas. Aucune couleur n'est modifiée : la
palette relève de la spécification 004, qui s'exécute après.

**Scale/Scope**: 6 traitements de titre sur 22 usages, 10 fichiers affichant un prix en 4
formats, 3 grilles de produits, 3 points d'interprétation du stock, 4 écrans de tunnel.

## Constitution Check

*GATE : à passer avant la Phase 0, à revérifier après la Phase 1.*

| Article | Applicable | Évaluation |
|---|---|---|
| **I — Contrat de l'API mobile gelé** | Oui | Le mobile reçoit `stock` sans notion de nature ; la distinction est purement d'affichage. Rien dans `app/api/` ne change. Les 23 tests de contrat restent le garde-fou. |
| **II — Server actions gardées** | Neutre | Aucune garde ajoutée ni retirée. La contrainte « une pièce unique ne peut pas dépasser un exemplaire » relève de la validation, pas de l'autorisation. |
| **III — Build sans secret ni base** | Oui | Les composants introduits sont statiques ou lisent le panier côté serveur ; les pages concernées sont déjà dynamiques. |
| **IV — Une correction s'accompagne du test qui l'aurait attrapée** | Oui | Point de vigilance : plusieurs exigences sont visuelles et ne se testent pas unitairement. Trois se testent : le format de prix, la nature de produit, et l'absence de débordement horizontal. Les autres passent par le guide de validation. |
| **V — Interface en français, tokens de thème** | Oui | Tout nouveau libellé passe par `lib/labels/`, et les contrôles de la spécification 001 le vérifient. Aucune couleur en dur n'est introduite. |

**Verdict initial** : aucun conflit. Un point de vigilance sur l'article IV, traité en Phase 1
en isolant ce qui est testable de ce qui relève de la relecture.

**Re-vérification après conception** : la conception isole trois fonctions pures — format de
prix, nature de produit, disponibilité — qui portent l'essentiel des règles et se testent sans
navigateur. Le reste est de la disposition, couvert par le guide de validation.

## Project Structure

### Documentation (this feature)

```text
specs/002-ui-consistency/
├── spec.md · plan.md · research.md · data-model.md
├── contracts/ui-primitives.md
├── checklists/requirements.md
└── tasks.md              # généré par /speckit-tasks
```

### Source Code (repository root)

```text
lib/
├── product.ts            # NOUVEAU — nature et disponibilité, résolues une fois
├── labels/               # libellés des nouveaux composants
└── constants/            # délai d'expédition

components/shared/
├── order-summary.tsx     # NOUVEAU — récapitulatif des 4 écrans du tunnel
├── status-badge.tsx      # NOUVEAU — indicateur d'état unique
├── checkout-steps.tsx    # 3 états, étapes franchies atteignables
└── product/
    ├── product-price.tsx # SUPPRIMÉ — remplacé par le formatage monétaire
    └── product-card.tsx  # nature, survol, grille

components/ui/carousel.tsx  # commandes ramenées dans le cadre

app/(root)/
├── cart/ · shipping-address/ · payment-method/ · place-order/   # récapitulatif
├── product/[slug]/       # titre, nature, prix
├── search/               # affordance des filtres, recherche texte
├── blog/                 # grille au lieu des carrousels
└── layout.tsx            # min-h-screen

assets/styles/globals.css # rôles typographiques
```

**Structure Decision** : `lib/product.ts` isole les règles métier d'affichage — nature,
disponibilité — hors des composants. C'est ce qui empêche le prochain écran de réinventer la
règle, comme les trois `stock > 0` actuels l'ont fait.

## Ordre de mise en œuvre

1. **Les fondations testables** : nature et disponibilité, format de prix, rôles
   typographiques. Tout le reste s'y appuie.
2. **US2 — la pièce unique.** Dépend de la nature. Touche la fiche produit, la carte, le panier.
3. **US3 — le langage de composants.** Titres, prix, indicateur d'état, grilles.
4. **US1 — le récapitulatif du tunnel.** Dépend du format de prix et du délai d'expédition.
5. **US4 — les étapes.** Dépend du tunnel.
6. **US5 — le blog.** Indépendant, peut avancer en parallèle.
7. **US6 — les filtres et la recherche.** Indépendant.
8. **Le débordement horizontal**, vérifié en dernier sur l'ensemble.

## Risques

| Risque | Traitement |
|---|---|
| Supprimer le composant de prix casse un écran non repéré | Les 10 fichiers sont inventoriés ; la vérification de types signale tout appel restant. |
| La nature par catégorie casse si une catégorie est renommée | Résolution centralisée, repli sur « reproductible » — le comportement le moins destructeur. Consigné dans la liste de contrôle. |
| Le récapitulatif alourdit des écrans déjà dynamiques | Il lit le panier, déjà chargé par les quatre écrans. Aucune requête supplémentaire. |
| Les corrections de disposition entrent en conflit avec la spécification 004 | Ce travail ne touche à aucune couleur. L'ordre 002 puis 004 est documenté dans les deux. |

## Complexity Tracking

Aucune dérogation. Le travail retire du code : un composant de prix supprimé, six traitements
de titre ramenés à deux, trois interprétations du stock ramenées à une.
