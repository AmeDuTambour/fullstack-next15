# Feature Specification: Confiance, conformité et visibilité

**Feature Branch**: `refacto/foundation`

**Created**: 2026-08-28

**Status**: Draft

**Input**: Audit Impeccable du 2026-08-28 — heuristique 10 « Aide et documentation » notée 0/4, la seule note nulle du rapport. Complété par un relevé SEO du même jour.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Marie trouve les informations qui la décident à commander (Priority: P1)

Marie s'apprête à payer 290 € à un artisan qu'elle ne connaît pas, pour un objet fait main
qu'elle n'a pas pu essayer. Elle cherche les conditions de vente, la politique de retour, le
délai de livraison, et de quoi identifier l'entreprise. Rien de tout cela n'existe sur le
site. Elle cherche aussi une adresse ou un téléphone sur la page de contact : il n'y a qu'un
formulaire.

**Why this priority**: C'est un frein direct à l'achat pour un panier moyen élevé, et une
obligation réglementaire pour une boutique française. L'absence des deux se corrige d'un seul
geste.

**Independent Test**: Demander à quelqu'un de retrouver, avant de commander, qui vend, sous
quel délai, et comment retourner l'article. Livrable seul.

**Acceptance Scenarios**:

1. **Given** un visiteur sur n'importe quelle page, **When** il cherche les informations
   légales de l'entreprise, **Then** il y accède depuis un emplacement présent sur toutes les
   pages.
2. **Given** un acheteur avant de valider sa commande, **When** il cherche les conditions de
   vente et la politique de retour, **Then** elles lui sont accessibles sans quitter le
   parcours.
3. **Given** un visiteur qui veut joindre l'atelier autrement que par formulaire,
   **When** il consulte la page de contact, **Then** il y trouve les coordonnées de l'atelier
   et un ordre de grandeur du délai de réponse.
4. **Given** un visiteur soucieux de ses données, **When** il cherche comment elles sont
   traitées, **Then** une politique de confidentialité lui est accessible.

---

### User Story 2 - Julien partage un tambour sur les réseaux et ça donne envie (Priority: P1)

Julien poste le lien d'un tambour sur Instagram et Facebook — ses deux canaux d'acquisition,
les seuls liens sociaux du site. Le lien s'affiche sans image, sans titre spécifique et sans
description : chaque produit et chaque article partagent le titre générique du site. Une
recherche filtrée produit même un titre d'onglet en anglais.

**Why this priority**: C'est son canal d'acquisition principal, et le défaut annule l'effet de
chaque publication. Coût faible, effet direct sur la fréquentation.

**Independent Test**: Coller l'adresse d'un tambour et celle d'un article dans un outil de
prévisualisation de partage et constater ce qui s'affiche.

**Acceptance Scenarios**:

1. **Given** l'adresse d'un tambour, **When** elle est partagée sur un réseau social,
   **Then** l'aperçu montre le nom du tambour, sa photographie et une description propre à ce
   produit.
2. **Given** l'adresse d'un article, **When** elle est partagée, **Then** l'aperçu montre le
   titre de l'article et son visuel.
3. **Given** n'importe quelle page, **When** son titre d'onglet est lu, **Then** il décrit
   cette page en particulier, en français.

---

### User Story 3 - Le catalogue devient trouvable depuis un moteur de recherche (Priority: P2)

Le site n'expose aucun plan de site, aucune directive d'indexation, et aucune donnée
structurée décrivant ses produits. Un moteur ne sait ni ce qu'il doit explorer, ni qu'il a
affaire à des produits ayant un prix et une disponibilité.

**Why this priority**: Effet cumulatif et durable, mais lent. Moins urgent que ce qui bloque
une vente aujourd'hui.

**Independent Test**: Soumettre le site à un outil d'analyse de référencement et vérifier que
les pages produits et articles sont découvrables et correctement décrites.

**Acceptance Scenarios**:

1. **Given** un moteur de recherche explorant le site, **When** il cherche la liste des pages
   à indexer, **Then** un plan de site à jour la lui fournit, articles et produits publiés
   compris.
2. **Given** une page de tambour publié, **When** un moteur l'analyse, **Then** il peut en
   extraire le nom, le prix, la disponibilité et une image sous forme structurée.
3. **Given** un contenu non publié ou une page d'administration, **When** un moteur explore le
   site, **Then** ce contenu n'est pas proposé à l'indexation.

---

### User Story 4 - Le site reste utilisable pour qui ne voit pas l'écran (Priority: P2)

Le formulaire de profil ne comporte aucune étiquette : ses champs ne sont identifiés que par
un texte d'exemple, qui disparaît dès la saisie. Le déclencheur du menu compte n'a pas de nom
accessible. Le formulaire d'inscription déclare des valeurs d'auto-remplissage inexistantes,
si bien qu'aucun gestionnaire de mots de passe ne le reconnaît.

**Why this priority**: Touche une minorité d'utilisateurs, mais les échecs sont bloquants pour
eux et les corrections sont peu coûteuses.

**Independent Test**: Parcourir les formulaires au clavier seul, puis avec un lecteur d'écran.

**Acceptance Scenarios**:

1. **Given** un champ de formulaire, **When** il est rencontré par un lecteur d'écran,
   **Then** il est annoncé par une étiquette persistante, distincte du texte d'exemple.
