# Feature Specification: Un thème unique, cohérent et achevé

**Feature Branch**: `refacto/foundation`

**Created**: 2026-08-28

**Status**: Draft

**Input**: Audit Impeccable du 2026-08-28 — problème P1. Contraste mesuré au navigateur le même jour : 1,84:1 sur le récit de l'artisan en mode sombre. Décision du propriétaire le 2026-08-28 : le mode sombre est supprimé.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Le site n'a plus qu'une apparence, et elle est juste (Priority: P1)

Le site entretient aujourd'hui deux apparences. La seconde, le mode sombre, est cassée : le
récit de l'artisan y descend à un rapport de contraste de 1,84 pour 1 quand le seuil
d'accessibilité est de 4,5 ; le bloc de citation de la même page y reste un rectangle blanc
éclatant sur fond noir ; les survols de navigation y sont invisibles ; et la commande qui
permettrait d'y basculer n'existe pas en dessous d'une certaine largeur d'écran.

Le propriétaire a tranché : ce second thème ne sert personne et double le coût de chaque
décision visuelle. Il est supprimé.

**Why this priority**: Chaque incohérence chromatique du site vient de la coexistence de deux
thèmes dont un seul a été mené à terme. Retirer le second résout la moitié du problème avant
même d'avoir corrigé quoi que ce soit.

**Independent Test**: Parcourir le site avec un système réglé en préférence sombre et vérifier
qu'il s'affiche identiquement à un système réglé en clair. Livrable seul.

**Acceptance Scenarios**:

1. **Given** un visiteur dont le système est réglé en préférence sombre, **When** il ouvre
   n'importe quelle page, **Then** il voit la même apparence qu'un visiteur en préférence
   claire.
2. **Given** un visiteur ayant déjà choisi un mode lors d'une visite précédente,
   **When** il revient sur le site, **Then** il voit l'apparence unique, sans erreur ni
   affichage transitoire incohérent.
3. **Given** n'importe quelle page, **When** on cherche une commande de changement de thème,
   **Then** il n'y en a plus.
4. **Given** l'ensemble du site, **When** on recherche des règles d'apparence conditionnées au
   mode sombre, **Then** il n'en subsiste aucune.

---

### User Story 2 - Le thème vert de l'atelier devient enfin visible (Priority: P1)

La palette de l'atelier — vert forêt profond, sauge, blanc chaud — est déclarée mais à peine
rendue visible. Les surfaces de contenu n'ont aucune couleur propre : elles se confondent avec
le fond de page et ne se distinguent que par une bordure à peine perceptible. Une partie des
tons neutres — ceux des textes secondaires, des dates, des sous-titres — est restée à la teinte
froide livrée par défaut avec la bibliothèque de composants, alors que le reste du site est
chaud et vert. Deux familles chromatiques cohabitent sans que rien ne le signale.

**Why this priority**: C'est la sensation décrite par le propriétaire — « pas professionnel,
pas homogène ». Sans surface distincte, tout flotte au même niveau et la hiérarchie visuelle
s'effondre, quelle que soit la qualité de la mise en page.

**Independent Test**: Comparer une carte et son fond de page, puis un texte secondaire et un
texte principal, et vérifier que chacun se distingue tout en appartenant à la même famille.

**Acceptance Scenarios**:

1. **Given** une carte posée sur une page, **When** elle est affichée, **Then** sa surface se
   distingue du fond sans dépendre uniquement de sa bordure.
2. **Given** un texte secondaire, **When** il est comparé au texte principal, **Then** les deux
   appartiennent visiblement à la même famille chromatique.
3. **Given** n'importe quelle couleur affichée, **When** son origine est recherchée,
   **Then** elle provient du référentiel de thème et non d'une valeur écrite dans un composant.
4. **Given** un état d'interaction — survol, focus, sélection — **When** il se produit,
   **Then** il est perceptible.

---

### User Story 3 - Tous les contenus redeviennent lisibles (Priority: P1)

La page qui porte l'histoire de Julien, la meilleure preuve de son savoir-faire, est
aujourd'hui construite avec des couleurs écrites en dur, hors du référentiel de thème. Quarante-
sept occurrences du même type parsèment le site, dont un bloc rouge sang rendu sans condition
sur la page de commande de tous les clients, et une pastille de prix dont le contenu déborde de
son cadre.

**Why this priority**: Supprimer le mode sombre corrige mécaniquement les contrastes les plus
graves, mais laisse intactes les couleurs en dur, qui échapperont à toute évolution future du
thème.

**Independent Test**: Rechercher toute couleur affichée n'étant pas issue du référentiel, et
mesurer le contraste des textes de chaque page.

**Acceptance Scenarios**:

1. **Given** n'importe quelle page, **When** le contraste de son texte courant est mesuré,
   **Then** il atteint au moins le seuil d'accessibilité usuel.
