# Feature Specification: Performance et tenue en conditions réelles

**Feature Branch**: `refacto/foundation`

**Created**: 2026-08-28

**Status**: Draft

**Input**: Audit Impeccable du 2026-08-28 — heuristique 9 « Diagnostic et récupération d'erreur » notée 1/4. Complété par un relevé de performance du même jour.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Marie voit les tambours sans attendre, même en 4G dans l'Ariège (Priority: P1)

Les photographies de l'atelier sont lourdes — jusqu'à 1,1 Mo pour une bannière d'article — et
aucune image du site ne déclare la taille à laquelle elle sera réellement affichée. Un
téléphone télécharge donc des images calibrées pour un grand écran. Par ailleurs, une douzaine
d'images sont déclarées prioritaires au chargement, dont les deux logos du pied de page :
elles se disputent la bande passante avec la seule image qui compte, celle que le visiteur
voit en premier. Six graisses de la police sont chargées pour un site qui en utilise deux ou
trois.

**Why this priority**: Le catalogue est fait de photographies. Si elles arrivent lentement, il
n'y a rien à regarder — et le public visé n'est pas systématiquement en fibre optique.

**Independent Test**: Mesurer le poids transféré et le délai d'affichage de la première image
sur la page d'accueil et sur une fiche produit, en connexion mobile simulée.

**Acceptance Scenarios**:

1. **Given** un visiteur sur téléphone, **When** il ouvre une page comportant des images,
   **Then** il ne télécharge que des images dimensionnées pour son écran.
2. **Given** une page en cours de chargement, **When** les ressources prioritaires sont
   déterminées, **Then** seule l'image visible d'emblée est privilégiée.
3. **Given** une page quelconque, **When** son poids transféré est mesuré,
   **Then** il reste dans une enveloppe raisonnable pour une connexion mobile.
4. **Given** une image en cours de chargement, **When** elle apparaît, **Then** la mise en
   page ne se décale pas.

---

### User Story 2 - Rien ne casse sans explication (Priority: P1)

Le site ne comporte aucun écran d'erreur. Lorsqu'une page échoue — droits insuffisants,
ressource introuvable, base injoignable — le visiteur reçoit l'écran d'erreur brut du cadriciel,
en anglais, sans issue. La page « introuvable » présente son message en rouge d'alerte, comme
si l'utilisateur avait commis une faute, et son bouton de retour est en anglais.

**Why this priority**: Un échec sans explication ni issue transforme un incident mineur en
abandon définitif.

**Independent Test**: Provoquer chaque famille d'échec et vérifier que le visiteur reste dans
le site, comprend ce qui s'est passé et dispose d'une sortie.

**Acceptance Scenarios**:

1. **Given** une page qui échoue à s'afficher, **When** l'erreur survient, **Then** le
   visiteur voit un écran du site, en français, expliquant la situation et proposant une
   issue.
2. **Given** un visiteur atteignant une adresse inexistante, **When** la page s'affiche,
   **Then** le ton est neutre et une navigation lui est proposée.
3. **Given** un visiteur tentant d'atteindre une page réservée, **When** l'accès est refusé,
   **Then** il en est informé clairement plutôt que par un écran technique.
4. **Given** un échec sur une partie de page seulement, **When** il survient, **Then** le
   reste de la page demeure utilisable.

---

### User Story 3 - L'attente est visible et supportable (Priority: P2)

Chaque page du site est calculée à la demande, sans mise en cache : toute navigation attend la
base de données. Pendant ce temps, rien n'indique qu'il se passe quelque chose. Dans le panier,
une action sur une ligne met en attente les commandes de toutes les autres lignes.

**Why this priority**: Améliore le ressenti sans changer les fonctionnalités. Vient après la
correction des images, qui pèsent davantage sur l'attente réelle.

**Independent Test**: Naviguer entre les pages en connexion ralentie et observer ce qui est
affiché pendant l'attente.

**Acceptance Scenarios**:

1. **Given** une navigation vers une page dont le contenu se charge, **When** l'attente
   dépasse un instant perceptible, **Then** une indication de chargement s'affiche.
2. **Given** une action sur un élément d'une liste, **When** elle est en cours,
   **Then** seule cette ligne signale l'attente.
