# L'Âme Du Tambour

Boutique en ligne + blog de Julien, artisan de tambours chamaniques à Mirepoix (Ariège).
Next.js 15 App Router · React 19 · Prisma 6 / Postgres Neon · NextAuth v5 · Tailwind 3 + shadcn/ui.

Le projet est en cours de **remise à niveau puis de refonte UI/UX**. Il a été écrit entre
janvier et août 2025 puis laissé dormant. Il n'est pas en ligne et n'a jamais reçu de commande :
il n'y a **aucune donnée de production à préserver**.

## Règles non négociables

### 1. Le contrat de l'API mobile est gelé

Une application mobile compagnon, **dont le code n'est pas dans ce repo et n'est pas
consultable depuis ici**, consomme :

- `POST /api/auth/login` — JWT maison signé avec `JWT_SECRET`, renvoie `{ token }`
- `GET  /api/products` — liste paginée, filtres `blocked`, `query`, `category`, `page`, `limit`
- `GET  /api/products/[identifier]` — par UUID **ou** par `codeIdentifier` (QR code scanné)
- `PATCH /api/products/[identifier]` — `{ action: "block" | "release", quantity }`
- `POST /api/products/[identifier]/block` · `/release` · `/declare-sale`

Ne jamais changer une URL, une forme de réponse, un nom de champ ou le schéma
d'authentification de ces routes. Un client qu'on ne peut ni tester ni corriger en dépend.

Corollaire : `lib/actions/product.actions.ts` est **partagé entre le web et l'API mobile**.
Tout refactor de ce fichier doit laisser les réponses des routes ci-dessus strictement
identiques, et être couvert par les tests de contrat avant d'être entamé.

Les six routes sont désormais authentifiées par `apiAuthMiddleware` (Bearer, `JWT_SECRET`).
Le seul écart restant est que ce middleware **ne vérifie pas le rôle** : y ajouter
`role === "admin"` déconnecterait l'application mobile si son compte n'est pas
administrateur. Ne pas le faire sans confirmation explicite.

### 2. Toute server action qui touche des données protégées se garde elle-même

Une server action est un endpoint POST public. Vérifier le rôle dans la page ne protège rien.
Utiliser les gardes de `lib/auth-guards.ts` :

- `requireAdmin()` — action d'administration ;
- `requireUser()` — action réservée aux membres connectés ;
- `requireOwnerOrAdmin(ownerId)` — accès à une ressource appartenant à quelqu'un ;
- `isAdmin()` — pour moduler un résultat sans refuser (prévisualisation d'un brouillon).

Elles lèvent une exception, que le `try/catch` des actions convertit en
`{ success: false, message }`.

⚠️ Ces gardes lisent la session Auth.js et ne conviennent donc pas aux fonctions appelées par
l'API mobile, qui s'authentifie par JWT : `blockProductUnit`, `releaseProductUnit` et
`declareSale` doivent rester sans garde de session — leur contrôle d'accès appartient à la
couche route.

### 3. Un seul client Prisma, et jamais dans l'Edge runtime

Toujours importer `prisma` depuis `@/db/prisma`. Ce client porte l'adapter Neon serverless et
les extensions qui convertissent les `Decimal` en `string`. Ne jamais instancier
`new PrismaClient()` ailleurs (`lib/actions/product.actions.ts` le fait encore — c'est un bug
à corriger, pas un motif à suivre). Seule exception : `db/seed.ts`, qui tourne hors de Next.

L'authentification est scindée en deux fichiers, et cette séparation doit tenir :

- `auth.config.ts` — compatible Edge, sans adapter ni base. C'est le seul que
  `middleware.ts` importe.
- `auth.ts` — configuration complète, côté Node : adapter Prisma, fournisseur
  d'identifiants, callbacks `jwt`/`session` qui touchent la base.

Importer `@/auth` depuis le middleware retirerait l'adapter Neon dans le bundle Edge.

### 3 bis. Rien ne doit exiger un secret ou la base au chargement d'un module

`next build` doit passer sans `.env` et sans base joignable — c'est vérifié. Les clients
tiers (Resend, Stripe) sont donc instanciés à l'appel, pas au niveau du module, et toute page
qui lit la base déclare `export const dynamic = "force-dynamic"`. Sans ça, un déploiement
échoue dès que Neon dort.

### 4. L'interface utilisateur est en français

Tout texte visible par un visiteur ou par l'administrateur est en français. Le code, les noms
de variables, les commits et les commentaires sont en anglais. L'existant est incohérent
(`/order/[id]` est entièrement en anglais) : corriger au passage, ne pas ajouter d'anglais.

### 4 bis. Aucun texte visible n'est écrit en dur

Tout texte affiché à un humain vient de `lib/labels/`, découpé par surface. Deux contrôles le
rendent exécutoire sur les surfaces déjà traduites — `app/(auth)`, `app/user`, `app/admin`,
`app/(root)/order`, `components/admin` :

- `react/jsx-no-literals` dans `eslint.config.mjs` interdit toute chaîne littérale dans le
  balisage ;
- `tests/no-hardcoded-labels.test.ts` couvre ce que la règle ne voit pas : les attributs
  porteurs de texte visible (`placeholder`, `aria-label`, `alt`, `title`).

Étendre la portée au fur et à mesure que d'autres surfaces sont traduites. Ni l'un ni l'autre
ne voit une chaîne passée en propriété ou construite par concaténation : ils relèvent le
plancher, ils ne scellent pas la pièce.

⚠️ Les messages des routes de `app/api/` restent en anglais : ils s'adressent à l'application
mobile, pas à un humain, et sont figés par les tests de contrat.

### 5. Les couleurs passent par les tokens du thème

Utiliser `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`,
`bg-secondary`, `border-border`… définis dans `assets/styles/globals.css` et mappés dans
`tailwind.config.ts`. Ne pas écrire `bg-gray-100`, `text-gray-700`, `bg-white`, `text-black` :
le site a un mode sombre et ces classes le cassent. L'existant en contient beaucoup
(`/about`, le footer, `/contact/success`, `order-details-table.tsx`) — c'est de la dette à
résorber, pas un exemple.

### 6. La nature d'un produit décide de son comportement

`lib/product.ts` porte la règle métier, une seule fois : un tambour est une **pièce
unique** — un exemplaire, jamais refait à l'identique — un accessoire est
**reproductible**. Il en découle le vocabulaire d'un stock à zéro (« Vendu » contre
« Momentanément épuisé »), l'existence même du sélecteur de quantité, et le maximum
commandable.

