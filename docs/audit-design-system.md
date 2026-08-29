# Audit technique du design system

**Date** : 2026-08-29 · **Objet** : ce qui est dupliqué dans la couche interface, et ce qui
peut être mutualisé.

Cet audit ne porte ni sur l'esthétique ni sur l'ergonomie. Il inventorie la duplication de
code d'interface et propose les composants qui la supprimeraient.

## Méthode

Relevés par comptage sur les 111 fichiers `.tsx` du projet. Pour les comparaisons de
fichiers, le vocabulaire métier a été neutralisé avant le diff, afin de mesurer la divergence
de structure et non celle des mots.

---

## Candidats à la mutualisation, par valeur décroissante

### 1. L'ossature des écrans de liste d'administration — 3 copies

`app/admin/products`, `app/admin/orders`, `app/admin/users` répètent exactement la même
structure : titre, bandeau de filtre actif avec bouton de retrait, tableau, pagination
conditionnelle, boîte de confirmation de suppression.

| Écran | Table | Pagination | Bandeau de filtre | Suppression |
|---|---|---|---|---|
| products | 1 | 1 | 1 | 1 |
| orders | 1 | 1 | 1 | 1 |
| users | 1 | 1 | 1 | 1 |

**Composant proposé** : une enveloppe de liste d'administration recevant le titre, la requête
courante, les colonnes et les lignes. Les trois écrans se réduisent à leur définition de
colonnes.

**Gain** : le prochain écran de liste hérite du bandeau de filtre, de la pagination et de la
suppression sans les réécrire — c'est exactement ce qui manquait à `/admin/articles`, qui n'a
ni pagination, ni recherche, ni suppression.

---

### 2. Le logo clair/sombre — 8 paires dans 7 fichiers

`app/not-found.tsx`, `app/admin/layout.tsx`, `app/user/layout.tsx`, les deux pages
d'authentification, le pied de page et l'en-tête répètent tous le même bloc : deux `Image`,
l'une masquée en mode clair, l'autre en mode sombre.

**Composant proposé** : un composant de marque unique, paramétré par la variante (carré,
bandeau, sans fond) et la taille.

**Gain immédiat, et un second** : la spécification 004 supprime le mode sombre. Avec un
composant unique, cette suppression touche **un fichier au lieu de sept**.

---

### 3. Le bouton en attente — 10 réimplémentations

Dix fichiers reconstruisent le même comportement : bouton désactivé pendant le traitement,
icône de chargement en rotation, libellé qui change. Chacun avec ses propres variantes.

**Composant proposé** : un bouton de soumission portant l'état d'attente, son icône et son
libellé alternatif.

**Gain** : un seul endroit décide de quoi a l'air une action en cours. Aujourd'hui ils
divergent — certains changent le texte, d'autres non ; certains gardent l'icône, d'autres la
remplacent.

---

### 4. L'envoi d'image avec aperçu — 5 copies

Cinq formulaires répètent le bouton d'envoi, l'aperçu de l'image envoyée, la gestion d'erreur
et la suppression : les deux formulaires de publication, le formulaire produit, le formulaire
d'article et l'éditeur de section.

**Composant proposé** : un champ de formulaire d'envoi d'image, branché sur le formulaire
parent.

**Gain** : la migration vers `ufsUrl` de la semaine dernière a dû être faite cinq fois. La
prochaine évolution d'UploadThing n'en touchera qu'une.

---

### 5. Les deux formulaires de publication — 65 % identiques

`publish-product-form.tsx` et `publish-article-form.tsx` : après neutralisation du
vocabulaire, **64 lignes divergent sur 184**. Même bannière, même bascule de mise en avant,
même bascule de publication, même navigation d'étapes.

**Composant proposé** : un formulaire de publication paramétré par l'entité.

---

### 6. Les deux barres de navigation — 77 % identiques

`app/admin/main-nav.tsx` et `app/user/main-nav.tsx` : **9 lignes divergent sur 39**. Seule la
liste de liens change.

**Composant proposé** : une barre de navigation recevant ses liens.

---

### 7. Les deux enveloppes d'application — même structure

`app/admin/layout.tsx` (47 lignes) et `app/user/layout.tsx` (45 lignes) : logo, barre de
navigation, zone d'actions, conteneur de contenu. Identiques à la liste de liens près.

**Composant proposé** : une enveloppe d'application partagée.

**Gain** : c'est aussi là que vit le champ de recherche mort de l'espace compte, et la
divergence de conteneur (`container mx-auto` d'un côté, largeur pleine de l'autre).

---

### 8. L'image avec repli — 4 copies

Quatre fichiers gèrent le cas « pas d'image » avec leur propre icône, leur propre taille et
leur propre bordure : la table du panier, la liste d'articles d'administration, la carte
produit et la galerie produit.

**Composant proposé** : une image de contenu avec repli intégré.

**Gain** : la spécification 005 exige de déclarer les dimensions d'affichage sur chaque image.
Avec un composant unique, c'est un changement au lieu de quatre — et le compte réel
d'images sans dimensions déclarées est de 33.

---

### 9. L'enveloppe de champ de formulaire — 10 occurrences

`className="flex flex-col md:flex-row gap-5"` apparaît 10 fois. C'est la ligne de formulaire,
recopiée. Le formulaire d'adresse l'utilise cinq fois de suite pour un seul champ à chaque
fois, ce qui produit cinq lignes verticales là où code postal et ville devraient partager une
ligne.

**Composant proposé** : une ligne de formulaire acceptant un ou plusieurs champs.

---

## Constats connexes, hors mutualisation

- **7 occurrences** de `text-gray-700 dark:text-gray-400 hover:text-primary` dans le pied de
  page : couleurs hors référentiel de thème. Relève de la spécification 004.
- **13 fichiers** composent une `Card` à leur manière. Aucun motif dominant ne se dégage : à
  reprendre lors du travail de composition, pas maintenant.
- **Le formatage de date** est déjà centralisé et utilisé de façon cohérente : 11 appels, deux
  variantes, aucune divergence. Rien à faire.

## Ordre proposé

L'ordre suit le rapport entre le gain et le risque, pas la taille du gisement.

1. **Le bouton en attente** et **l'image avec repli** — sans risque, effet immédiat sur 14 fichiers.
2. **Le logo** — sans risque, et prépare la suppression du mode sombre.
3. **Le champ d'envoi d'image** — 5 fichiers, un peu plus de logique.
4. **La barre de navigation** et **l'enveloppe d'application** — touchent la structure des pages.
5. **L'ossature des listes d'administration** — le plus gros gain, le plus gros changement.
6. **Le formulaire de publication** — dépend du champ d'envoi d'image.

Les cinq premiers points ne changent rien de visible. C'est voulu : à ce stade il s'agit de
réduire la surface de code, pas l'apparence.
