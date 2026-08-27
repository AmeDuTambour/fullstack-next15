import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Le middleware tourne dans l'Edge runtime : il n'utilise que `auth.config.ts`,
 * volontairement dépourvu d'adapter Prisma. Importer `@/auth` ici tirerait
 * l'adapter Neon dans le bundle Edge.
 */
export const { auth: middleware } = NextAuth(authConfig);
