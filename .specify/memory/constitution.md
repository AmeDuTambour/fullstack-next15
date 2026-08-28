<!--
Sync Impact Report
==================
Version : (aucune) → 1.0.0
Motif   : première constitution effective. Le fichier ne contenait que le
          gabarit non renseigné ; tous les articles sont nouveaux, d'où un
          MINOR/MAJOR initial fixé à 1.0.0.

Principes ajoutés
  I.   Le contrat de l'API mobile est gelé (NON NÉGOCIABLE)
  II.  Chaque server action se garde elle-même
  III. Le build ne dépend d'aucun secret ni d'aucune base
  IV.  Une correction de comportement s'accompagne du test qui l'aurait attrapée
  V.   L'interface est en français et passe par les tokens du thème

Sections ajoutées
  Contraintes techniques
  Flux de travail
  Gouvernance

Principes modifiés   : aucun (création)
Sections supprimées  : aucune
Report différé       : aucun ; toutes les dates sont connues.

Origine : ces articles ne sont pas des intentions. Ils décrivent des règles
déjà appliquées et vérifiables dans le dépôt, établies par les phases 00 à 03
et consignées dans CLAUDE.md.
-->

# Constitution de L'Âme Du Tambour

Boutique en ligne et blog de l'atelier de tambours chamaniques de Mirepoix.
Next.js 15, Prisma sur Neon, Auth.js. Le site sert deux clients : un navigateur
et une application mobile qui ne vit pas dans ce dépôt.

## Core Principles

### I. Le contrat de l'API mobile est gelé (NON NÉGOCIABLE)

Une application mobile consomme `/api/auth/login` et les cinq routes
`/api/products*`. Son code n'est pas dans ce dépôt et n'est pas consultable
depuis lui.

- Une URL, une forme de réponse, un nom de champ ou un schéma d'authentification
  de ces routes ne PEUT PAS changer sans décision explicite du propriétaire.
- `lib/actions/product.actions.ts` est partagé entre le web et le mobile. Tout
  refactor le traversant DOIT être précédé de tests de contrat qui passent, et
  les laisser passer ensuite.
- Une modification volontaire du contrat DOIT se traduire par un changement
  visible dans `tests/api-mobile-contract.test.ts` et dans `docs/api-mobile.md`.

*Rationale* : un client qu'on ne peut ni tester ni corriger se casse en silence.
Le test est le seul avertisseur disponible.

### II. Chaque server action se garde elle-même

Une server action est un endpoint POST public. Vérifier les droits dans la page
appelante ne protège rien.

- Toute action touchant des données protégées DOIT appeler une garde de
  `lib/auth-guards.ts` : `requireAdmin`, `requireUser` ou `requireOwnerOrAdmin`.
- Une lecture publique NE DOIT JAMAIS exposer de contenu non publié. Un
  administrateur garde la prévisualisation ; un visiteur reçoit un « introuvable ».
- Les gardes lisent la session Auth.js. Elles NE CONVIENNENT PAS aux fonctions
  appelées par l'API mobile, qui s'authentifie par jeton : le contrôle d'accès y
  appartient à la couche route.

*Rationale* : trois fuites réelles ont été trouvées sous cette forme — commandes
d'autrui, brouillons de produits, brouillons d'articles.

### III. Le build ne dépend d'aucun secret ni d'aucune base

`next build` DOIT aboutir sans fichier `.env` et sans base joignable.

- Aucun client tiers (Resend, Stripe, PayPal) ne PEUT être instancié au
  chargement d'un module : l'instanciation se fait à l'appel.
- Toute page lisant la base DOIT déclarer `dynamic = "force-dynamic"` plutôt que
  d'être prérendue.
- Le client Prisma est unique, importé depuis `@/db/prisma`, et NE DOIT JAMAIS
  entrer dans le bundle Edge. `middleware.ts` n'importe que `auth.config.ts`.

*Rationale* : un déploiement ne doit pas échouer parce qu'une base gratuite
dormait, ni parce qu'une clé manquait au moment de la compilation.

### IV. Une correction de comportement s'accompagne du test qui l'aurait attrapée

