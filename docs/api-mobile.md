# Contrat de l'API mobile

Ce document décrit ce que l'API renvoie **aujourd'hui**, pas ce qu'elle devrait
renvoyer. Il est le pendant lisible de `tests/api-mobile-contract.test.ts`, qui
vérifie chacun des points ci-dessous par HTTP contre un vrai serveur Next.

L'application mobile qui consomme cette API n'est pas dans ce dépôt et n'est pas
consultable depuis ici. Le contrat est donc **gelé** : toute modification doit
être délibérée, refléter un changement dans les tests, et être coordonnée avec
une mise à jour du client.

## Authentification

L'API mobile n'utilise pas les sessions Auth.js du site. Elle a son propre
circuit, à jeton porteur.

### `POST /api/auth/login`

Seule route publique. Corps `{ email, password }`.

| Cas | Réponse |
| --- | --- |
| Identifiants valides | `200` · `{ "token": "<JWT>" }` |
| Mot de passe faux | `401` · `{ "message": "Invalid credentials" }` |
| Adresse inconnue | `401` · `{ "message": "Invalid credentials" }` |
| `JWT_SECRET` absent | `500` · `{ "message": "Server Error" }` |

Les deux cas d'échec renvoient le même corps : l'API ne révèle pas si une
adresse est inscrite.

Le jeton est un JWT **HS256** signé avec `JWT_SECRET`, de charge utile
`{ userId, email }` et de validité **30 jours**. Il est émis par
`jsonwebtoken`, indépendamment d'Auth.js.

### Routes protégées

`apiAuthMiddleware` (`app/middlewares/apiAuthMiddleware.ts`) extrait le jeton via
`getToken({ raw: true })` d'Auth.js, qui lit **d'abord le cookie de session**
puis, à défaut, l'en-tête `Authorization`. Le client mobile emprunte la seconde
branche :

```
Authorization: Bearer <token>
```

`raw: true` ne vérifie rien — le middleware appelle ensuite lui-même
`jwt.verify(token, JWT_SECRET)`.

| Cas | Réponse |
| --- | --- |
| Aucun jeton | `401` · `{ "message": "Not authenticated" }` |
| Jeton signé avec un autre secret | `401` |
| Jeton valide | la route s'exécute |

**Toutes** les routes produits sont protégées : `GET /api/products`,
`GET`/`PATCH /api/products/[identifier]`, ainsi que `block`, `release` et
`declare-sale`, qui ne l'étaient pas jusqu'à la phase 02.

## Produits

### `GET /api/products`

Paramètres de requête, tous optionnels :

| Paramètre | Défaut | Effet |
| --- | --- | --- |
| `query` | `""` | filtre sur le nom, insensible à la casse |
| `category` | `""` | filtre sur le nom de la catégorie |
| `blocked` | `false` | `true` ne retourne que les produits à `blockedQuantity > 0` |
| `page` | `1` | page demandée |
| `limit` | `10` | taille de page |

Enveloppe de réponse, aux quatre clés stables :

```json
{
  "data": [ /* produits */ ],
  "currentPage": 1,
  "totalPages": 4,
  "totalCount": 40
}
```

Chaque produit porte les colonnes du modèle `Product`, plus :

- `price` — **une chaîne**, jamais un nombre (`"123.45"`). Le `Decimal` Prisma
  est converti explicitement.
- `category` — l'objet `ProductCategory` complet.
- `specifications` — l'objet `Drum` (avec `skinType` et `dimensions` résolus)
  pour un tambour, l'objet `Other` pour le reste, `null` si aucun des deux.
- `stock` et `blockedQuantity` — des entiers.
- `codeIdentifier` — la valeur encodée dans le QR code collé sur l'objet.

### `GET /api/products/[identifier]`

`identifier` est résolu de deux façons, selon sa forme :

- s'il a la forme d'un **UUID**, recherche par `id` ;
- sinon, recherche par **`codeIdentifier`** — c'est le cas du scan de QR code.

| Cas | Réponse |
| --- | --- |
| Trouvé | `200` · le produit (mêmes règles de sérialisation que ci-dessus) |
| Introuvable | `404` · `{ "error": "Product not found" }` |

## Stock : réservation, libération, vente

