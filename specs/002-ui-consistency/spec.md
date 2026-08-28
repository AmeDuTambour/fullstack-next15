# Feature Specification: Cohérence de l'interface et du parcours d'achat

**Feature Branch**: `refacto/foundation`

**Created**: 2026-08-28

**Status**: Draft

**Input**: Audit Impeccable du 2026-08-28 — problèmes P1 (cohérence) et P2 (tunnel, éditorial). Heuristique 4 « Cohérence et standards » notée 1/4.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Marie garde son tambour sous les yeux jusqu'au paiement (Priority: P1)

Marie ajoute un tambour à 290 € au panier et commence la commande. Dès l'écran suivant, son
tambour disparaît : elle saisit une adresse complète sur une page qui ne montre ni le produit,
ni le montant, ni les frais de livraison. Elle découvre le coût de la livraison à la dernière
étape, après avoir tout renseigné. Aucun délai d'expédition n'est annoncé nulle part — pour un
achat à 290 € chez un artisan qu'elle ne connaît pas, c'est pourtant sa première question.

**Why this priority**: C'est le point d'abandon classique du commerce en ligne, et il touche
directement le chiffre d'affaires.

**Independent Test**: Dérouler le tunnel complet et vérifier qu'à chaque étape le contenu du
panier, le montant courant et les frais restent visibles. Livrable seul.

**Acceptance Scenarios**:

1. **Given** un panier non vide, **When** l'acheteur passe d'une étape du tunnel à la
   suivante, **Then** le récapitulatif du panier reste visible sans action de sa part.
2. **Given** un acheteur au tout début du tunnel, **When** il regarde le récapitulatif,
   **Then** les frais de livraison applicables lui sont annoncés avant qu'il ne saisisse la
   moindre donnée personnelle.
3. **Given** un acheteur qui consulte un tambour ou son panier, **When** il cherche à savoir
   sous quel délai il sera livré, **Then** le délai d'expédition annoncé lui est présenté.
4. **Given** un acheteur qui vient de valider sa commande, **When** il arrive sur la
   confirmation, **Then** il voit la même page de remerciement quel que soit le moyen de
   paiement choisi, avec un message adapté à ce moyen.

---

### User Story 2 - Le tambour se présente comme la pièce unique qu'il est (Priority: P1)

Le catalogue contient deux natures de produits, et l'interface les confond. Un **tambour** est
un objet unique, déjà fabriqué, existant en un seul exemplaire : vendu, il ne revient pas. Un
**accessoire** existe au contraire en plusieurs exemplaires et se réapprovisionne normalement.

Aujourd'hui les deux sont traités comme des références de catalogue reproductibles : le panier
propose d'augmenter la quantité y compris pour un tambour, la fiche affiche « En stock » comme
s'il y avait un réassort, et un tambour vendu s'annonce « Stock épuisé » — formule qui laisse
croire qu'il reviendra.

**Why this priority**: C'est la nature même du produit, et l'argument qui justifie le prix. Une
interface qui le présente comme un article de série efface ce qui le rend désirable, et promet
implicitement un réapprovisionnement qui n'arrivera jamais.

**Independent Test**: Consulter un tambour disponible, un tambour vendu, puis un accessoire,
et vérifier que l'interface ne suggère jamais un second exemplaire d'un tambour, tout en
laissant commander plusieurs accessoires.

**Acceptance Scenarios**:

1. **Given** un tambour disponible, **When** l'acheteur consulte sa fiche, **Then** son
   caractère unique lui est signalé explicitement.
2. **Given** un tambour dans le panier, **When** l'acheteur regarde la ligne correspondante,
   **Then** aucune commande ne lui propose d'en ajouter un second exemplaire.
3. **Given** un tambour déjà vendu, **When** un visiteur atteint sa fiche, **Then** il apprend
   que cette pièce est vendue, sans laisser entendre qu'elle sera réapprovisionnée.
4. **Given** un tambour vendu, **When** un visiteur consulte sa fiche, **Then** une
   continuation lui est proposée vers les pièces encore disponibles.
5. **Given** un accessoire disponible en plusieurs exemplaires, **When** l'acheteur l'ajoute au
   panier, **Then** il peut en demander plusieurs, dans la limite du stock.
6. **Given** un accessoire momentanément indisponible, **When** un visiteur consulte sa fiche,
   **Then** l'indisponibilité est formulée comme temporaire, à la différence d'un tambour vendu.

---

### User Story 3 - Le site donne l'impression d'avoir été fait par une seule main (Priority: P1)

