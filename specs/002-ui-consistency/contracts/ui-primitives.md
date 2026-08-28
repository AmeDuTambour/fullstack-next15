# Contrat — Primitives d'interface partagées

Ce que les écrans peuvent attendre des composants introduits par ce travail, et ce qui doit
rester vrai après.

## Récapitulatif de commande

**Garantit** : le même contenu et le même montant sur les quatre écrans du tunnel ; les frais
de livraison affichés dès le premier ; le délai d'expédition annoncé.

**Ne couvre pas** : la modification du panier, qui reste propre à l'écran panier.

**Vérification** : relever le total sur les quatre écrans ; les quatre valeurs sont identiques.

## Indicateur d'état

**Garantit** : une présentation unique pour un état binaire ; une mention textuelle toujours
présente ; une distinction visuelle entre un état favorable et un état en attente qui ne
repose pas uniquement sur la couleur.

**Ne couvre pas** : les états à plus de deux valeurs.

**Vérification** : les six écrans affichant payé, expédié ou publié rendent le même composant.

## Prix

**Garantit** : un format unique, conforme à la convention française — virgule décimale, symbole
après le montant, espace insécable.

**Vérification** : un même montant relevé sur les cinq écrans qui l'affichent apparaît cinq
fois à l'identique.

## Nature et disponibilité de produit

**Garantit** : une pièce unique n'expose jamais de commande de quantité ; un produit vendu et
un produit épuisé se distinguent par leur formulation ; la nature vient de la catégorie.

**Ne couvre pas** : la saisie côté administration, qui doit interdire séparément un stock
supérieur à un sur une pièce unique.

**Vérification** : consulter un tambour disponible, un tambour vendu, un accessoire disponible
et un accessoire épuisé ; les quatre se distinguent sans explication.

## Rôles typographiques

**Garantit** : un traitement unique par rôle sur tout le site ; exactement un titre de page par
page.

**Vérification** : relever les titres de toutes les pages ; un seul traitement apparaît, et
aucune page n'en est dépourvue.