Le stock se répartit en deux compteurs sur `Product` :

- `stock` — unités disponibles à la vente ;
- `blockedQuantity` — unités réservées, retirées du stock mais pas encore vendues.

Réserver déplace de `stock` vers `blockedQuantity`. Libérer fait l'inverse. La
somme des deux ne change qu'à la vente.

### `PATCH /api/products/[identifier]`

Ici `identifier` doit être l'`id`. Corps `{ action, quantity }`.

| Cas | Effet | Réponse |
| --- | --- | --- |
| `action: "block"` | `stock -= q`, `blockedQuantity += q` | `200` · le produit à jour |
| `action: "release"` | `stock += q`, `blockedQuantity -= q` | `200` · le produit à jour |
| Autre `action` | — | `400` · `{ "error": "Invalid action. Must be 'block' or 'release'." }` |
| Erreur métier | — | `500` · `{ "error": "Internal Server Error" }` |

### `POST /api/products/[identifier]/block` · `/release`

Mêmes effets que le `PATCH` correspondant, corps `{ quantity }`. Authentifiées
depuis la phase 02, par le même jeton porteur que les autres routes.

| Cas | Réponse |
| --- | --- |
| Succès | `200` · le produit à jour |
| `quantity` non numérique ou ≤ 0 | `400` · `{ "error": "Quantity must be a positive number" }` |
| `stock` à zéro sur un `block` | `400` · `{ "error": "Cannot block units. Stock quantity is zero." }` |
| `blockedQuantity` à zéro sur un `release` | `400` · `{ "error": "Cannot release units. Blocked quantity is zero." }` |

### `POST /api/products/[identifier]/declare-sale`

Corps `{ quantity, useReservation }`. Exécuté dans une transaction Prisma.
Authentifiée depuis la phase 02.

| Cas | Effet | Réponse |
| --- | --- | --- |
| `useReservation: false` | `stock -= q` | `200` |
| `useReservation: true` | `blockedQuantity -= q`, **`stock` inchangé** | `200` |
| `quantity` ≤ 0 | — | `400` · `{ "error": "Quantity must be a positive number" }` |
| `useReservation` non booléen | — | `400` · `{ "error": "useReservation must be a boolean" }` |
| Réservations insuffisantes | — | `400` · `{ "error": "Not enough reserved units available" }` |
| Stock insuffisant | — | `400` · `{ "error": "Not enough stock available" }` |

Que `stock` reste inchangé quand on vend une unité réservée est **correct** :
l'unité avait déjà quitté `stock` au moment de la réservation.

## Sécurité

### Corrigé en phase 02

`block`, `release` et `declare-sale` exigent désormais un jeton, via le même
`apiAuthMiddleware` que les autres routes. Aucun nouveau schéma n'a été
introduit : **le client mobile n'a rien à changer**, dès lors qu'il envoyait
déjà son en-tête `Authorization` sur ces appels. S'il ne le faisait pas — ces
routes l'acceptaient — il recevra maintenant des `401` et devra être mis à jour.

### Écart restant, en attente d'arbitrage

**Le middleware ne vérifie jamais le rôle.** Il valide la signature du jeton et
s'arrête là. N'importe quel client inscrit sur la boutique peut obtenir un jeton
via `/api/auth/login` et muter le stock.

Le correctif est un contrôle `role === "admin"` dans `apiAuthMiddleware`. Il
n'est pas appliqué parce qu'il **déconnecterait l'application mobile** si le
compte qu'elle utilise n'est pas administrateur. Deux comptes administrateurs
existent ; il faut d'abord confirmer lequel le mobile emploie.

L'écart est figé par un test qui passe en constatant le comportement actuel :
il basculera le jour où la décision sera prise.

## Faire tourner les tests

```bash
npm test
```

`tests/helpers/global-setup.ts` démarre un `next dev` sur le port `3100`
(`CONTRACT_PORT` pour en changer), attend qu'il réponde, et
`global-teardown.ts` l'arrête. Les journaux du serveur partent dans
`tests/.server.log`.

Les fixtures créent leur propre produit, catégorie et utilisateur, tous préfixés
`__contract-test__`, et les suppriment à la fin. Elles ne touchent à aucune
autre donnée.
