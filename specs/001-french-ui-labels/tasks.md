---
description: "Task list for spec 001 — Interface entièrement en français"
---

# Tasks: Interface entièrement en français

**Input**: Design documents from `specs/001-french-ui-labels/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/labels.md](./contracts/labels.md)

**Tests**: La spécification ne demande pas de tests unitaires par écran. La garantie de
non-régression passe par la règle de linting (SC-004) et par les 23 tests de contrat existants,
qui doivent rester verts à chaque étape. Deux tâches de vérification les couvrent explicitement.

**Organization**: Groupées par histoire utilisateur, dans l'ordre de priorité de la
spécification.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable — fichiers distincts, aucune dépendance à une tâche inachevée
- **[Story]** : histoire utilisateur concernée (US1 à US4)

---

## Phase 1 : Mise en place

- [X] T001 Créer le répertoire `lib/labels/` et son point d'entrée `lib/labels/index.ts`, exportant un objet unique typé `as const` conformément à [contracts/labels.md](./contracts/labels.md)
- [X] T002 [P] Créer `lib/labels/common.ts` avec les actions et états partagés — enregistrer, annuler, supprimer, modifier, retour, suivant, précédent, chargement en cours
- [X] T003 [P] Créer `lib/labels/errors.ts` avec les messages d'échec présentés au visiteur, dont le message générique de repli unique
- [X] T004 Déplacer `PAYMENT_METHOD_LABELS` de `lib/constants/index.ts` vers `lib/labels/`, en conservant l'export existant en réexport pour ne casser aucun appelant

---

## Phase 2 : Fondations (bloquant pour toutes les histoires)

**⚠️ À terminer avant toute histoire utilisateur.**

- [X] T005 Remplacer `lang="en"` par `lang="fr"` dans `app/layout.tsx`
- [X] T006 Traduire les 35 messages de validation de `lib/validators.ts`, en corrigeant au passage les deux fautes de frappe (« at lest », « exatcly »)
- [X] T007 Réécrire `formatError` dans `lib/utils.ts` en table de correspondance : formes reconnues traduites depuis `lib/labels/errors.ts`, repli générique unique pour tout le reste, message d'origine journalisé côté serveur et jamais renvoyé
- [X] T008 ⚠️ Vérifier que les routes de `app/api/` renvoient toujours leurs messages **en anglais** — ils s'adressent à un client logiciel, pas à un humain. Exécuter `npm test` : les 23 tests de contrat doivent rester verts
- [X] T009 Vérifier que `npx tsc --noEmit` passe après l'introduction du référentiel

**Point de contrôle** : la langue du document est correcte, les erreurs sont françaises côté
site et inchangées côté API, et le référentiel est utilisable.

---

## Phase 3 : US1 — Marie confirme sa commande sans paniquer (P1)

**Objectif** : la page de commande, qui a motivé le classement P0, ne présente plus un badge
rouge anglais à un client qui vient de payer.

**Test indépendant** : passer une commande avec chacun des trois moyens de paiement et lire la
page de confirmation. Aucun mot anglais, aucun état formulé comme un échec.

- [X] T010 [US1] Créer `lib/labels/order.ts` avec les libellés du panier, du tunnel et de la page de commande
- [X] T011 [US1] Traduire `app/(root)/order/[id]/order-details-table.tsx` — titre, moyen de paiement, adresse de livraison, en-têtes du tableau, totaux, états payé et livré, actions d'administration
- [X] T012 [P] [US1] Traduire `app/(root)/order/[id]/StripeForm.tsx` — intitulé du paiement, état d'envoi, messages d'erreur
- [X] T013 [P] [US1] Traduire `app/(root)/order/[id]/stripe-payment-success/page.tsx` et vérifier la cohérence avec les autres fins de parcours
- [X] T014 [US1] Reformuler l'état de paiement en attente pour un virement : une étape à venir, pas un échec (scénario d'acceptation 2 de US1)
- [X] T015 [US1] Exécuter `npm test` et vérifier que la page de commande s'affiche correctement pour les trois moyens de paiement

---

## Phase 4 : US2 — Julien administre son atelier dans sa langue (P1)

**Objectif** : le back-office cesse d'être un outil anglophone pour un artisan francophone.
C'est le plus gros volume : ~140 littéraux sur 22 fichiers.

**Test indépendant** : parcourir les cinq sections et les deux éditeurs multi-étapes en relevant
tout texte non français.

- [X] T016 [US2] Créer `lib/labels/admin.ts` avec les libellés de l'espace d'administration
- [X] T017 [P] [US2] Traduire `app/admin/layout.tsx` et `app/admin/main-nav.tsx` — noms des cinq sections
- [X] T018 [P] [US2] Traduire `app/admin/overview/page.tsx` et `app/admin/overview/chart.tsx` — titres des indicateurs, en-têtes du tableau des ventes récentes
- [X] T019 [P] [US2] Traduire `app/admin/products/page.tsx` — en-têtes de colonnes, actions, mention de filtre actif
- [X] T020 [P] [US2] Traduire `app/admin/orders/page.tsx` et `app/admin/users/page.tsx` ainsi que `app/admin/users/[id]/update-user-form.tsx`
- [X] T021 [P] [US2] Traduire `app/admin/articles/page.tsx` — états publié et brouillon, dates, action de création
- [X] T022 [US2] Traduire les trois étapes de l'éditeur produit : `base-product/page.tsx`, `base-product-form.tsx`, `product-specifications/page.tsx`, `product-specifications-form.tsx`, `publish-product/page.tsx`, `publish-product-form.tsx`
- [X] T023 [US2] Traduire les trois étapes de l'éditeur article : `enter-title/page.tsx`, `article-title-form.tsx`, `category-form.tsx`, `add-sections/page.tsx`, `publish-article/page.tsx`, `publish-article-form.tsx`
- [X] T024 [P] [US2] Traduire les composants partagés `components/admin/add-sections-form.tsx`, `components/admin/section-editor.tsx`, `components/admin/admin-search.tsx` et `components/shared/editor-steps.tsx`
- [X] T025 [US2] Remplacer le déversement brut des erreurs de validation dans `base-product-form.tsx` par un affichage lisible — un dump technique n'est pas un message d'interface

---

## Phase 5 : US3 — Thomas s'inscrit sans changer de langue (P2)

**Objectif** : plus aucun écran ne mélange les deux langues.

**Test indépendant** : ouvrir les deux écrans d'authentification et l'espace compte, vérifier
qu'aucun mot anglais ne subsiste, états transitoires compris.

- [X] T026 [US3] Créer `lib/labels/account.ts` avec les libellés d'authentification et d'espace compte
- [X] T027 [P] [US3] Traduire `app/(auth)/sign-in/page.tsx` et `credentials-sign-in-form.tsx` — titre de carte, bouton, état d'envoi
- [X] T028 [P] [US3] Traduire `app/(auth)/sign-up/page.tsx` et `sign-up-form.tsx` — titre, description, bouton, état d'envoi
- [X] T029 [P] [US3] Traduire `app/user/main-nav.tsx`, `app/user/profile/page.tsx`, `profile-form.tsx` et `app/user/orders/page.tsx`
- [X] T030 [US3] Ajouter les étiquettes manquantes aux champs de `profile-form.tsx` — ils n'ont aujourd'hui qu'un texte d'exemple, qui disparaît à la saisie

---

## Phase 6 : US4 — Le site se présente correctement aux moteurs (P2)

**Objectif** : plus aucun titre de document en anglais.

**Test indépendant** : ouvrir chaque type de page et relever le titre de l'onglet.

- [X] T031 [US4] Traduire les titres de document statiques des dix pages concernées, dont `admin/overview`, `admin/orders`, `admin/users`, `user/orders`, `(auth)/sign-in` et `(auth)/sign-up`
- [X] T032 [US4] Réécrire le titre construit dynamiquement dans `app/(root)/search/page.tsx` — il produit aujourd'hui « Search : Category Drum »
- [X] T033 [US4] Traduire les titres des deux éditeurs multi-étapes, `Create a product` et `Create an article`

---

## Phase 7 : Verrouillage anti-régression

**⚠️ À faire en dernier.** Activer la règle avant la traduction produirait des centaines
d'erreurs sans valeur.

- [X] T034 Activer `react/jsx-no-literals` dans `eslint.config.mjs`, appliquée par répertoire aux surfaces traduites : `app/(auth)`, `app/user`, `app/admin`, `app/(root)/order`
- [X] T035 Ajuster la configuration de la règle pour couvrir les attributs porteurs de texte visible — texte d'exemple, intitulé accessible, texte alternatif
- [X] T036 Exécuter `npx next lint` et corriger les littéraux restants dans les répertoires couverts
- [X] T037 ✅ Vérifier la garantie : ajouter volontairement un texte anglais en dur dans une surface couverte, constater que le linting échoue, puis retirer la modification. C'est le seul contrôle qui prouve SC-004

---

## Phase 8 : Finition et vérifications transverses

- [ ] T038 Exécuter les quatre vérifications du flux de travail constitutionnel : `npx tsc --noEmit`, `npx next lint`, `npm test`, et `next build` sans fichier d'environnement
- [ ] T039 Dérouler le guide de validation [quickstart.md](./quickstart.md) de bout en bout, section 6 comprise — la non-régression du périmètre exclu
- [ ] T040 Vérifier que les chemins d'URL et les valeurs stockées sont inchangés : `/search`, `/cart`, `/admin/products` répondent, et les moyens de paiement en base valent toujours `Stripe`, `PayPal`, `Transfer`
- [ ] T041 Mettre à jour `CLAUDE.md` : consigner l'emplacement du référentiel et la règle de linting, pour que la prochaine session les applique sans les redécouvrir

---

## Dépendances

```
Phase 1 (mise en place)
    └──> Phase 2 (fondations) ─── BLOQUANT
              ├──> Phase 3 (US1) ─┐
              ├──> Phase 4 (US2) ─┤
              ├──> Phase 5 (US3) ─┼──> Phase 7 (verrouillage) ──> Phase 8
              └──> Phase 6 (US4) ─┘
