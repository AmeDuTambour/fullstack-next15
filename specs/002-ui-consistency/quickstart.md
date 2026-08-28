# Guide de validation — Cohérence de l'interface et du parcours

## Prérequis

`npm run seed -- --force` puis `npm run dev`. Comptes : `cliente@example.test` (acheteuse),
`amedutambour@gmail.com` (artisan), tous deux `123456`.

⚠️ Ne pas supprimer `.next` pendant que le serveur tourne.

## 1. Vérifications automatiques

```bash
npx tsc --noEmit && npx next lint && npm test
```

## 2. La pièce unique

| Cas | Attendu |
|---|---|
| Tambour disponible | Caractère unique signalé ; aucune commande de quantité |
| Tambour vendu | Formulé comme vendu, définitif ; une continuation proposée |
| Accessoire disponible | Quantité commandable, limitée au stock |
| Accessoire épuisé | Formulé comme temporaire |

Le seed contient les quatre cas : trois tambours à stock zéro, des accessoires en quantité.

## 3. Le langage de composants

- Relever le titre principal de six pages : un seul traitement, aucune page sans titre.
- Relever un même prix sur la fiche produit, le panier, le récapitulatif, la commande et
  l'administration : cinq fois identique, en convention française.
- Comparer l'état « publié » côté produits et côté articles : même présentation, mention
  textuelle des deux côtés.
- Comparer la grille de l'accueil et celle de la boutique à largeur égale : même nombre de
  colonnes.

## 4. Le tunnel

Ajouter un tambour au panier et dérouler jusqu'au récapitulatif. À chaque étape : le contenu du
panier reste visible, les frais de livraison sont annoncés dès le début, le délai d'expédition
est indiqué, et le total ne change pas.

Revenir à une étape franchie depuis la barre d'étapes. Vérifier qu'aucun séparateur ne suit la
dernière étape.

## 5. Le blog

Ouvrir `/blog` : une grille avec visuel, catégorie et date — pas une file de carrousels.
Ouvrir un article : sa bannière s'affiche, le texte se lit confortablement, les commentaires
sont dans l'ordre de rédaction, et une continuation est proposée en fin de lecture.

## 6. Les filtres

Sur `/search`, les filtres se distinguent visuellement comme des commandes. Le filtre actif se
voit autrement que par la graisse. Le jargon — dimensions, types de peau — est expliqué. Une
recherche par texte est accessible.

## 7. Le débordement horizontal

**Le contrôle qui a manqué la première fois.** À 390 pixels de large, sur `/`, `/search`,
`/blog` et une fiche produit :

```js
document.documentElement.scrollWidth <= window.innerWidth
```

Doit être vrai partout. Avant ce travail, la page d'accueil mesurait 634 pour 606.