Aujourd'hui le titre principal change de taille selon la page — celui de la fiche produit est
plus petit que le titre d'une section de l'accueil. Six pages n'ont aucun titre principal. Les
prix s'affichent dans quatre formats différents selon l'écran, dont trois ne suivent pas la
convention française. L'état « payé » se présente tantôt comme une pastille colorée, tantôt
comme du texte brut, tantôt comme une icône sans légende. Les grilles de produits changent de
nombre de colonnes d'une page à l'autre.

**Why this priority**: C'est la demande explicite du propriétaire. Un visiteur ne verbalise
pas l'écart de taille entre deux titres ; il ressent que le site n'est pas fini.

**Independent Test**: Relever sur chaque page le traitement du titre principal, du prix et de
l'état, et vérifier qu'un même rôle reçoit partout le même traitement.

**Acceptance Scenarios**:

1. **Given** deux pages quelconques du site, **When** on compare leurs titres principaux,
   **Then** ils partagent le même traitement visuel.
2. **Given** une page présentant du contenu, **When** on en inspecte la structure,
   **Then** elle comporte exactement un titre principal.
3. **Given** un même prix, **When** il est affiché sur la fiche produit, dans le panier, au
   récapitulatif, sur la commande et dans l'administration, **Then** il apparaît dans un
   format identique, conforme à la convention française.
4. **Given** un état binaire — payé, livré, publié — **When** il est affiché n'importe où,
   **Then** il utilise la même présentation et comporte toujours une mention textuelle, jamais
   une icône seule.
5. **Given** une grille de produits, **When** elle est affichée sur l'accueil ou dans la
   boutique, **Then** elle adopte le même nombre de colonnes à largeur d'écran égale.

---

### User Story 4 - L'acheteur sait toujours où il en est dans sa commande (Priority: P2)

La barre d'étapes affiche quatre puces, mais seule l'étape courante se distingue : rien ne
sépare une étape franchie d'une étape à venir, et un séparateur orphelin s'affiche après la
dernière. Les étapes déjà validées ne sont pas cliquables : revenir en arrière passe par le
bouton du navigateur.

**Why this priority**: Renforce la story 1 sans la conditionner. Moins coûteux qu'un abandon,
mais c'est de la charge mentale gratuite à un moment tendu.

**Independent Test**: Parcourir le tunnel et vérifier qu'à chaque étape les trois états —
franchie, courante, à venir — sont distinguables, et que le retour est possible sans le
navigateur.

**Acceptance Scenarios**:

1. **Given** un acheteur à une étape du tunnel, **When** il regarde la barre de progression,
   **Then** il distingue les étapes franchies, l'étape courante et celles à venir.
2. **Given** un acheteur à une étape avancée, **When** il veut corriger une information
   saisie plus tôt, **Then** il peut revenir à l'étape concernée depuis la barre.
3. **Given** la dernière étape du parcours, **When** la barre est affichée,
   **Then** aucun séparateur ne la suit.

---

### User Story 5 - Thomas lit un article jusqu'au bout, puis va voir les tambours (Priority: P2)

Le blog présente une file de carrousels, un par catégorie — dont un carrousel pour un article
unique. Les commandes de défilement sont positionnées hors du cadre : sur mobile elles sont
hors écran, et la page déborde latéralement de 28 pixels. L'article lui-même n'affiche pas la
bannière que l'accueil promettait, son texte est intégralement en italique et justifié, et il
ne mène nulle part : ni article suivant, ni retour au blog, ni lien vers les tambours.

**Why this priority**: Le contenu éditorial est la meilleure preuve du savoir-faire, donc le
meilleur argument de vente. Il est aujourd'hui pénible à parcourir et sans issue.

**Independent Test**: Parcourir le blog et un article de bout en bout sur mobile et sur
grand écran.

**Acceptance Scenarios**:

1. **Given** un visiteur sur la liste des articles, **When** il la parcourt,
   **Then** chaque article est présenté avec son visuel, sa catégorie et sa date, sans
   dépendre d'un défilement horizontal.
2. **Given** un visiteur sur mobile, **When** il consulte n'importe quelle page du site,
   **Then** la page ne défile jamais latéralement.
3. **Given** un lecteur arrivé au bout d'un article, **When** il cherche la suite,
   **Then** il se voit proposer au moins un prolongement vers le catalogue ou vers un autre
   article.
4. **Given** un article comportant un visuel principal, **When** il est ouvert,
   **Then** ce visuel est affiché.
