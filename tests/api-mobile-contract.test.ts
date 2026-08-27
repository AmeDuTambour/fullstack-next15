/**
 * Contrat de l'API consommée par l'application mobile.
 *
 * Le code du client mobile n'est pas dans ce dépôt et n'est pas consultable
 * depuis ici. Ces tests décrivent donc ce que l'API renvoie *aujourd'hui*, et
 * servent de filet avant tout refactor de `lib/actions/product.actions.ts`,
 * partagé entre le web et le mobile.
 *
 * Ils passent par HTTP contre un vrai serveur Next (démarré par global-setup),
 * pour emprunter exactement le chemin du mobile : routage, middleware et
 * sérialisation compris.
 *
 * Toute modification volontaire du contrat doit se traduire par un changement
 * ici — et être coordonnée avec une mise à jour du client mobile.
 */

import jwt from "jsonwebtoken";
import {
  callApi,
  createFixtures,
  destroyFixtures,
  readProduct,
  signMobileToken,
  FIXTURE_PASSWORD,
  type Fixtures,
} from "./helpers/fixtures";

let fx: Fixtures;
let token: string;

beforeAll(async () => {
  fx = await createFixtures();
  token = signMobileToken({ id: fx.user.id, email: fx.user.email });
});

afterAll(destroyFixtures);

describe("POST /api/auth/login", () => {
  it("échange des identifiants valides contre un jeton", async () => {
    const res = await callApi("/api/auth/login", {
      method: "POST",
      body: { email: fx.user.email, password: FIXTURE_PASSWORD },
    });

    expect(res.status).toBe(200);
    expect(Object.keys(res.json)).toEqual(["token"]);
    expect(typeof res.json.token).toBe("string");

    const payload = jwt.verify(
      res.json.token,
      process.env.JWT_SECRET as string
    ) as Record<string, unknown>;
    expect(payload.userId).toBe(fx.user.id);
    expect(payload.email).toBe(fx.user.email);
  });

  it("refuse un mot de passe invalide avec un 401", async () => {
    const res = await callApi("/api/auth/login", {
      method: "POST",
      body: { email: fx.user.email, password: "mauvais-mot-de-passe" },
    });

    expect(res.status).toBe(401);
    expect(res.json).toEqual({ message: "Invalid credentials" });
  });

  it("refuse une adresse inconnue avec le même 401, sans fuite d'information", async () => {
    const res = await callApi("/api/auth/login", {
      method: "POST",
      body: { email: "inconnu@example.test", password: FIXTURE_PASSWORD },
    });

    expect(res.status).toBe(401);
    expect(res.json).toEqual({ message: "Invalid credentials" });
  });
});

describe("authentification des routes protégées", () => {
  it("rejette une requête sans jeton", async () => {
    const res = await callApi("/api/products");

    expect(res.status).toBe(401);
    expect(res.json).toEqual({ message: "Not authenticated" });
  });

  it("rejette un jeton signé avec un autre secret", async () => {
    const forged = jwt.sign({ userId: fx.user.id }, "mauvais-secret");
    const res = await callApi("/api/products", { token: forged });

    expect(res.status).toBe(401);
  });

  it("accepte le jeton via l'en-tête Authorization: Bearer", async () => {
    const res = await callApi("/api/products", { token });
    expect(res.status).toBe(200);
  });
});

describe("GET /api/products", () => {
  it("renvoie une enveloppe paginée aux clés stables", async () => {
    const res = await callApi("/api/products?limit=5&page=1", { token });

    expect(res.status).toBe(200);
    expect(Object.keys(res.json).sort()).toEqual([
      "currentPage",
      "data",
      "totalCount",
      "totalPages",
    ]);
    expect(Array.isArray(res.json.data)).toBe(true);
    expect(res.json.currentPage).toBe(1);
    expect(typeof res.json.totalCount).toBe("number");
    expect(typeof res.json.totalPages).toBe("number");
  });

  it("expose le produit avec le prix en chaîne et les spécifications résolues", async () => {
    const res = await callApi(`/api/products?query=${fx.stamp}`, { token });
    const item = res.json.data.find(
      (p: { id: string }) => p.id === fx.product.id
    );

    expect(item).toBeDefined();
    expect(typeof item.price).toBe("string");
    expect(item.price).toBe("123.45");
    expect(item.stock).toBe(10);
    expect(item.blockedQuantity).toBe(0);
    expect(item.codeIdentifier).toBe(`${fx.stamp}-CODE`);
    expect(item).toHaveProperty("specifications");
    expect(item).toHaveProperty("category");
  });

  it("filtre sur les seules unités réservées avec blocked=true", async () => {
    const res = await callApi("/api/products?blocked=true", { token });

    expect(res.status).toBe(200);
    for (const p of res.json.data) {
      expect(p.blockedQuantity).toBeGreaterThan(0);
    }
  });
});

describe("GET /api/products/[identifier]", () => {
  it("résout un identifiant UUID", async () => {
    const res = await callApi(`/api/products/${fx.product.id}`, { token });

    expect(res.status).toBe(200);
    expect(res.json.id).toBe(fx.product.id);
    expect(typeof res.json.price).toBe("string");
  });

  it("résout un codeIdentifier scanné en QR", async () => {
    const code = `${fx.stamp}-CODE`;
    const res = await callApi(`/api/products/${code}`, { token });

    expect(res.status).toBe(200);
    expect(res.json.id).toBe(fx.product.id);
    expect(res.json.codeIdentifier).toBe(code);
  });

  it("renvoie 404 sur un identifiant inconnu", async () => {
    const res = await callApi("/api/products/CODE-INEXISTANT", { token });

    expect(res.status).toBe(404);
    expect(res.json).toEqual({ error: "Product not found" });
  });
});