- Corriger un calcul, un contrat ou une règle d'accès EXIGE un test qui échouait
  avant la correction.
- Un écart connu mais volontairement non fermé DOIT être figé par un test qui
  passe en constatant l'état actuel, avec la raison de l'attente en commentaire.
  Ce test bascule le jour où l'écart est fermé.
- La suite complète DOIT être verte avant tout commit.

*Rationale* : `round2` arrondissait à l'euro entier depuis l'origine sans que
rien ne le signale. Un écart non figé est un écart qu'on redécouvre par accident.

### V. L'interface est en français et passe par les tokens du thème

- Tout texte vu par un visiteur ou par l'administrateur est en français. Le code,
  les noms de variables et les commits sont en anglais.
- Les couleurs viennent des tokens définis dans `assets/styles/globals.css`.
  Écrire `bg-gray-100`, `text-gray-700`, `bg-white` ou `text-black` est INTERDIT :
  le site a un mode sombre et ces classes le cassent.
- Une valeur affichée à l'utilisateur (libellé de moyen de paiement, statut) est
  centralisée, jamais reconstruite par un ternaire dans un composant.

*Rationale* : l'existant mélange les deux langues et casse le mode sombre sur
cinq écrans. Chaque passage doit réduire cette dette, jamais l'augmenter.

## Contraintes techniques

**Données.** La base de développement est jetable et ne contient aucune donnée
de valeur. `npm run seed` est destructif : il affiche l'hôte visé et exige
`--force`. Il NE DOIT JAMAIS viser autre chose que la branche `dev` de Neon.
Les migrations passent par `DIRECT_URL`, l'application par `DATABASE_URL`.

**Médias.** UploadThing est en v7 : le jeton est `UPLOADTHING_TOKEN`, un JSON
encodé en base64 — pas la clé héritée `sk_live_…`. Les fichiers sont servis
depuis `<appId>.ufs.sh`, autorisé dans `next.config.ts`. Côté client, lire
`res[0].ufsUrl` ; `url` et `appUrl` disparaissent en v9.

**Contenu de démonstration.** Les visuels du seed sont ceux de l'atelier. Les
textes d'articles sont des remplissages, marqués comme tels, et NE DOIVENT PAS
être publiés en l'état. Aucun texte ne peut être attribué à l'artisan sans qu'il
l'ait écrit.

**Secrets.** `.env` n'entre jamais dans git. Toute variable ajoutée l'est aussi,
à vide, dans `.env.example`. Aucun mot de passe n'est saisi dans un formulaire
par un agent, y compris sur une base jetable.

## Flux de travail

- Le travail se fait sur une branche, jamais sur `main`.
- Avant tout commit, ces quatre vérifications DOIVENT passer : `npx tsc --noEmit`,
  `npx next lint`, `npm test`, et `next build` sans `.env`.
- Les messages de commit sont en anglais, au format conventionnel, et expliquent
  la conséquence du défaut corrigé — pas seulement le geste.
- Un changement touchant l'API mobile met à jour `docs/api-mobile.md` dans le
  même commit.
- Une règle nouvellement établie est consignée dans `CLAUDE.md`, qui sert de
  guide d'exécution au quotidien.

## Governance

Cette constitution prime sur les habitudes et sur le style de l'existant. Un
morceau de code hérité qui la contredit est de la dette à résorber, jamais un
motif à suivre.

**Amendement.** Un article ne se modifie qu'à la demande explicite du
propriétaire du projet, ou après qu'un fait vérifié dans le dépôt l'a contredit.
Tout amendement met à jour la version, la date, et le rapport d'impact en tête de
fichier.

**Versionnage.** MAJOR pour la suppression ou la redéfinition incompatible d'un
article ; MINOR pour un ajout ou un élargissement substantiel ; PATCH pour une
clarification sans effet sur le fond.

**Conformité.** Les quatre vérifications du flux de travail sont le contrôle
automatique. Le reste — gardes d'autorisation, contrat mobile, tokens de thème —
se vérifie à la relecture, et tout écart constaté est soit corrigé, soit figé par
un test avec sa raison.

**Version**: 1.0.0 | **Ratified**: 2026-08-28 | **Last Amended**: 2026-08-28
