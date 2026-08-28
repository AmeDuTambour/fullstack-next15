# Phase 0 — Recherche

**Spécification** : [spec.md](./spec.md) · **Date** : 2026-08-28

Six inconnues à lever. Les trois premières décident de l'ossature, les trois suivantes de
détails qui, mal tranchés, produiraient exactement l'incohérence qu'on veut supprimer.

---

## Constat préalable : l'ampleur mesurée

| Sujet | Relevé |
|---|---|
| Traitements de titre principal | 6 variantes sur 22 usages |
| Fichiers affichant un prix | 10, en 4 formats |
| Grilles de produits | 3 configurations différentes |
| Endroits interprétant le stock | 3, tous en `stock > 0` |

Les trois endroits qui interprètent le stock le font tous de la même façon — `stock > 0` — ce
qui explique pourquoi un tambour vendu et un accessoire épuisé se ressemblent : la distinction
n'existe nulle part dans le code.

---

## Décision 1 — Comment un composant sait qu'un produit est une pièce unique

**Décision** : la nature découle de la catégorie du produit, résolue en un seul endroit et
exposée comme une propriété booléenne, plutôt que déduite du stock au point d'affichage.

**Rationale** :
- Le propriétaire a tranché : les tambours sont uniques, les accessoires reproductibles. C'est
  une règle métier portée par la catégorie, pas une propriété par produit.
- Déduire de `stock === 1` serait faux : un accessoire peut légitimement n'en avoir qu'un.
- Un seul point de résolution évite que le prochain écran réinvente la règle — c'est
  exactement le mécanisme qui a produit trois formulations de statut différentes.

**Alternatives** : une colonne en base sur le produit (rejetée — la règle est celle de la
catégorie, la dupliquer par produit invite la divergence) ; une déduction au point d'affichage
(rejetée — c'est l'état actuel, et il a produit trois conventions).

**Réserve** : lier une règle à une catégorie suppose des catégories stables. Une troisième
catégorie devra déclarer sa nature, sinon elle héritera d'un comportement arbitraire.

---

## Décision 2 — Un seul format de prix

**Décision** : supprimer le composant d'affichage de prix et router tous les montants par la
fonction de formatage monétaire existante, qui produit déjà la convention française.

**Rationale** :
- Quatre formats coexistent, dont trois ne sont pas français. La fonction correcte existe déjà
  et est utilisée par une minorité d'écrans.
- Le composant actuel découpe le montant pour mettre les décimales en exposant. C'est un choix
  typographique qui produit `€ 130 . 00` — symbole avant, point décimal, décimales détachées :
  trois écarts à la convention dans un seul rendu.
- Conserver l'exposant tout en corrigeant la convention demanderait de réimplémenter un
  formateur ; passer par celui du système donne la bonne sortie sans code.

**Alternative** : corriger le composant en conservant l'exposant (rejetée — ajoute du code pour
un effet typographique que rien ne réclame, alors que l'objectif est l'homogénéité).

---

## Décision 3 — Le récapitulatif partagé du tunnel

**Décision** : un composant serveur unique, lisant le panier lui-même, inséré dans les quatre
écrans du tunnel. Il n'est pas paramétré par les données mais les résout.

**Rationale** :
- Les quatre écrans disposent déjà du panier côté serveur ; leur faire passer les données en
  propriétés multiplierait les points où la présentation peut diverger.
- Un composant qui résout ses propres données ne peut pas être affiché avec un montant
  différent d'un écran à l'autre.

**Alternative** : une disposition partagée enveloppant les quatre écrans (rejetée — le tunnel
n'est pas un segment de route commun, et en créer un déplacerait quatre pages pour un gain
identique).

---

## Décision 4 — Une échelle typographique unique

**Décision** : deux classes utilitaires — une pour le titre de page, une pour les titres de
section — définies dans la feuille de style globale, remplaçant les six traitements actuels.
Chaque page reçoit exactement un titre de page.

**Rationale** :
- Les classes `h1-bold`, `h2-bold`, `h3-bold` existent déjà mais sont choisies au jugé : la
  fiche produit utilise `h3-bold` pour son titre principal, plus petit que le titre de section
  de l'accueil.
- Nommer par le rôle plutôt que par le niveau supprime le choix : il n'y a plus de décision à
  prendre à chaque écran.

**Alternative** : conserver les trois classes en documentant leur usage (rejetée — c'est une
convention, pas une contrainte ; elle se dégradera comme la précédente).

---

## Décision 5 — Le délai d'expédition

**Décision** : une valeur unique en configuration, comme les autres réglages du site, affichée
sur la fiche produit et dans le récapitulatif.

**Rationale** :
- Ce n'est pas une donnée par produit : les tambours sont déjà fabriqués, le délai est celui de
  l'expédition, identique pour tous.
- La mettre en configuration permet à l'artisan de la modifier sans redéploiement de code, et
  garantit qu'elle est identique aux deux endroits où elle apparaît.

**À confirmer avec le propriétaire** : la valeur elle-même. La spécification ne peut pas
l'inventer.

---

## Décision 6 — Les commandes du carrousel et le débordement horizontal

**Décision** : repositionner les commandes à l'intérieur du cadre, en superposition.

**Rationale** :
- Mesuré au navigateur : la commande précédente est à 28 pixels à gauche du bord, la suivante
  entièrement hors cadre, et la page déborde latéralement de 28 pixels sur un écran de 390.
- Le positionnement extérieur suppose une marge que la disposition du site ne fournit jamais.

**Alternative** : élargir la marge du conteneur (rejetée — corrige le symptôme sur une largeur
et le déplace sur une autre).

---

## Ce que la recherche ne tranche pas

- **L'explication du jargon** — ce que change une peau de bison, ce que signifie `45x7`. C'est
  du contenu éditorial que seul l'artisan peut écrire. Le plan prévoit l'emplacement, pas le
  texte.
- **Le délai d'expédition réel**, pour la même raison.