```

Les phases 3 à 6 sont indépendantes entre elles : chacune touche des fichiers distincts et peut
être livrée seule. La phase 7 exige que toutes soient terminées, sinon la règle signale du code
non encore traduit.

## Parallélisation

**Dans la phase 1** : T002 et T003 sur des fichiers distincts.

**Dans la phase 4**, la plus longue : T017 à T021 et T024 portent chacune sur des fichiers
distincts. T022 et T023 traitent chacune un éditeur complet et doivent rester séquentielles en
interne, la cohérence des noms d'étapes primant.

**Entre phases** : les phases 3, 5 et 6 peuvent avancer en parallèle de la phase 4, qui est de
loin la plus longue.

## Stratégie de livraison

**Périmètre minimal viable** : phases 1, 2 et 3. La langue du document est correcte, les
messages de validation et d'erreur sont français, et la page de commande — l'écran qui a motivé
le classement P0 — ne renvoie plus un badge rouge anglais à un client qui vient de payer. C'est
livrable et vérifiable seul.

**Incréments suivants** : US3 puis US4, petits et rapides. US2 en dernier malgré son volume :
un seul utilisateur, qui s'en accommode depuis un an.

**Verrouillage** : la phase 7 n'a de sens qu'une fois tout traduit. Livrer sans elle donne une
traduction ponctuelle qui se dégradera au prochain écran ajouté — précisément ce que la
spécification cherche à empêcher.
