# Phase 1 — Modèle de données

**Spécification** : [spec.md](./spec.md) · **Recherche** : [research.md](./research.md)

Aucune table, aucune colonne, aucune migration. Le modèle est celui des notions d'interface
que ce travail rend explicites — chacune existe déjà dans les données, mais aucune n'est
nommée dans le code, ce qui explique qu'elles soient traitées différemment d'un écran à l'autre.

## Entités

### Nature de produit

Détermine comment un produit se présente et se commande.

| Nature | Origine | Conséquences d'affichage |
|---|---|---|
| Pièce unique | Catégorie « tambour » | Pas de commande de quantité ; indisponible signifie **vendu**, définitif |
| Article reproductible | Toute autre catégorie | Quantité commandable dans la limite du stock ; indisponible signifie **épuisé**, temporaire |

**Règles** :
- Résolue en un seul endroit, à partir de la catégorie. Jamais déduite du stock.
- Une catégorie inconnue est traitée comme reproductible — comportement le moins destructeur,
  puisqu'il n'interdit rien et ne promet aucune rareté.

### Disponibilité

L'état commercial d'un produit, dérivé de sa nature et de son stock.

| Nature | Stock | État |
|---|---|---|
| Pièce unique | ≥ 1 | Disponible |
| Pièce unique | 0 | Vendu |
| Reproductible | ≥ 1 | Disponible, quantité limitée au stock |
| Reproductible | 0 | Épuisé |

### Rôle typographique

| Rôle | Usage |
|---|---|
| Titre de page | Exactement un par page présentant du contenu |
| Titre de section | Les subdivisions d'une page |

Le rôle remplace le choix de niveau : il n'y a plus de décision à prendre écran par écran.

### Indicateur d'état

La représentation d'un état binaire métier — payé, expédié, publié.

**Règles** : présentation identique partout ; mention textuelle toujours présente, jamais une
icône seule ; les trois écrans qui affichent « publié » et les trois qui affichent « payé »
utilisent le même composant.

### Récapitulatif de commande

La vue synthétique de ce que l'acheteur s'apprête à payer, présente aux quatre étapes du
tunnel. Résout ses propres données plutôt que de les recevoir, pour qu'il ne puisse pas
afficher un montant différent d'un écran à l'autre.

Contient : les articles avec leur visuel et leur quantité, le sous-total, les frais de
livraison, le total, et le délai d'expédition annoncé.

### Étape de parcours

Une position dans le tunnel, dans l'un de trois états : **franchie**, **courante**, **à venir**.
Une étape franchie est atteignable ; les deux autres ne le sont pas.

## Ce qui ne change pas

- Le schéma de la base. `stock` et `blockedQuantity` restent tels quels ; c'est leur
  interprétation qui devient explicite.
- Le contrat de l'API mobile, qui expose `stock` sans notion de nature — le mobile continue de
  recevoir exactement ce qu'il recevait.
