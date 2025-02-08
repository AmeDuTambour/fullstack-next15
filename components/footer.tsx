import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-footer">
      <div className="container mx-auto py-6 px-5 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* ✅ Première colonne : Logo */}
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/images/brand/logo-no-bg-light.png"
            alt={`${APP_NAME} logo`}
            className="object-contain dark:hidden"
            priority={true}
            height={100}
            width={100}
          />
          <Image
            src="/images/brand/logo-no-bg-dark.png"
            alt={`${APP_NAME} logo`}
            className="object-contain hidden dark:block"
            priority={true}
            height={100}
            width={100}
          />
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {currentYear} {APP_NAME}. Tous droits réservés.
          </p>
        </div>

        {/* ✅ Deuxième colonne : Liens de navigation */}
        <div className="flex flex-col items-center space-y-2">
          <h3 className="text-lg font-semibold text-primary">Navigation</h3>
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-400 hover:text-primary"
          >
            Accueil
          </Link>
          <Link
            href="/search"
            className="text-gray-700 dark:text-gray-400 hover:text-primary"
          >
            Boutique
          </Link>
          <Link
            href="/blog"
            className="text-gray-700 dark:text-gray-400 hover:text-primary"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-gray-700 dark:text-gray-400 hover:text-primary"
          >
            À Propos
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 dark:text-gray-400 hover:text-primary"
          >
            Contact
          </Link>
        </div>

        {/* ✅ Troisième colonne : Réseaux sociaux */}
        <div className="flex flex-col items-center space-y-2">
          <h3 className="text-lg font-semibold text-primary">Suivez-nous</h3>
          <div className="flex space-x-4">
            <Link
              href="https://www.instagram.com/l_ame_du_tambour/"
              target="_blank"
              className="text-gray-700 dark:text-gray-400 hover:text-primary"
            >
              <Instagram size={24} />
            </Link>
            <Link
              href="https://www.facebook.com/p/L%C3%A2me-du-Tambour-100075977844059/"
              target="_blank"
              className="text-gray-700 dark:text-gray-400 hover:text-primary"
            >
              <Facebook size={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
