import { PrismaClient } from "@prisma/client";
// bcryptjs (et non bcrypt-ts-edge, ESM pur) : même algorithme, build CJS
// disponible, et c'est ce que `lib/auth.ts` utilise pour la comparaison.
import { hashSync } from "bcryptjs";
import jwt from "jsonwebtoken";

export const prisma = new PrismaClient();

/**
 * Préfixe porté par tout ce que les tests créent, pour pouvoir nettoyer sans
 * jamais toucher aux données de la base de développement.
 */
export const FIXTURE_TAG = "__contract-test__";

export const FIXTURE_PASSWORD = "contract-test-password";

export type Fixtures = Awaited<ReturnType<typeof createFixtures>>;

export async function createFixtures() {
  const stamp = `${FIXTURE_TAG}-${process.pid}`;

  const category = await prisma.productCategory.upsert({
    where: { name: `${FIXTURE_TAG}-category` },
    update: {},
    create: { name: `${FIXTURE_TAG}-category` },
  });

  const product = await prisma.product.create({
    data: {
      name: `${stamp}-product`,
      slug: `${stamp}-product`,
      description: "Produit créé par les tests de contrat.",
      images: ["https://utfs.io/f/contract-test.png"],
      stock: 10,
      blockedQuantity: 0,
      price: 123.45,
      codeIdentifier: `${stamp}-CODE`,
      isPublished: true,
      categoryId: category.id,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: `${stamp}-user`,
      email: `${stamp}@example.test`,
      password: hashSync(FIXTURE_PASSWORD, 10),
      role: "user",
    },
  });

  return { category, product, user, stamp };
}

export async function destroyFixtures() {
  await prisma.product.deleteMany({
    where: { name: { startsWith: FIXTURE_TAG } },
  });
  await prisma.productCategory.deleteMany({
    where: { name: { startsWith: FIXTURE_TAG } },
  });
  await prisma.user.deleteMany({
    where: { email: { contains: FIXTURE_TAG } },
  });
  await prisma.$disconnect();
}

/** Rafraîchit un produit fixture depuis la base. */
export async function readProduct(id: string) {
  const p = await prisma.product.findUniqueOrThrow({ where: { id } });
  return { stock: p.stock, blockedQuantity: p.blockedQuantity };
}

/**
 * Reproduit exactement ce que POST /api/auth/login émet : HS256, secret
 * JWT_SECRET, charge utile { userId, email }, validité 30 jours.
 */
export function signMobileToken(user: { id: string; email: string }) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "30d" }
  );
}

/** URL de base du serveur démarré par global-setup. */
export function baseUrl() {
  const url = process.env.CONTRACT_BASE_URL;
  if (!url) throw new Error("CONTRACT_BASE_URL absent : global-setup n'a pas tourné.");
  return url;
}

/**
 * Émet une requête telle que l'application mobile l'envoie.
 *
 * `apiAuthMiddleware` délègue l'extraction du jeton à `getToken({ raw: true })`
 * d'Auth.js, qui lit d'abord le cookie de session puis, à défaut, l'en-tête
 * `Authorization: Bearer`. C'est cette seconde branche qu'utilise le mobile.
 */
export async function callApi(
  path: string,
  init: { method?: string; token?: string; body?: unknown } = {}
) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (init.token) headers.authorization = `Bearer ${init.token}`;

  const res = await fetch(`${baseUrl()}${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: AbortSignal.timeout(25_000),
  });

  const text = await res.text();
  // Le corps est délibérément non typé : ces tests décrivent une réponse JSON
  // brute et doivent pouvoir constater ce qu'elle contient réellement.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let json: any = undefined;
  try {
    json = text ? JSON.parse(text) : undefined;
  } catch {
    /* réponse non-JSON : `text` reste disponible pour le diagnostic */
  }

  return { status: res.status, json, text };
}
