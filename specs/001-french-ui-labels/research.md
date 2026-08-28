# Phase 0 — Recherche

**Spécification** : [spec.md](./spec.md) · **Date** : 2026-08-28

Trois inconnues techniques à lever avant de concevoir, plus un constat qui élargit le
périmètre mesuré.

---

## Constat préalable : quatre vecteurs d'anglais, pas trois

La spécification énumère trois surfaces non traduites. Le relevé en dénombre quatre sources
distinctes, dont une qu'elle ne nommait pas.

| Vecteur | Volume mesuré | Où le visiteur le voit |
|---|---|---|
| Espace d'administration | ~140 littéraux | Écrans de gestion |
| Page de commande | ~22 littéraux | Après paiement |
| Espace compte | ~17 littéraux | Profil, historique |
| Écrans d'authentification | ~10 littéraux | Connexion, inscription |
| **Messages de validation** | **35 messages** | **Sous chaque champ de formulaire** |

Les 35 messages de validation sont **tous** en anglais. Ils s'affichent directement sous les
champs à la moindre saisie invalide, sur tous les formulaires du site — connexion, inscription,
adresse de livraison, contact, éditeurs d'administration. Deux comportent des fautes de frappe
(« at lest », « exatcly »).

C'est le vecteur le plus visible pour un visiteur, et le seul qui apparaisse **sur la vitrine**,
que la spécification décrivait pourtant comme déjà francophone. FR-001 le couvre ; la liste de
contrôle prévoyait qu'une occurrence supplémentaire entre dans le périmètre sans nouvelle
spécification.

---

## Décision 1 — Où vivent les libellés, et sous quelle forme

**Décision** : un module TypeScript ordinaire, découpé par surface, sans bibliothèque
d'internationalisation.

**Rationale** :

- La spécification pose une langue unique, sans sélecteur ni négociation. Une bibliothèque
  d'internationalisation apporte du routage par locale, de la négociation d'en-tête et un
  outillage de catalogues dont aucun ne sera utilisé.
- Le projet dispose déjà de ce mécanisme pour les moyens de paiement, jugé satisfaisant par le
  propriétaire. Étendre un motif existant coûte moins qu'en introduire un second.
- L'accès typé donne une garantie que ni un fichier JSON ni un catalogue externe ne donnent :
  une clé inexistante devient une erreur de compilation, ce qui satisfait FR-006 par
  construction plutôt que par repli à l'exécution.
- Le projet vient de ramener ses vulnérabilités de 41 à 9. Ajouter une dépendance de surface
  pour un besoin qu'une structure de données couvre est un mauvais échange.

**Alternatives considérées** :

| Option | Rejetée parce que |
|---|---|
| Bibliothèque d'internationalisation complète | Apporte routage, négociation et pluralisation pour une seule langue. Poids et surface d'attaque sans contrepartie. |
| Catalogues JSON | Perd la vérification à la compilation. Une clé absente ne se voit qu'à l'exécution. |
| Libellés en dur, sans centralisation | Contredit FR-005. C'est l'état actuel, et il se dégrade à chaque écran ajouté. |

**Réserve** : si une seconde langue devenait nécessaire, cette structure migre vers un
catalogue sans réécrire les points d'appel, puisque l'accès passe déjà par un module unique.
Le travail ne prépare pas cette évolution, il ne l'empêche pas.

---

## Décision 2 — Traduire les erreurs sans exposer de détail technique

**Décision** : la fonction de mise en forme des erreurs devient une table de correspondance.
Les formes d'erreur connues sont traduites depuis le référentiel ; tout le reste retourne un
message générique en français. Le message d'origine est journalisé côté serveur et n'est jamais
renvoyé au visiteur.

**Rationale** :

- L'implémentation actuelle se termine par un retour du message brut. C'est précisément par là
  que l'anglais de la base de données atteint des notifications françaises — et, accessoirement,
  par là qu'un détail d'implémentation peut fuir vers un visiteur.
- Un repli générique satisfait à la fois FR-004 et l'exigence de ne pas exposer de détail
  interne, sans exiger de connaître à l'avance toutes les formes d'erreur possibles.
- Les 35 messages de validation sont traduits à la source, dans les schémas eux-mêmes, plutôt
  qu'interceptés à l'affichage : ils sont déjà rédigés par champ, ce qui est plus clair qu'une
  table de correspondance générique.

**Alternatives considérées** :

| Option | Rejetée parce que |
|---|---|
| Traduire au point d'affichage | Disperse la correspondance dans chaque composant. Le prochain écran l'oubliera. |
| Table de correspondance globale pour la validation | Perd la précision par champ. « Ce champ est invalide » est moins utile que « L'adresse doit comporter au moins 3 caractères ». |
| Conserver le repli brut pour les cas inconnus | Contredit l'exigence de ne pas exposer de détail technique, et laisse la porte ouverte à l'anglais. |

---

## Décision 3 — Rendre l'anglais en dur détectable automatiquement

**Décision** : activer une règle de linting déjà disponible dans le projet, qui interdit les
chaînes littérales dans le balisage, appliquée par répertoire aux surfaces couvertes par cette
spécification.

**Rationale** :

- La règle existe dans une dépendance déjà installée, tirée par la configuration de linting du
  cadriciel. Aucune dépendance nouvelle.
- Le retour est immédiat, dans l'éditeur, au moment de l'écriture — pas à l'exécution des tests.
- Surtout, elle transforme la détection en **prévention**. La spécification demande de détecter
  l'anglais ; interdire toute chaîne littérale dans le balisage rend l'anglais structurellement
  impossible, puisque tout texte visible doit alors provenir du référentiel, qui est français.
  C'est FR-005 rendu exécutoire plutôt que recommandé.
- L'application par répertoire permet d'étendre la discipline au rythme des spécifications
  suivantes, sans imposer immédiatement 111 fichiers à reprendre.

**Alternatives considérées** :

| Option | Rejetée parce que |
|---|---|
| Greffon de linting spécialisé | Ajoute une dépendance pour une règle déjà disponible. |
| Test automatisé parcourant le balisage | Retour tardif, et un détecteur d'« anglais » par liste de mots est fragile : il laisse passer les mots communs aux deux langues et signale les noms propres. |
| Relecture humaine | Contredit SC-004, qui exige une vérification automatique. |

**Réserve honnête** : la règle ne voit pas une chaîne passée en propriété depuis un composant
parent, ni construite par concaténation. Elle relève le plancher, elle ne scelle pas la pièce.
Les cas qu'elle ne couvre pas restent du ressort de la relecture.

---

## Ce que la recherche ne tranche pas

- **Le ton des libellés d'administration.** Le rapport d'audit interrogeait la pertinence d'un
  vocabulaire de logiciel de gestion — « Tableau de bord », « Chiffre d'affaires » — pour un
  artisan seul. Traduire littéralement est le périmètre retenu ; repenser le vocabulaire relève
  d'une décision produit, pas de cette spécification.
- **Le sort des deux fautes de frappe** dans les messages de validation : elles disparaissent
  mécaniquement avec la traduction.
