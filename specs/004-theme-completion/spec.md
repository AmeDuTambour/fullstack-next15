# Feature Specification: Achever le thème sans changer la palette

**Feature Branch**: `refacto/foundation`

**Created**: 2026-08-28

**Status**: Draft

**Input**: Audit Impeccable du 2026-08-28 — problème P1. Contraste mesuré au navigateur le même jour : 1,84:1 sur le récit de l'artisan en mode sombre.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Le site cesse de paraître inachevé (Priority: P1)

Le thème vert de l'atelier est déclaré mais à moitié appliqué. Les surfaces de contenu n'ont
aucune couleur propre : elles se confondent avec le fond de page, dans les deux modes
d'affichage. Une partie des tons neutres — ceux des textes secondaires, des dates, des
sous-titres — est restée à la teinte froide fournie par défaut par la bibliothèque de
composants, alors que le reste du site est chaud et vert. Deux familles de couleurs cohabitent
sans que rien ne le signale, et l'œil perçoit un désaccord permanent qu'il ne sait pas nommer.

**Why this priority**: C'est exactement la sensation décrite par le propriétaire — « pas
professionnel, pas homogène ». Sans surface distincte, tout flotte au même niveau et la
hiérarchie visuelle s'effondre, quelle que soit la qualité de la mise en page.

**Independent Test**: Afficher côte à côte une carte et le fond de page, puis un texte
secondaire et un texte principal, et vérifier que chacun se distingue et appartient à la même
famille chromatique. Livrable seul.

**Acceptance Scenarios**:

1. **Given** une carte posée sur une page, **When** elle est affichée dans l'un ou l'autre
   mode, **Then** sa surface se distingue du fond de page sans dépendre uniquement de sa
   bordure.
2. **Given** un texte secondaire — date, sous-titre, mention discrète — **When** il est
   comparé au texte principal, **Then** les deux appartiennent visiblement à la même famille
   chromatique.
3. **Given** n'importe quelle couleur affichée par le site, **When** son origine est
   recherchée, **Then** elle provient du référentiel de thème et non d'une valeur écrite dans
   un composant.

---

### User Story 2 - Le récit de l'artisan reste lisible en mode sombre (Priority: P1)

La page qui porte l'histoire de Julien est aujourd'hui illisible en mode sombre : son texte
s'affiche à un rapport de contraste de 1,84 pour 1, là où le seuil d'accessibilité usuel est
de 4,5. Dans la même page, le bloc de citation reste un rectangle blanc éclatant sur un fond
quasi noir. Deux échecs opposés dans un seul écran, sur la page qui contient le meilleur
argument de vente du site.

**Why this priority**: Un contenu illisible est un contenu perdu, et c'est le contenu le plus
précieux du site.

**Independent Test**: Basculer chaque page en mode sombre et mesurer le contraste des textes.

**Acceptance Scenarios**:

1. **Given** n'importe quelle page en mode sombre, **When** le contraste de son texte courant
   est mesuré, **Then** il atteint au moins le seuil d'accessibilité usuel.
2. **Given** un bloc mis en valeur — citation, encadré, message — **When** le mode d'affichage
   change, **Then** il s'adapte au mode courant au lieu de conserver l'apparence de l'autre.
3. **Given** un survol d'élément de navigation, **When** il se produit en mode sombre,
   **Then** il est perceptible.

---

### User Story 3 - Le choix du mode d'affichage est accessible à tous (Priority: P2)

Le sélecteur de thème n'existe pas en dessous d'une certaine largeur d'écran : il est logé
dans une barre réservée aux grands écrans, et le menu mobile ne le reprend pas. Un mode sombre
développé et maintenu est donc injoignable pour tout visiteur sur téléphone ou tablette.

**Why this priority**: Corrige une fonctionnalité déjà écrite mais inaccessible à la majorité
du trafic. Faible coût, mais dépend des deux stories précédentes : rendre accessible un mode
sombre cassé aggraverait le problème.

**Independent Test**: Chercher le sélecteur de thème à plusieurs largeurs d'écran.

**Acceptance Scenarios**:

1. **Given** un visiteur sur n'importe quelle largeur d'écran supportée, **When** il cherche à
   changer de mode d'affichage, **Then** la commande lui est accessible.