2. **Given** un bouton dont le contenu est une icône, **When** il est rencontré par un lecteur
   d'écran, **Then** il porte un nom explicite.
3. **Given** un formulaire d'authentification, **When** il est ouvert dans un navigateur muni
   d'un gestionnaire de mots de passe, **Then** celui-ci reconnaît les champs et propose de
   les remplir.
4. **Given** une commande actionnable au doigt, **When** elle est mesurée, **Then** sa surface
   tactile atteint la taille minimale recommandée.

---

### Edge Cases

- Un tambour dépublié ou supprimé ne doit plus apparaître dans le plan de site, ni rester
  proposé à l'indexation.
- Un produit sans photographie doit produire un aperçu de partage acceptable, pas un cadre
  vide.
- Les pages d'information doivent rester accessibles même si leur contenu n'est pas encore
  rédigé : une page annoncée mais introuvable est pire que pas de page.
- Un contenu légal daté doit indiquer sa date de dernière mise à jour.
- L'environnement de développement ne doit jamais être proposé à l'indexation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le site MUST proposer des mentions légales identifiant le vendeur.
- **FR-002**: Le site MUST proposer des conditions générales de vente, une politique de
  retour et de rétractation, et une politique de confidentialité.
- **FR-003**: Ces pages MUST être atteignables depuis toutes les pages du site.
- **FR-004**: Les conditions de vente et la politique de retour MUST être accessibles depuis
  le tunnel d'achat sans en faire sortir l'acheteur.
- **FR-005**: La page de contact MUST présenter les coordonnées de l'atelier et un délai de
  réponse indicatif.
- **FR-006**: Chaque page MUST porter un titre et une description qui lui sont propres.
- **FR-007**: Chaque page de produit et d'article MUST fournir un aperçu de partage
  comportant un titre, une description et une image spécifiques.
- **FR-008**: Le site MUST exposer un plan de site listant les pages publiques et les contenus
  publiés.
- **FR-009**: Le site MUST indiquer aux moteurs ce qui ne doit pas être indexé — administration,
  espace compte, tunnel d'achat, contenus non publiés.
- **FR-010**: Chaque page de produit MUST exposer ses caractéristiques commerciales sous une
  forme structurée exploitable par un moteur de recherche.
- **FR-011**: Tout champ de formulaire MUST porter une étiquette persistante.
- **FR-012**: Toute commande dont le contenu visible est une icône MUST porter un nom
  accessible.
- **FR-013**: Les champs d'authentification MUST déclarer des valeurs d'auto-remplissage
  reconnues par les gestionnaires de mots de passe.
- **FR-014**: Les commandes actionnables au doigt MUST respecter la taille de cible tactile
  minimale recommandée.
- **FR-015**: Un contenu dépublié ou supprimé MUST disparaître du plan de site.
- **FR-016**: Les pages d'information MUST indiquer leur date de dernière mise à jour.

### Key Entities

- **Page d'information** : un contenu éditorial durable et rarement modifié — mentions
  légales, conditions de vente, confidentialité, livraison et retours — portant une date de
  mise à jour.
- **Aperçu de partage** : la représentation d'une page lorsqu'elle est diffusée hors du site :
  titre, description, image.
- **Plan de site** : la liste des adresses publiques du site destinée aux moteurs, dérivée
  des contenus effectivement publiés.
- **Fiche structurée de produit** : la description normalisée d'un tambour — nom, prix,
  disponibilité, image — destinée aux moteurs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visiteur retrouve, en moins de trente secondes et depuis n'importe quelle
  page, qui vend, sous quel délai et comment retourner un article.
- **SC-002**: Le partage de n'importe quelle page de tambour ou d'article produit un aperçu
  comportant un titre spécifique, une description et une image.
- **SC-003**: Aucune page ne partage son titre avec une autre.
- **SC-004**: Les pages de produits et d'articles publiés sont toutes découvrables par un
  moteur ; aucune page d'administration, de compte ou de tunnel ne l'est.
- **SC-005**: Un tambour publié apparaît dans les résultats de recherche avec son prix et sa
  disponibilité.
- **SC-006**: Tous les formulaires sont utilisables au clavier seul et annoncés correctement
  par un lecteur d'écran.
- **SC-007**: Un gestionnaire de mots de passe reconnaît et remplit les formulaires
  d'authentification.
- **SC-008**: La boutique satisfait aux obligations d'information du commerce en ligne
  français.

## Assumptions

- Le contenu juridique — raison sociale, numéro d'immatriculation, conditions de vente,
  politique de retour — doit être fourni par le propriétaire ou son conseil. Cette
  spécification couvre l'existence, l'emplacement et l'accessibilité de ces pages, pas la
  rédaction de leur contenu juridique.
- Le site ne vise que le marché français. Les obligations d'autres juridictions sont hors
  périmètre.
- L'artisan accepte de publier des coordonnées d'atelier. Si ce n'est pas le cas, les mentions
  légales restent obligatoires et un autre moyen de contact direct doit être proposé.
- Le niveau d'accessibilité visé est la conformité aux critères usuels de niveau AA sur les
  parcours principaux, sans audit de certification.
- Les visuels d'aperçu de partage réutilisent les photographies existantes. Aucune création
  graphique n'est prévue.
- Ce travail dépend de la spécification 001 pour la langue des titres et descriptions.
