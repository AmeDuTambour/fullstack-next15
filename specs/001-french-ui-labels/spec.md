# Feature Specification: Interface entièrement en français

**Feature Branch**: `refacto/foundation` (pas de branche dédiée : le travail se poursuit sur la branche de remise à niveau en cours)

**Created**: 2026-08-28

**Status**: Draft

**Input**: Audit Impeccable du 2026-08-28 — problème P0, rapport dans `.impeccable/critique/2026-08-28T17-12-55Z__app.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Marie confirme sa commande sans paniquer (Priority: P1)

Marie, 52 ans, praticienne en soin énergétique, vient de commander un tambour à 290 € et
choisit le virement bancaire. Elle arrive sur la page de confirmation. Aujourd'hui cette
page s'intitule `Order ..3f2a1c`, affiche `Payment Method`, un badge rouge `Not paid` et un
second badge rouge `Not delivered`. Elle ne sait pas si sa commande est passée, si elle doit
payer autrement, ni pourquoi tout est rouge. Elle appelle l'atelier.

Après ce travail, elle lit une page en français qui lui dit ce qui s'est passé et ce qui va
se passer, dans des termes qu'elle comprend.

**Why this priority**: C'est le moment de confiance maximale de tout le parcours, et c'est là
que l'interface est la plus hostile. Un client qui doute après avoir payé appelle, ou annule.

**Independent Test**: Passer une commande de bout en bout avec chacun des trois moyens de
paiement et lire la page de confirmation. Livrable vérifiable seul, sans toucher au reste.

**Acceptance Scenarios**:

1. **Given** une commande payée par carte, **When** le client atteint la page de commande,
   **Then** tous les libellés, statuts et en-têtes de tableau qu'il voit sont en français.
2. **Given** une commande réglée par virement, **When** le client atteint la page de commande,
   **Then** l'état de paiement est présenté comme une étape en attente, formulée en français,
   et non comme un échec.
3. **Given** un visiteur non authentifié, **When** il ouvre une page du site,
   **Then** le document déclare le français comme langue de contenu.

---

### User Story 2 - Julien administre son atelier dans sa langue (Priority: P1)

Julien est l'unique administrateur et n'est pas technicien. Son back-office est aujourd'hui
intégralement en anglais — `Dashboard`, `Total Revenue`, `Create Product`, `Feature Product` —
alors que sa vitrine est en français. Il doit deviner le sens de chaque écran.

**Why this priority**: C'est l'outil qu'il utilise tous les jours. Chaque hésitation est une
erreur de saisie potentielle sur son propre catalogue.

**Independent Test**: Parcourir les cinq sections d'administration et les deux éditeurs
multi-étapes en relevant tout texte non français.

**Acceptance Scenarios**:

1. **Given** un administrateur connecté, **When** il ouvre n'importe quelle page
   d'administration, **Then** tous les titres, en-têtes de colonnes, boutons et états qu'il
   voit sont en français.
2. **Given** un administrateur dans un éditeur multi-étapes, **When** il navigue entre les
   étapes, **Then** les noms d'étapes et les commandes de navigation sont en français.
3. **Given** une action qui échoue, **When** le message d'erreur s'affiche,
   **Then** il est en français, y compris lorsqu'il provient d'une contrainte de la base.

---

### User Story 3 - Thomas s'inscrit sans changer de langue en cours de route (Priority: P2)

Thomas crée un compte pour commenter un article. Le formulaire lui demande « Nom » et
« Confirmation du mot de passe », mais la carte s'intitule `Create Account` et le bouton dit
`Sign In`. Deux langues dans le même écran.

**Why this priority**: C'est le second moment de confiance, et le défaut y est visible en un
coup d'œil. Moins coûteux qu'un abandon de commande, mais tout aussi révélateur.

**Independent Test**: Ouvrir les deux écrans d'authentification et vérifier qu'aucun mot
anglais n'y subsiste, y compris dans les états de chargement.

**Acceptance Scenarios**:

1. **Given** un visiteur sur l'écran de connexion ou d'inscription, **When** il lit la page,
   **Then** aucun texte visible n'est en anglais, y compris les états transitoires.
2. **Given** un visiteur qui soumet le formulaire, **When** le traitement est en cours,
   **Then** l'indication d'attente est en français.

---

### User Story 4 - Le site se présente correctement aux moteurs et aux lecteurs d'écran (Priority: P2)

Le titre d'onglet d'une recherche affiche aujourd'hui `Search : Category Drum | L'Âme Du
Tambour`. C'est ce que voit un moteur de recherche, ce que lit un lecteur d'écran, et ce
qu'affiche un onglet ouvert.

**Why this priority**: Effet durable sur l'acquisition, pour un coût faible. Mais invisible
depuis l'interface, donc moins urgent que ce qu'un client voit en payant.

**Independent Test**: Ouvrir chaque type de page et relever le titre du document.

**Acceptance Scenarios**:

1. **Given** n'importe quelle page du site, **When** son titre de document est lu,
   **Then** il est en français.
2. **Given** une page de résultats de recherche filtrée, **When** son titre est lu,
   **Then** il décrit le filtre appliqué en français.

---

### Edge Cases

- Un message d'erreur remonté par la base de données pour une contrainte d'unicité doit être
  présenté en français, sans exposer le nom technique du champ.
- Un libellé absent du référentiel central ne doit pas afficher une chaîne vide ni une clé
  technique : il doit se replier sur une valeur lisible.
- Les données saisies par l'administrateur — noms de produits, titres d'articles, noms de
  catégories — ne sont pas des libellés d'interface et ne doivent jamais être traduites.
- Un montant, une date ou un nombre doit suivre les conventions françaises, y compris dans
  les écrans d'administration.
- Le nom des moyens de paiement stocké en base (`Stripe`, `PayPal`, `Transfer`) est une clé
  technique : elle ne change pas, seul son libellé affiché est traduit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Tout texte visible par un humain sur la page de commande, dans l'espace
  d'administration et dans l'espace compte MUST être en français.
- **FR-002**: Le document MUST déclarer le français comme langue de contenu.
- **FR-003**: Les titres de document de chaque page MUST être en français, y compris ceux
  construits dynamiquement à partir de filtres.
- **FR-004**: Les messages d'erreur présentés à l'utilisateur MUST être en français, y
  compris ceux dont l'origine est une contrainte de base de données.
- **FR-005**: Les libellés statiques d'interface MUST être définis dans un référentiel
  central unique, et non écrits en dur dans les composants.
- **FR-006**: Un libellé demandé au référentiel mais absent MUST se replier sur une valeur
  lisible plutôt que sur une chaîne vide ou une clé technique.
- **FR-007**: Les montants, dates et nombres affichés MUST suivre les conventions françaises
  sur l'ensemble du site, espace d'administration compris.
- **FR-008**: Les chemins d'URL, les identifiants techniques stockés en base et le code
  source MUST rester en anglais et ne pas être modifiés par ce travail.
- **FR-009**: Le contenu saisi par l'administrateur MUST être affiché tel quel, sans passer
  par le référentiel de libellés.
- **FR-010**: Le référentiel de libellés MUST couvrir les états transitoires — chargement,
  envoi en cours, traitement — au même titre que les états stables.

### Key Entities

- **Libellé d'interface** : un texte affiché à un humain, identifié par une clé technique
  stable et associé à une valeur française. Distinct d'une donnée métier.
- **Clé technique** : un identifiant utilisé par le système — chemin d'URL, valeur stockée,
  nom de moyen de paiement. Jamais affiché tel quel, jamais traduit.
- **Donnée métier** : un contenu saisi par l'administrateur — nom de produit, titre
  d'article, description. Affiché tel quel, hors périmètre de traduction.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un francophone peut parcourir l'intégralité du site — vitrine, tunnel d'achat,
  espace compte, espace d'administration — sans rencontrer un seul mot d'anglais dans
  l'interface.
- **SC-002**: Aucun écran ne mélange les deux langues.
- **SC-003**: Un lecteur d'écran annonce le contenu du site en français sur toutes les pages.
- **SC-004**: Ajouter un nouvel écran comportant du texte anglais écrit en dur devient
  détectable par une vérification automatique, et non par relecture humaine.
- **SC-005**: Les prix s'affichent dans la convention française — séparateur décimal virgule,
  symbole après le montant — de façon identique sur les cinq écrans qui en affichent.
- **SC-006**: Le nombre d'appels de l'artisan liés à une incompréhension de l'état d'une
  commande tend vers zéro.

## Assumptions

- Le site s'adresse à un public francophone unique. Aucune internationalisation multilingue
  n'est demandée : une seule langue d'interface, pas de sélecteur de langue, pas de
  négociation de langue par en-tête.
- Cette hypothèse est réversible : centraliser les libellés est précisément ce qui rendrait
  une seconde langue possible plus tard, sans que ce travail ne la prépare explicitement.
- Les trois surfaces citées sont exhaustives. Une relecture complète peut en révéler
  d'autres ; elles entrent alors dans le périmètre.
- Le référentiel de libellés s'inspire du mécanisme déjà présent dans le projet pour les
  moyens de paiement, jugé satisfaisant par le propriétaire.
- La vérification automatique mentionnée en SC-004 s'appuie sur l'outillage de qualité déjà
  en place, sans introduire de chaîne de traduction externe.
- Le travail est purement textuel et structurel : il ne modifie ni la mise en page, ni les
  couleurs, ni les composants. Ces sujets relèvent des spécifications suivantes.
