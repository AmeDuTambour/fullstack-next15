import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

/**
 * Configuration compatible Edge.
 *
 * `middleware.ts` s'exécute dans l'Edge runtime, où Prisma et son adapter Neon
 * ne peuvent pas tourner. Ce fichier ne contient donc que ce dont le middleware
 * a besoin — la stratégie de session et le callback `authorized` — sans jamais
 * importer la base. La configuration complète, avec l'adapter et le fournisseur
 * d'identifiants, vit dans `auth.ts` et ne s'exécute que côté Node.
 *
 * La liste `providers` est volontairement vide ici : le middleware n'authentifie
 * personne, il se contente de lire le JWT déjà émis.
 */
export const authConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [],
  callbacks: {
    authorized({ request, auth }) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      const { pathname } = request.nextUrl;

      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      // Un visiteur connecté sans le rôle est arrêté ici, et non par la garde
      // de la page : celle-ci lève une exception, et un refus de droits n'est
      // pas une panne. Le contrôle qui compte reste côté serveur — ceci évite
      // seulement de présenter une erreur là où il n'y en a pas.
      if (pathname.startsWith("/admin") && auth?.user?.role !== "admin") {
        return NextResponse.redirect(new URL("/forbidden", request.nextUrl));
      }

      // Le panier anonyme est identifié par ce cookie, posé à la première
      // visite et rattaché à l'utilisateur à la connexion (callback `jwt`).
      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();

        const response = NextResponse.next({
          request: { headers: new Headers(request.headers) },
        });

        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
