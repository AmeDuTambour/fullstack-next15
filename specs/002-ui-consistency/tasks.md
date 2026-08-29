---
description: "Task list for spec 002 — Cohérence de l'interface et du parcours d'achat"
---

# Tasks: Cohérence de l'interface et du parcours d'achat

**Input**: Design documents from `specs/002-ui-consistency/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/ui-primitives.md](./contracts/ui-primitives.md)

**Tests**: Trois règles sont isolées en fonctions pures et testées — format de prix, nature de
produit, disponibilité. Le reste est visuel et passe par [quickstart.md](./quickstart.md).
C'est la résolution de la tension avec l'article IV de la constitution, documentée dans le plan.

**Organization**: Groupées par histoire utilisateur. L'ordre suit les dépendances, pas les
priorités : US2 et US3 précèdent US1, qui s'appuie sur elles.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1 : Fondations testables (bloquant)

**⚠️ Tout le reste s'y appuie.**

- [X] T001 Créer `lib/product.ts` exposant la nature d'un produit — pièce unique ou article reproductible — résolue depuis le nom de sa catégorie, avec repli sur « reproductible » pour toute catégorie inconnue
- [X] T002 Ajouter à `lib/product.ts` la disponibilité dérivée de la nature et du stock : disponible, vendu, épuisé
- [X] T003 [P] Écrire `tests/product.test.ts` couvrant les quatre combinaisons de nature et de stock, plus le repli sur catégorie inconnue
- [X] T004 [P] Ajouter les rôles typographiques `.page-title` et `.section-title` dans `assets/styles/globals.css`
- [X] T005 [P] Ajouter à `lib/constants/index.ts` le délai d'expédition, lu depuis l'environnement, avec « 2 à 4 jours ouvrés » en défaut et un commentaire signalant que la valeur n'est pas vérifiée
- [X] T006 [P] Ajouter les libellés de ce travail dans `lib/labels/` — disponibilité, récapitulatif, étapes, états vides
- [X] T007 Étendre `tests/utils.test.ts` pour verrouiller le format monétaire français : virgule décimale, symbole après le montant

---

## Phase 2 : US2 — Le tambour se présente comme la pièce unique qu'il est (P1)

**Test indépendant** : consulter un tambour disponible, un tambour vendu, un accessoire
disponible et un accessoire épuisé. Les quatre se distinguent sans explication.

- [X] T008 [US2] Remplacer les trois `stock > 0` par la disponibilité de `lib/product.ts` dans `app/(root)/product/[slug]/page.tsx` et `components/shared/product/product-card.tsx`
- [X] T009 [US2] Signaler le caractère unique sur la fiche produit d'un tambour, et formuler l'indisponibilité comme une vente définitive plutôt qu'une rupture
- [X] T010 [US2] Retirer la commande de quantité pour une pièce unique dans `components/shared/product/add-to-cart.tsx` et `app/(root)/cart/cart-table.tsx`, en la conservant pour un article reproductible
- [X] T011 [US2] Proposer une continuation vers les pièces disponibles sur la fiche d'un tambour vendu
- [X] T012 [US2] Interdire un stock supérieur à 1 sur une pièce unique dans `lib/validators.ts`, y compris à la saisie depuis l'administration

---

## Phase 3 : US3 — Le site donne l'impression d'avoir été fait par une seule main (P1)

**Test indépendant** : relever le titre principal, le prix et l'état sur toutes les pages ; un
même rôle reçoit partout le même traitement.

- [X] T013 [US3] Appliquer `.page-title` aux titres principaux existants et en ajouter un aux six pages qui n'en ont pas — `/`, `/search`, `/blog`, `/about`, `/user/orders`, `/user/profile`
- [X] T014 [US3] Corriger le titre de `app/(root)/product/[slug]/page.tsx`, aujourd'hui plus petit qu'un titre de section
- [X] T015 [US3] Supprimer `components/shared/product/product-price.tsx` et router les dix fichiers affichant un prix par le formatage monétaire
- [ ] T016 [US3] Créer `components/shared/status-badge.tsx` — présentation unique, mention textuelle toujours présente
- [ ] T017 [US3] Appliquer l'indicateur d'état aux six écrans concernés, dont `app/admin/products/page.tsx` où l'état publié n'est aujourd'hui qu'une icône sans légende
- [X] T018 [P] [US3] Aligner les trois grilles de produits sur une configuration unique
- [X] T019 [P] [US3] Harmoniser les états vides, dont les deux formulations différentes de `app/(root)/search/page.tsx`
- [X] T020 [P] [US3] Ajouter un état de survol aux cartes produit, absent alors que les cartes d'articles en ont un
- [X] T021 [US3] Remplacer `h-screen` par `min-h-screen` dans `app/(root)/layout.tsx`

---

## Phase 4 : US1 — Marie garde son tambour sous les yeux jusqu'au paiement (P1)

**Test indépendant** : dérouler le tunnel ; le récapitulatif et le montant restent visibles à
chaque étape.

- [ ] T022 [US1] Créer `components/shared/order-summary.tsx`, composant serveur résolvant lui-même le panier — articles, sous-total, frais de livraison, total, délai d'expédition
- [ ] T023 [US1] Insérer le récapitulatif dans `app/(root)/cart/page.tsx`, `shipping-address/page.tsx`, `payment-method/page.tsx` et `place-order/page.tsx`
- [ ] T024 [US1] Annoncer les frais de livraison dès le panier, avant toute saisie de données personnelles
- [ ] T025 [US1] Afficher le délai d'expédition sur la fiche produit et dans le récapitulatif
- [ ] T026 [US1] Unifier la fin de parcours : une seule page de remerciement pour les trois moyens de paiement, avec un message adapté à chacun
- [ ] T027 [US1] Regrouper code postal et ville sur une ligne dans `app/(root)/shipping-address/shipping-address-form.tsx`, et remplacer le champ pays libre par une liste

---

## Phase 5 : US4 — L'acheteur sait toujours où il en est (P2)

- [ ] T028 [US4] Distinguer les trois états dans `components/shared/checkout-steps.tsx` : franchie, courante, à venir
- [ ] T029 [US4] Rendre les étapes franchies atteignables depuis la barre
- [ ] T030 [US4] Corriger le séparateur orphelin après la dernière étape — la comparaison de chaînes traduite est toujours vraie

---

## Phase 6 : US5 — Thomas lit un article jusqu'au bout (P2)

- [ ] T031 [US5] Remplacer la file de carrousels de `app/(root)/blog/page.tsx` par une grille de cartes portant visuel, catégorie et date
- [ ] T032 [US5] Afficher la bannière de l'article dans `app/(root)/blog/[slug]/page.tsx`, aujourd'hui promise par l'accueil et jamais rendue
- [ ] T033 [US5] Retirer l'italique et la justification intégrales du corps d'article et limiter la mesure de lecture, dans `app/(root)/blog/[slug]/article-section-block.tsx`
- [ ] T034 [US5] Proposer une continuation en fin d'article — retour au blog et lien vers le catalogue
- [ ] T035 [US5] Trier les commentaires par ordre de rédaction dans `lib/actions/article.actions.ts`, aujourd'hui affichés du plus récent au plus ancien
- [ ] T036 [US5] Ramener les commandes de carrousel à l'intérieur du cadre dans `components/ui/carousel.tsx`, et ajouter une pause au survol du carrousel de l'accueil

---

## Phase 7 : US6 — Marie comprend et utilise les filtres (P2)

- [ ] T037 [US6] Donner aux filtres de `app/(root)/search/page.tsx` une apparence de commande actionnable, et signaler l'état actif autrement que par la graisse du texte
- [ ] T038 [US6] Permettre de retirer un filtre actif en une action
- [ ] T039 [US6] Prévoir l'emplacement de l'explication du jargon — dimensions et types de peau — le texte devant venir de l'artisan
- [ ] T040 [US6] Réactiver la recherche par texte dans `components/shared/header/index.tsx`, aujourd'hui commentée, et la brancher sur la boutique

---

## Phase 8 : Vérifications transverses

- [ ] T041 ✅ Vérifier l'absence de débordement horizontal entre 320 et 1920 pixels sur l'accueil, la boutique, le blog et une fiche produit — le contrôle qu'une revue statique avait manqué
- [ ] T042 Exécuter les quatre vérifications constitutionnelles : `tsc`, `lint`, `test`, et `build` sans `.env` — serveur de développement arrêté au préalable
- [ ] T043 Dérouler [quickstart.md](./quickstart.md) de bout en bout
- [ ] T044 Mettre à jour `CLAUDE.md` : rôles typographiques, nature de produit, indicateur d'état

---

## Dépendances

```
Phase 1 (fondations) ─── BLOQUANT
    ├──> Phase 2 (US2) ──┐
    ├──> Phase 3 (US3) ──┼──> Phase 4 (US1) ──> Phase 5 (US4) ──┐
    ├──> Phase 6 (US5) ──┤                                       ├──> Phase 8
    └──> Phase 7 (US6) ──┘                                       ┘
```

US1 dépend du format de prix (phase 1) et du délai d'expédition. US4 dépend du tunnel de US1.
US5 et US6 sont indépendants et peuvent avancer en parallèle des autres.

## Stratégie de livraison

**Périmètre minimal viable** : phases 1 et 2. La distinction entre pièce unique et article
reproductible est ce qui manque le plus au produit — elle touche la nature même de ce que
vend l'atelier, et l'interface la contredit aujourd'hui à chaque écran.

**Incrément suivant** : phase 3, le langage de composants. C'est la demande explicite du
propriétaire, et elle donne le gain visuel le plus large.

**Puis** : le tunnel, les étapes, le blog, les filtres.
