import "@uploadthing/react/styles.css";
import "@/assets/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

/**
 * Trois graisses, pas six.
 *
 * Six fichiers étaient chargés sur chaque page ; `font-light`, `font-extrabold`
 * et `font-black` n'apparaissent nulle part dans le code. `display: "swap"`
 * fait afficher le texte immédiatement dans la police de repli plutôt que de le
 * masquer le temps du téléchargement.
 */
const font = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${font.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
