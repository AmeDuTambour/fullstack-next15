# Phase 1 — Modèle de données

**Spécification** : [spec.md](./spec.md) · **Recherche** : [research.md](./research.md)

Cette fonctionnalité n'introduit ni table, ni colonne, ni migration. Son modèle est celui des
libellés d'interface, qui vivent dans le code et non en base.

## Entités

### Libellé d'interface

Un texte destiné à un humain, atteint par une clé stable.

| Attribut | Description | Règle |
|---|---|---|
| Clé | Identifiant de lecture, en anglais | Stable, unique dans sa surface. Ne change jamais pour une raison de rédaction. |
| Valeur | Texte français affiché | Peut être révisée sans toucher aux points d'appel. |
| Surface | Regroupement d'appartenance | Une surface par domaine fonctionnel, alignée sur la navigation du site. |

**Règles de validation** :

- Une clé demandée mais absente est une erreur détectée avant exécution, pas un repli
  silencieux. C'est ce qui satisfait FR-006 sans code de repli.
- Une valeur ne contient jamais de contenu saisi par l'administrateur.
- Les valeurs paramétrables — celles comportant un nombre, un nom, un montant — déclarent
  explicitement leurs paramètres, plutôt que d'être assemblées par concaténation au point
  d'appel.

### Surface

Un regroupement de libellés correspondant à un domaine de l'interface. Le découpage suit la
navigation réelle plutôt qu'une classification abstraite, pour qu'un développeur cherchant le
libellé d'un écran sache où regarder.

| Surface | Contenu |
|---|---|
| Commun | Actions et états partagés par plusieurs écrans |
| Boutique | Catalogue, fiche produit, filtres |
| Commande | Panier, tunnel d'achat, page de commande |
| Compte | Profil, historique |
| Administration | Tableaux, éditeurs, actions de gestion |
| Erreurs | Messages d'échec présentés au visiteur |

### Correspondance d'erreur

L'association entre une forme d'erreur technique et le message français correspondant.

| Attribut | Description |
|---|---|
| Forme reconnue | Le motif d'erreur identifiable — validation, contrainte d'unicité, autorisation |
| Message | Le texte français présenté au visiteur |
| Repli | Message générique unique, utilisé pour toute forme non reconnue |

**Règles** :

- Le message d'origine n'est jamais transmis au visiteur. Il est journalisé côté serveur.
- Le repli ne varie pas selon l'erreur : un visiteur ne doit pas pouvoir déduire la nature
  d'un échec interne à partir de nuances de formulation.

## Ce qui n'est pas un libellé

Trois catégories sont explicitement hors du modèle, conformément à FR-008 et FR-009.

| Catégorie | Exemples | Traitement |
|---|---|---|
| Chemin d'URL | `/search`, `/admin/products` | Inchangé, en anglais |
| Identifiant stocké | Valeurs de moyen de paiement, rôles, noms de catégories techniques | Inchangés en base ; seul leur libellé d'affichage est traduit |
| Donnée métier | Nom de produit, titre d'article, description | Affichée telle quelle, jamais traduite |

La distinction entre un identifiant stocké et son libellé d'affichage existe déjà dans le
projet pour les moyens de paiement. Elle est généralisée, pas inventée.

## Transitions d'état

Aucune. Les libellés sont des données statiques, résolues à la compilation.