5. **Given** un article long, **When** il est lu, **Then** le corps du texte est présenté dans
   une forme confortable pour la lecture continue.
6. **Given** un fil de commentaires, **When** il est affiché, **Then** les commentaires se
   lisent dans l'ordre où ils ont été écrits.

---

### User Story 6 - Marie comprend et utilise les filtres de la boutique (Priority: P2)

La boutique propose vingt filtres affichés comme du texte noir sur fond crème, sans
soulignement, sans cadre, sans état de survol. Seul un caractère gras signale le filtre actif.
Rien n'indique qu'ils sont cliquables. Et les valeurs elles-mêmes sont du jargon : `45x7` sans
unité ni explication, six types de peau sans indication de ce qu'ils changent au son. La
recherche par texte est absente de la vitrine.

**Why this priority**: Une acheteuse qui ne peut pas filtrer ne compare pas, et n'achète pas.

**Independent Test**: Confier à quelqu'un qui n'a jamais tenu de tambour la tâche de trouver
un instrument correspondant à un besoin, et observer s'il utilise les filtres.

**Acceptance Scenarios**:

1. **Given** un visiteur sur la boutique, **When** il regarde les filtres,
   **Then** ils sont visuellement identifiables comme des commandes actionnables.
2. **Given** un filtre actif, **When** le visiteur regarde la liste, **Then** l'état actif est
   signalé autrement que par la seule graisse du texte, et se retire en une action.
3. **Given** un visiteur non initié, **When** il consulte les filtres de dimensions et de
   peaux, **Then** il dispose d'une explication de ce que ces valeurs signifient.
4. **Given** un visiteur qui cherche un produit par son nom, **When** il est sur la vitrine,
   **Then** une recherche par texte lui est accessible.

---

### Edge Cases

- Un panier vide dans le récapitulatif latéral doit afficher un état lisible, pas un bloc vide.
- Un produit sans photo doit occuper la même surface qu'un produit avec photo, sans creuser un
  grand vide dans la grille.
- Une catégorie d'articles ne contenant qu'un seul élément ne doit pas être présentée comme
  une collection à parcourir.
- Un article sans visuel principal doit rester lisible sans laisser d'espace mort.
- Un titre de produit très long ne doit pas casser l'alignement de la grille.
- Le délai de fabrication doit rester exact si l'artisan le modifie : il ne peut pas être figé
  dans plusieurs endroits différents.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le récapitulatif de commande MUST rester visible à chaque étape du tunnel
  d'achat, du panier jusqu'à la validation.
- **FR-002**: Les frais de livraison applicables MUST être annoncés avant toute saisie de
  données personnelles.
- **FR-003**: Le délai d'expédition annoncé MUST être visible depuis la fiche produit et
  depuis le panier, et MUST provenir d'une source unique.
- **FR-003b**: Un tambour MUST être présenté comme un exemplaire unique : aucune commande ne
  MUST permettre d'en demander plusieurs, et son indisponibilité MUST être formulée comme une
  vente définitive.
- **FR-003c**: Un accessoire MUST rester commandable en plusieurs exemplaires dans la limite de
  son stock, et son indisponibilité MUST être formulée comme temporaire.
- **FR-003d**: Un tambour MUST ne jamais pouvoir porter plus d'un exemplaire disponible, y
  compris lorsqu'il est saisi depuis l'espace d'administration.
- **FR-004**: Toutes les commandes MUST aboutir à une page de confirmation unique, dont le
  message s'adapte au moyen de paiement.
- **FR-005**: Un même rôle typographique MUST recevoir un traitement identique sur toutes les
  pages.
- **FR-006**: Chaque page présentant du contenu MUST comporter exactement un titre principal.
- **FR-007**: Un montant MUST s'afficher dans un format unique et conforme à la convention
  française, sur l'ensemble du site.
- **FR-008**: Un état binaire MUST être présenté de façon identique partout et MUST toujours
  comporter une mention textuelle.
- **FR-009**: Les grilles de produits MUST adopter le même nombre de colonnes à largeur
  d'écran égale.
- **FR-010**: La barre d'étapes MUST distinguer les étapes franchies, courante et à venir, et
  MUST permettre de revenir à une étape franchie.
- **FR-011**: Aucune page MUST défiler latéralement, à aucune largeur d'écran supportée.
- **FR-012**: La liste des articles MUST présenter chaque article avec son visuel, sa
  catégorie et sa date, sans imposer de défilement horizontal.