2. **Given** un conteneur dont le contenu est conditionnel, **When** ce contenu est absent,
   **Then** le conteneur n'est pas rendu.
3. **Given** un élément affichant une valeur de longueur variable, **When** cette valeur est
   longue, **Then** elle reste contenue dans son cadre.
4. **Given** une couleur porteuse de sens — succès, avertissement, erreur — **When** elle est
   affichée, **Then** elle reste distincte des couleurs d'identité et lisible.

---

### Edge Cases

- Un visiteur ayant mémorisé une préférence de thème lors d'une visite antérieure ne doit subir
  ni erreur, ni clignotement, ni affichage transitoire dans l'ancien thème.
- Une image conçue pour un fond sombre doit être remplacée ou retirée, non conservée sur un
  fond clair.
- Un conteneur dont le contenu est conditionnel ne doit pas rester visible lorsqu'il est vide.
- Les graphiques de l'espace d'administration doivent rester lisibles avec la palette unique.
- Une image sur fond transparent doit rester visible sur le fond retenu.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le site MUST proposer une apparence unique, indépendante de la préférence système
  du visiteur.
- **FR-002**: La commande de changement de thème MUST être retirée de l'interface.
- **FR-003**: Aucune règle d'apparence conditionnée au mode sombre MUST subsister.
- **FR-004**: Une préférence de thème mémorisée lors d'une visite antérieure MUST rester sans
  effet et sans provoquer d'affichage incohérent.
- **FR-005**: Les surfaces de contenu MUST se distinguer du fond de page.
- **FR-006**: L'ensemble des tons neutres du référentiel MUST appartenir à la même famille
  chromatique que la palette de l'atelier.
- **FR-007**: Toute couleur affichée MUST provenir du référentiel de thème.
- **FR-008**: Le contraste du texte MUST atteindre le seuil d'accessibilité usuel sur toutes
  les pages.
- **FR-009**: Les états d'interaction MUST être perceptibles.
- **FR-010**: Les couleurs porteuses de sens MUST rester distinctes des couleurs d'identité.
- **FR-011**: Un conteneur sans contenu visible MUST ne pas être rendu.
- **FR-012**: La palette d'identité — le vert de l'atelier, le blanc chaud, la sauge — MUST
  être conservée. Ce travail l'achève, il ne la remplace pas.
- **FR-013**: Les visualisations de données MUST utiliser des couleurs dérivées de la palette.
- **FR-014**: Les ressources devenues inutiles du fait de la suppression du second thème MUST
  être retirées, y compris les visuels dupliqués pour ce thème.

### Key Entities

- **Référentiel de thème** : l'ensemble nommé des valeurs de couleur du site. Source unique de
  toute couleur affichée, désormais en une seule déclinaison.
- **Surface** : un plan de contenu posé sur le fond de page — carte, panneau, en-tête — distinct
  de ce fond.
- **Couleur porteuse de sens** : une couleur dont la valeur informative — succès, avertissement,
  erreur — prime sur son appartenance à l'identité visuelle.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Le site s'affiche identiquement quelle que soit la préférence d'apparence du
  système du visiteur.
- **SC-002**: Aucun texte du site ne descend sous le seuil de contraste d'accessibilité usuel.
- **SC-003**: Aucune couleur affichée n'est écrite en dehors du référentiel de thème.
- **SC-004**: Une carte est distinguable de son fond sur toutes les pages.
- **SC-005**: Un relevé des couleurs de texte ne fait apparaître qu'une seule famille
  chromatique de neutres.
- **SC-006**: Aucun bloc vide ne s'affiche sur aucune page.
- **SC-007**: La teinte d'identité de l'atelier est inchangée : un relevé avant et après montre
  les mêmes valeurs pour le fond, le texte principal et la couleur primaire.
- **SC-008**: Aucune ressource ni règle liée au second thème ne subsiste dans le projet.

## Assumptions

- Le propriétaire a décidé de supprimer le mode sombre, jugé inutile et coûteux en complexité.
  Cette spécification acte cette décision et ne la rediscute pas.
- L'apparence conservée est le mode clair actuel : blanc chaud, vert forêt, sauge. C'est la
  seule apparence que des visiteurs ont vue.
- La palette d'identité est validée et n'est pas rediscutée. Ce travail complète les valeurs
  manquantes ou incohérentes autour d'elle.
- Certains visuels existent en deux versions, une par thème. Ceux devenus inutiles sont
  retirés ; le plan devra les identifier.
- Le seuil d'accessibilité retenu est celui applicable au texte courant selon les critères
  usuels de niveau AA.
- Ce travail porte sur la couleur. La typographie, l'espacement et la disposition relèvent de la
  spécification 002.
- Il s'exécute après la spécification 002 : reteindre des composants qui vont être déplacés ou
  fusionnés serait du travail perdu.
