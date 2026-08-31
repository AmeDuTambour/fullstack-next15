# Guide de validation — Interface en français

Comment vérifier que la fonctionnalité est livrée. À dérouler après la mise en œuvre.

## Prérequis

- Base de développement peuplée : `npm run seed -- --force`
- Serveur lancé : `npm run dev`
- Un compte administrateur, dont les identifiants figurent dans les données de démonstration

## 1. Vérifications automatiques

```bash
npx tsc --noEmit      # aucune clé de libellé absente
npx next lint         # aucune chaîne littérale dans les surfaces couvertes
npm test              # le contrat de l'API mobile reste vert
```

Les trois doivent passer. La vérification de types est ce qui prouve qu'aucun libellé n'est
manquant : il n'y a pas de repli à l'exécution à tester.

## 2. Déclaration de langue

Ouvrir n'importe quelle page et inspecter la langue déclarée du document. Elle doit indiquer le
français. C'est ce que lisent les lecteurs d'écran et les moteurs de recherche.

## 3. Parcours visiteur

| Écran | À vérifier |
|---|---|
| Connexion, inscription | Aucun mot anglais, y compris sur le bouton et pendant l'envoi |
| Formulaire avec erreur | Saisir un e-mail invalide et un mot de passe trop court : les messages sous les champs sont en français |
| Inscription avec une adresse déjà utilisée | Le message nomme le champ en clair, sans terme technique |
| Panier, adresse, paiement | Aucun mot anglais |
| Page de commande | Titre, moyen de paiement, adresse, tableau, totaux et états en français |

La page de commande est le point le plus important : c'est l'écran qui a motivé le classement
en P0.

## 4. Parcours administrateur

Se connecter avec le compte administrateur et parcourir les cinq sections ainsi que les deux
éditeurs multi-étapes. Aucun titre, en-tête de colonne, bouton, état ni nom d'étape ne doit
être en anglais.

## 5. Titres de document

Ouvrir plusieurs types de page et relever le titre de l'onglet. Chacun doit être en français.
Vérifier en particulier une recherche filtrée, qui construisait son titre en anglais.

## 6. Non-régression du périmètre exclu

À vérifier explicitement, parce que c'est la contrainte que le propriétaire a posée :

- les chemins d'URL sont inchangés — `/search`, `/cart`, `/admin/products` répondent toujours ;
- les valeurs stockées en base sont inchangées — les moyens de paiement enregistrés valent
  toujours `Stripe`, `PayPal`, `Transfer` ;
- une commande passée avant le travail s'affiche toujours correctement.

## 7. Vérification de la garantie anti-régression

Ajouter volontairement un texte anglais en dur dans un composant d'une surface couverte, puis
lancer le linting. Il doit échouer. Retirer la modification.

C'est le seul contrôle qui prouve SC-004 : sans lui, on a traduit une fois, sans garantie pour
la suite.
