import { auth } from "@/auth";

/**
 * Gardes d'accès pour les server actions.
 *
 * Une server action est un endpoint POST public : vérifier le rôle dans la page
 * qui l'appelle ne protège rien, puisque l'action reste invocable directement.
 * Chaque action qui touche des données protégées doit donc se garder elle-même.
 *
 * Ces gardes lèvent une exception plutôt que de renvoyer un booléen : les
 * actions étant déjà enveloppées dans un `try/catch` qui passe par
 * `formatError`, l'appelant reçoit un `{ success: false, message }` cohérent
 * avec le reste, et une action non protégée par un `try/catch` échoue
 * bruyamment au lieu de continuer silencieusement.
 *
 * ⚠️ Ces gardes lisent la session Auth.js. Elles ne conviennent donc PAS aux
 * fonctions appelées par les routes de l'API mobile, qui s'authentifient par
 * jeton JWT — voir `docs/api-mobile.md`. `blockProductUnit`,
 * `releaseProductUnit` et `declareSale` doivent rester sans garde de session :
 * leur contrôle d'accès appartient à la couche route.
 */

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

/** Exige une session valide. Renvoie l'identifiant de l'utilisateur. */
export async function requireUser() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new AuthorizationError("Vous devez être connecté.");
  }

  return { userId, role: session.user?.role, session };
}

/** Exige une session dont le rôle est `admin`. */
export async function requireAdmin() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    throw new AuthorizationError(
      "Cette action est réservée aux administrateurs."
    );
  }

  return { userId: session.user.id as string, session };
}

/** Vrai si la requête courante émane d'un administrateur. Ne lève jamais. */
export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

/**
 * Exige que l'utilisateur soit propriétaire de la ressource, ou administrateur.
 */
export async function requireOwnerOrAdmin(ownerId: string | null | undefined) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new AuthorizationError("Vous devez être connecté.");
  }

  if (session?.user?.role !== "admin" && userId !== ownerId) {
    throw new AuthorizationError("Vous n'avez pas accès à cette ressource.");
  }

  return { userId, role: session.user?.role };
}