- **FR-013**: Un article MUST afficher son visuel principal lorsqu'il en possède un, et MUST
  proposer au moins un prolongement en fin de lecture.
- **FR-014**: Les commentaires d'un article MUST être présentés dans leur ordre de rédaction.
- **FR-015**: Les filtres de la boutique MUST être visuellement identifiables comme
  actionnables et MUST signaler leur état actif autrement que par la graisse du texte.
- **FR-016**: Les valeurs de filtre relevant du jargon métier MUST être accompagnées d'une
  explication accessible depuis la boutique.
- **FR-017**: Une recherche par texte MUST être accessible depuis la vitrine.
- **FR-018**: Les états vides MUST être rédigés de façon cohérente et MUST proposer une action
  de sortie.

### Key Entities

- **Récapitulatif de commande** : la vue synthétique de ce que l'acheteur s'apprête à payer —
  articles, quantités, sous-total, frais, total. Présente à toutes les étapes du tunnel.
- **Étape de parcours** : une position dans le tunnel, dans l'un de trois états — franchie,
  courante, à venir.
- **Indicateur d'état** : la représentation d'un état binaire métier — payé, livré, publié —
  toujours accompagnée de sa mention textuelle.
- **Délai d'expédition** : la durée annoncée entre la commande et l'envoi. Valeur unique,
  affichée à plusieurs endroits.
- **Pièce unique** : un tambour, existant en un seul exemplaire déjà fabriqué. Disponible ou
  vendu — jamais réapprovisionné.
- **Article reproductible** : un accessoire, existant en plusieurs exemplaires et
  réapprovisionnable. Disponible en quantité, ou temporairement épuisé.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un acheteur peut dérouler le tunnel complet sans jamais perdre de vue ce qu'il
  achète ni le montant qu'il va payer.
- **SC-002**: Le montant total qu'un acheteur voit à la première étape est celui qu'il paie à
  la dernière, hors modification de son panier.
- **SC-003**: Aucune page ne défile latéralement, à aucune largeur entre 320 et 1920 pixels.
- **SC-004**: Un même prix, relevé sur les cinq écrans qui l'affichent, apparaît cinq fois à
  l'identique.
- **SC-005**: Un relevé des titres principaux de toutes les pages ne fait apparaître qu'un
  seul traitement, et aucune page n'en est dépourvue.
- **SC-006**: Une personne n'ayant jamais tenu de tambour peut, sans aide, filtrer le
  catalogue et expliquer ce que le filtre a changé.
- **SC-007**: Un lecteur arrivé au bout d'un article dispose toujours d'au moins une
  destination proposée.
- **SC-008**: Le taux d'abandon entre l'ajout au panier et la validation diminue.
- **SC-009**: Aucun écran ne laisse penser qu'un tambour vendu pourrait redevenir disponible,
  ni qu'un second exemplaire pourrait être commandé.
- **SC-010**: Un accessoire reste commandable en plusieurs exemplaires, et la distinction entre
  une pièce vendue et un article temporairement épuisé est lisible sans explication.

## Assumptions

- Les tambours vendus sont déjà fabriqués et existent en un seul exemplaire : il n'y a pas de
  fabrication à la commande, donc pas de délai de fabrication. Seul le délai d'expédition est
  à annoncer, et l'artisan peut le fournir.
- Les accessoires existent en plusieurs exemplaires et se réapprovisionnent : le propriétaire
  l'a confirmé le 2026-08-28. La distinction est donc portée par la catégorie du produit, et
  non par une propriété saisie au cas par cas.
- Le catalogue ne comporte aujourd'hui que ces deux catégories. Une catégorie ajoutée plus tard
  devra déclarer laquelle des deux natures elle suit.
- Le récapitulatif latéral est adapté aux grands écrans. Sur mobile, une forme repliée ou
  résumée est acceptable tant que le montant reste visible.
- L'explication du jargon — dimensions, types de peau — n'exige pas de nouvelle donnée en
  base : elle peut être éditoriale.
- La recherche par texte porte sur les produits. L'étendre aux articles est hors périmètre.
- Les trois moyens de paiement restent en place. L'unification porte sur la page de
  confirmation, pas sur l'offre de paiement.
- Ce travail ne change ni la palette ni les tokens de couleur : il porte sur la structure, la
  typographie, la disposition et les composants. La couleur relève de la spécification 004.
- Les libellés produits par ce travail sont en français et passent par le référentiel central
  établi par la spécification 001, dont il dépend.