3. **Given** un contenu qui change rarement, **When** il est demandé plusieurs fois,
   **Then** il n'est pas recalculé intégralement à chaque demande.

---

### Edge Cases

- Une page dont le chargement échoue partiellement doit rester utilisable pour ce qui a
  abouti.
- Un contenu mis en cache doit refléter une modification de l'artisan dans un délai
  prévisible, sans redéploiement.
- Une image manquante ou dont le chargement échoue doit laisser une trace visuelle propre,
  pas un cadre cassé.
- Un écran d'erreur ne doit jamais exposer de détail technique interne au visiteur.
- Les images téléversées par l'artisan étant de taille libre, le site ne peut pas présumer de
  leurs dimensions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Toute image MUST déclarer les dimensions auxquelles elle sera affichée, afin
  qu'un appareil ne télécharge que ce dont il a besoin.
- **FR-002**: Seules les images visibles sans défilement MUST être déclarées prioritaires au
  chargement.
- **FR-003**: Les ressources typographiques chargées MUST se limiter à celles réellement
  utilisées.
- **FR-004**: L'apparition d'une image MUST ne pas décaler la mise en page.
- **FR-005**: Toute page MUST disposer d'un écran d'erreur du site, en français, proposant une
  issue.
- **FR-006**: Un écran d'erreur MUST ne jamais exposer de détail technique interne.
- **FR-007**: Un échec localisé MUST laisser le reste de la page utilisable.
- **FR-008**: Une attente perceptible MUST être signalée visuellement.
- **FR-009**: Une action portant sur un élément d'une liste MUST ne signaler l'attente que sur
  cet élément.
- **FR-010**: Les contenus changeant rarement MUST bénéficier d'une stratégie de mise en cache,
  et MUST refléter une modification dans un délai prévisible.
- **FR-011**: Le refus d'accès à une page réservée MUST être présenté comme une information,
  non comme une panne.
- **FR-012**: Une image indisponible MUST laisser un substitut propre.

### Key Entities

- **Ressource visuelle** : une photographie ou un visuel affiché, dont le poids transféré
  dépend de l'appareil qui le demande.
- **Écran d'erreur** : la page présentée lorsqu'un contenu ne peut être affiché, portant une
  explication et au moins une issue.
- **Indication d'attente** : la marque visible qu'un traitement est en cours, dont la portée
  se limite à ce qui est effectivement en attente.
- **Politique de fraîcheur** : la durée pendant laquelle un contenu peut être servi sans être
  recalculé.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Sur une connexion mobile courante, la première image d'une page apparaît en
  moins de deux secondes et demie.
- **SC-002**: Le poids transféré d'une page de catalogue sur téléphone est au moins divisé par
  deux par rapport à l'état actuel.
- **SC-003**: Aucun décalage de mise en page n'est perceptible pendant le chargement.
- **SC-004**: Chaque famille d'échec provoquée délibérément aboutit à un écran du site, en
  français, avec une issue.
- **SC-005**: Aucun écran présenté au visiteur ne contient de trace technique interne.
- **SC-006**: Une action sur une ligne de liste ne met en attente aucune autre ligne.
- **SC-007**: Une modification faite par l'artisan est visible sur le site public dans un
  délai connu et annoncé.
- **SC-008**: Le déploiement du site n'échoue pas lorsque la base de données est
  momentanément indisponible.

## Assumptions

- Le public visé consulte majoritairement sur téléphone, en connexion mobile variable. Aucune
  mesure d'audience n'existe pour l'instant : cette hypothèse devra être confirmée.
- Les photographies existantes ne sont pas retouchées ni recompressées à la main. Le gain
  attendu vient de la façon dont elles sont demandées et servies.
- La stratégie de mise en cache doit rester compatible avec la contrainte déjà établie du
  projet : le déploiement ne doit dépendre ni d'un secret ni d'une base joignable.
- Le délai de fraîcheur acceptable pour le catalogue et le blog est de l'ordre de quelques
  minutes. À confirmer avec l'artisan, qui publie rarement mais veut voir ses modifications.
- Aucune mesure d'audience ni de performance n'est en place. Établir une mesure de référence
  fait partie du travail, faute de quoi les critères chiffrés ne sont pas vérifiables.
- Les écrans d'erreur produits sont en français et passent par le référentiel de libellés de
  la spécification 001, dont ce travail dépend.
