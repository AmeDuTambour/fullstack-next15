import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Dossier de compilation, isolable.
   *
   * Les tests de contrat démarrent leur propre `next dev` dans ce même dépôt.
   * Tant que les deux serveurs écrivaient dans `.next`, ils se corrompaient
   * mutuellement : la feuille de style tombait en 404 et le site s'affichait
   * sans aucun style. Le symptôme n'avait aucun rapport visible avec la cause.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      // UploadThing v7 sert depuis <appId>.ufs.sh. utfs.io est l'hôte hérité
      // des versions précédentes : les images déjà envoyées y restent servies.
      {
        protocol: "https",
        hostname: "*.ufs.sh",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