Ne jamais tester `stock > 0` directement dans un écran : appeler `getAvailability`,
`allowsQuantitySelection`, `getMaxOrderableQuantity`. La catégorie qui fait la pièce
unique est déclarée dans `UNIQUE_PIECE_CATEGORIES`, pas dispersée dans le balisage.

### 7. Les composants partagés avant la copie

Avant d'écrire un écran, regarder ce qui existe : `components/shared/` et
`components/ui/` portent les motifs déjà mutualisés. `PendingButton` (bouton et son
état d'attente), `ContentImage` (image et son repli sans débordement), `BrandLogo`,
`EmptyState`, `ImageUpload`, `StatusBadge` (tout état publié / payé / livré),
`SectionNav`, `AppShell`, `OrderSummary`, `AdminList` (ossature des listes
d'administration), `PublishFields`. Ajouter un dixième bouton d'attente à la main,
c'est en ajouter un onzième qui n'aura pas le même comportement.

**Un état n'est jamais signalé par la seule icône ni la seule couleur.** `StatusBadge`
rend toujours sa mention textuelle ; l'icône est décorative et masquée aux
technologies d'assistance.

### 8. Rôles typographiques

`.page-title` pour le titre unique de la page, `.section-title` pour les titres de
section, définis dans `assets/styles/globals.css`. Ne pas composer un titre à coups de
`text-2xl font-bold` : six écrans avaient six échelles différentes. Le corps de texte
long est limité à `max-w-[68ch]` — une ligne plus longue se relit mal.

### 9. Le contenu qui engage Julien ne s'invente pas

`lib/content/` porte ce qui doit venir de lui : le texte des pages légales
(`legal.ts`), les coordonnées de l'atelier (`workshop.ts`), l'explication du
vocabulaire du métier (`glossary.ts`). Ces modules sont vides et les écrans le
disent franchement plutôt que d'afficher un cadre creux ou une formule inventée.

Ne jamais rédiger à sa place une description de produit, une condition de vente
ou un délai. Le texte fonctionnel — « Ajouter au panier », « Vendu » — est du
ressort du code ; tout ce qui décrit l'instrument, l'atelier ou l'engagement
commercial est le sien.

### 10. Le suivi de colis se construit, il ne se saisit pas

`lib/carriers.ts` tient le référentiel des transporteurs et fabrique l'adresse
de suivi à partir de l'identifiant et du numéro. Aucun lien n'est saisi à la
main, donc aucun ne peut être mal collé. Un transporteur sans adresse de suivi
exploitable affiche le numéro sans lien — jamais un lien mort.

Le numéro est toujours rendu en entier et sélectionnable : c'est lui que
l'acheteur recopiera si le lien cesse de fonctionner. Ajouter un transporteur
se fait dans ce seul fichier.

## Commandes

⚠️ **Ne jamais supprimer `.next` pendant qu'un serveur de développement tourne.** Le serveur
continue de servir des morceaux compilés qui n'existent plus, et chaque page tombe sur
`Cannot find module './xxxx.js'`. Pour vérifier le build sans `.env`, arrêter le serveur
d'abord, puis le relancer après.

```bash
npm run dev          # serveur de dev
npm run build        # build de production
npm run lint         # eslint (next/core-web-vitals + next/typescript)
npm test             # jest
npm run seed         # npx tsx ./db/seed — REMET LA BASE À ZÉRO
npm run email        # prévisualisation des emails react-email sur :3001
npx prisma generate  # après toute modification du schéma
npx prisma migrate dev --name <nom>
```

## Architecture

```
app/(root)      vitrine + tunnel d'achat
                / · /search (boutique) · /product/[slug] · /blog · /blog/[slug] · /about · /contact
                /cart → /shipping-address → /payment-method → /place-order → /order/[id]
app/(auth)      /sign-in · /sign-up
app/user        /user/profile · /user/orders
app/admin       overview · products · orders · users · articles
                éditeurs multi-étapes : produit (base → specs → publish), article (titre → sections → publish)
app/api         nextauth · login JWT mobile · products · uploadthing · webhook stripe
lib/actions     product · order · cart · user · article — le cœur métier
lib/validators  schémas Zod, source de vérité des types de types/index.ts
prisma/schema   schéma éclaté par domaine (prismaSchemaFolder)
```

Le panier est identifié par un cookie `sessionCartId` posé dans le callback `authorized` de
`auth.ts`, et rattaché à l'utilisateur à la connexion. Les `Product` utilisent un héritage par
table : `Drum` (peau + dimensions) ou `Other` (couleur / matière / taille), jamais les deux.

## Pièges connus

- `round2()` dans `lib/utils.ts` a un parenthésage faux et arrondit à l'entier. Tant qu'il
  n'est pas corrigé, tous les totaux de panier perdent les centimes.
- `PAGE_SIZE` vaut 2 dans `lib/constants` : le `.env` le porte à 12, mais le défaut codé en
  dur reste à corriger.
- Le carrousel de la home et celui du blog tournent tous deux sur **embla**. Swiper a été
  retiré (faille critique, sans montée non cassante) : ne pas le réintroduire.
- La base de développement est **jetable** : le propriétaire a confirmé qu'aucune donnée
  n'y est importante et qu'on repart d'un catalogue neuf. `migrate reset` et `seed` sont
  donc des outils légitimes ici — mais jamais pointés ailleurs que sur la branche `dev`.
- `npm run seed` exige désormais `--force` et affiche l'hôte visé avant d'effacer quoi que
  ce soit : `npm run seed -- --force`. Il produit 40 produits (34 publiés) et 3 articles.
- Les visuels réels de l'atelier sont référencés dans `db/media.ts` : cinq tambours
  photographiés (face avant et arrière) et les bannières des trois articles. Le reste du
  catalogue est généré pour le volume et reste sans image.
- ⚠️ Les **textes** des articles seedés sont des remplissages, marqués « TEXTE DE
  REMPLISSAGE ». Ils doivent être remplacés par les mots de Julien avant toute mise en ligne.
- UploadThing est en v7 : le jeton est `UPLOADTHING_TOKEN` (JSON base64), pas la clé héritée
  `sk_live_…`. Les fichiers sont servis depuis `<appId>.ufs.sh`, autorisé dans
  `next.config.ts`. Côté client, lire `res[0].ufsUrl` — `url` et `appUrl` disparaissent en v9.
- Contrairement à ce que laissait craindre l'unique migration datée de février 2025, le
  schéma n'a **pas** dérivé : `prisma migrate diff` entre la base et le datamodel est vide,
  et la migration crée exactement les 17 modèles du schéma. Pas de `migrate reset` à faire.
- `prisma migrate` passe mal à travers le pooler PgBouncer : le schéma déclare un
  `directUrl` (`DIRECT_URL`, le même hôte sans `-pooler`). Garder les deux en phase.
- Les commentaires d'articles sont implémentés : lecture publique, écriture réservée aux
  membres connectés, suppression par l'auteur ou par un administrateur — c'est ce qui tient
  lieu de modération. Pas de commentaire sur un brouillon.
- PayPal est actif : `PAYMENT_METHODS` vaut `Stripe, PayPal, Transfer`. Le tester exige des
  identifiants sandbox (`PAYPAL_CLIENT_ID`, `PAYPAL_APP_SECRET`) ; sans eux, le bouton
  s'affiche mais la création de commande échoue.
- Les libellés des moyens de paiement vivent dans `PAYMENT_METHOD_LABELS` (`lib/constants`),
  pas en dur dans les composants.
- `.env.example` est incomplet : il manque `STRIPE_SECRET_KEY`,
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`,
  `SENDER_EMAIL`, `JWT_SECRET`, `UPLOADTHING_TOKEN`, `PAGE_SIZE`, `LATEST_PRODUCTS_LIMIT`,
  `USER_ROLES`.