2. **Given** un visiteur ayant choisi un mode, **When** il navigue vers une autre page,
   **Then** son choix est conservé.

---

### Edge Cases

- Un bloc porteur d'un sens — succès, avertissement, erreur — doit rester reconnaissable dans
  les deux modes sans emprunter une couleur d'accent du thème.
- Un conteneur dont le contenu est conditionnel ne doit pas rester visible lorsqu'il est vide.
- Un visiteur n'ayant exprimé aucune préférence doit obtenir un rendu cohérent, sans texte
  d'un mode sur le fond de l'autre.
- Les graphiques de l'espace d'administration doivent rester lisibles dans les deux modes.
- Une image sur fond transparent doit rester visible dans les deux modes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Les surfaces de contenu MUST se distinguer du fond de page dans les deux modes.
- **FR-002**: L'ensemble des tons neutres du référentiel de thème MUST appartenir à la même
  famille chromatique que la palette de l'atelier.
- **FR-003**: Toute couleur affichée MUST provenir du référentiel de thème.
- **FR-004**: Le contraste du texte MUST atteindre le seuil d'accessibilité usuel sur toutes
  les pages, dans les deux modes.
- **FR-005**: Chaque valeur du référentiel de thème MUST être définie séparément pour le mode
  clair et pour le mode sombre.
- **FR-006**: Les états d'interaction — survol, focus, sélection — MUST être perceptibles dans
  les deux modes.
- **FR-007**: Les couleurs porteuses de sens MUST rester distinctes des couleurs d'identité et
  MUST être lisibles dans les deux modes.
- **FR-008**: Le sélecteur de mode d'affichage MUST être accessible à toutes les largeurs
  d'écran supportées.
- **FR-009**: Un conteneur sans contenu visible MUST ne pas être rendu.
- **FR-010**: La palette d'identité — la teinte verte de l'atelier, le blanc chaud, la sauge —
  MUST être conservée. Ce travail la complète, il ne la remplace pas.
- **FR-011**: Les visualisations de données MUST utiliser des couleurs dérivées de la palette
  et cohérentes entre les deux modes.

### Key Entities

- **Référentiel de thème** : l'ensemble nommé des valeurs de couleur du site, décliné pour le
  mode clair et pour le mode sombre. Source unique de toute couleur affichée.
- **Surface** : un plan de contenu posé sur le fond de page — carte, panneau, en-tête —
  distinct de ce fond.
- **Couleur porteuse de sens** : une couleur dont la valeur informative — succès,
  avertissement, erreur — prime sur son appartenance à l'identité visuelle.
- **Mode d'affichage** : clair ou sombre, choisi par le visiteur ou hérité de son système.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Aucun texte du site ne descend sous le seuil de contraste d'accessibilité usuel,
  dans aucun des deux modes.
- **SC-002**: Aucune couleur affichée n'est écrite en dehors du référentiel de thème.
- **SC-003**: Une carte est distinguable de son fond sur toutes les pages, dans les deux modes.
- **SC-004**: Le sélecteur de mode est atteignable à toute largeur entre 320 et 1920 pixels.
- **SC-005**: Un relevé des couleurs de texte du site ne fait apparaître qu'une seule famille
  chromatique de neutres.
- **SC-006**: Aucun bloc vide ne s'affiche sur aucune page.
- **SC-007**: La teinte d'identité de l'atelier est inchangée : un relevé avant et après le
  travail montre les mêmes valeurs pour le fond, le texte principal et la couleur primaire.

## Assumptions

- La palette actuelle est validée par le propriétaire et n'est pas rediscutée. Ce travail
  ajuste les valeurs manquantes ou incohérentes autour d'elle, sans toucher aux trois ou
  quatre couleurs qui font l'identité.
- Le mode sombre est conservé. La question de son intérêt a été posée dans l'audit ; le
  périmètre retenu est de le réparer, non de le supprimer.
- Le seuil d'accessibilité retenu est celui applicable au texte courant selon les critères
  usuels de niveau AA.
- Ce travail porte sur la couleur et sur ses valeurs. La typographie, l'espacement et la
  disposition relèvent de la spécification 002.
- Il s'exécute après la spécification 002 : reteindre des composants qui vont être déplacés ou
  fusionnés serait du travail perdu.