describe("PATCH /api/products/[identifier] — réservation d'unités", () => {
  it("déplace du stock vers les unités réservées puis le rend", async () => {
    const before = await readProduct(fx.product.id);

    const blocked = await callApi(`/api/products/${fx.product.id}`, {
      method: "PATCH",
      token,
      body: { action: "block", quantity: 3 },
    });
    expect(blocked.status).toBe(200);
    expect(await readProduct(fx.product.id)).toEqual({
      stock: before.stock - 3,
      blockedQuantity: before.blockedQuantity + 3,
    });

    const released = await callApi(`/api/products/${fx.product.id}`, {
      method: "PATCH",
      token,
      body: { action: "release", quantity: 3 },
    });
    expect(released.status).toBe(200);
    expect(await readProduct(fx.product.id)).toEqual(before);
  });

  it("refuse une action inconnue", async () => {
    const res = await callApi(`/api/products/${fx.product.id}`, {
      method: "PATCH",
      token,
      body: { action: "detruire", quantity: 1 },
    });

    expect(res.status).toBe(400);
    expect(res.json).toEqual({
      error: "Invalid action. Must be 'block' or 'release'.",
    });
  });
});

describe("POST /api/products/[identifier]/block · /release", () => {
  it("réserve puis libère des unités", async () => {
    const before = await readProduct(fx.product.id);

    const blocked = await callApi(`/api/products/${fx.product.id}/block`, {
      method: "POST",
      body: { quantity: 2 },
    });
    expect(blocked.status).toBe(200);
    expect(await readProduct(fx.product.id)).toEqual({
      stock: before.stock - 2,
      blockedQuantity: before.blockedQuantity + 2,
    });

    const released = await callApi(`/api/products/${fx.product.id}/release`, {
      method: "POST",
      body: { quantity: 2 },
    });
    expect(released.status).toBe(200);
    expect(await readProduct(fx.product.id)).toEqual(before);
  });

  it("refuse une quantité non strictement positive", async () => {
    const res = await callApi(`/api/products/${fx.product.id}/block`, {
      method: "POST",
      body: { quantity: 0 },
    });

    expect(res.status).toBe(400);
    expect(res.json).toEqual({ error: "Quantity must be a positive number" });
  });
});

describe("POST /api/products/[identifier]/declare-sale", () => {
  it("décrémente le stock lors d'une vente sans réservation", async () => {
    const before = await readProduct(fx.product.id);

    const res = await callApi(`/api/products/${fx.product.id}/declare-sale`, {
      method: "POST",
      body: { quantity: 1, useReservation: false },
    });

    expect(res.status).toBe(200);
    expect(await readProduct(fx.product.id)).toEqual({
      stock: before.stock - 1,
      blockedQuantity: before.blockedQuantity,
    });
  });

  it("consomme une unité réservée sans retoucher au stock", async () => {
    await callApi(`/api/products/${fx.product.id}/block`, {
      method: "POST",
      body: { quantity: 1 },
    });
    const afterBlock = await readProduct(fx.product.id);

    const res = await callApi(`/api/products/${fx.product.id}/declare-sale`, {
      method: "POST",
      body: { quantity: 1, useReservation: true },
    });

    expect(res.status).toBe(200);
    expect(await readProduct(fx.product.id)).toEqual({
      stock: afterBlock.stock,
      blockedQuantity: afterBlock.blockedQuantity - 1,
    });
  });

  it("refuse de vendre plus d'unités réservées qu'il n'en existe", async () => {
    const res = await callApi(`/api/products/${fx.product.id}/declare-sale`, {
      method: "POST",
      body: { quantity: 9999, useReservation: true },
    });

    expect(res.status).toBe(400);
    expect(res.json).toEqual({ error: "Not enough reserved units available" });
  });

  it("refuse une valeur non booléenne pour useReservation", async () => {
    const res = await callApi(`/api/products/${fx.product.id}/declare-sale`, {
      method: "POST",
      body: { quantity: 1, useReservation: "oui" },
    });

    expect(res.status).toBe(400);
    expect(res.json).toEqual({ error: "useReservation must be a boolean" });
  });
});

/**
 * Deux écarts de sécurité connus, figés ici pour être corrigés sciemment — avec
 * le client mobile — et non découverts par accident au milieu d'un refactor.
 *
 *  1. `block`, `release` et `declare-sale` n'exigent aucune authentification,
 *     alors que `GET /api/products` et `PATCH /api/products/[id]` en exigent une.
 *  2. `apiAuthMiddleware` vérifie la signature du jeton mais jamais le rôle :
 *     n'importe quel client inscrit sur la boutique peut muter le stock.
 */
describe("écarts de sécurité connus (à corriger en phase 02)", () => {
  it.each(["block", "release"])(
    "%s accepte encore une requête sans jeton",
    async (action) => {
      const res = await callApi(`/api/products/${fx.product.id}/${action}`, {
        method: "POST",
        body: { quantity: 1 },
      });

      expect(res.status).not.toBe(401);

      if (action === "block") {
        await callApi(`/api/products/${fx.product.id}/release`, {
          method: "POST",
          body: { quantity: 1 },
        });
      }
    }
  );

  it("un utilisateur au rôle 'user' peut muter le stock", async () => {
    expect(fx.user.role).toBe("user");

    const res = await callApi(`/api/products/${fx.product.id}`, {
      method: "PATCH",
      token,
      body: { action: "block", quantity: 1 },
    });

    expect(res.status).toBe(200);

    await callApi(`/api/products/${fx.product.id}`, {
      method: "PATCH",
      token,
      body: { action: "release", quantity: 1 },
    });
  });
});
