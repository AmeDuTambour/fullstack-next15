import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

import BrandLogo from "@/components/shared/brand-logo";
import { NAVIGATION } from "@/components/shared/header/navigation";
import { LEGAL_PAGES } from "@/lib/content/legal";
import { APP_NAME } from "@/lib/constants";
import { common, legal } from "@/lib/labels";

const SOCIALS = [
  {
    href: "https://www.instagram.com/l_ame_du_tambour/",
    icon: Instagram,
    label: common.instagram,
  },
  {
    href: "https://www.facebook.com/p/L%C3%A2me-du-Tambour-100075977844059/",
    icon: Facebook,
    label: common.facebook,
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-footer">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-5 py-8 text-center sm:grid-cols-2 md:text-left lg:grid-cols-4">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <BrandLogo variant="plain" height={100} />
          <p className="text-sm text-muted-foreground">
            {common.copyright(currentYear, APP_NAME)}
          </p>
        </div>

        <nav className="flex flex-col items-center gap-2 md:items-start">
          <h2 className="text-lg font-semibold text-primary">
            {common.navigation}
          </h2>
          {NAVIGATION.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="text-muted-foreground hover:text-primary"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Les pages d'information sont accessibles depuis toutes les pages :
            c'est une obligation, et c'est aussi ce qu'un acheteur cherche avant
            de payer un artisan qu'il ne connaît pas. */}
        <nav className="flex flex-col items-center gap-2 md:items-start">
          <h2 className="text-lg font-semibold text-primary">
            {legal.footerHeading}
          </h2>
          {LEGAL_PAGES.map((page) => (
            <Link
              key={page.slug}
              href={`/legal/${page.slug}`}
              className="text-muted-foreground hover:text-primary"
            >
              {page.title}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-2 md:items-start">
          <h2 className="text-lg font-semibold text-primary">
            {common.followUs}
          </h2>
          <div className="flex gap-2">
            {SOCIALS.map((social) => (
              <Link
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:text-primary"
              >
                <social.icon className="h-6 w-6" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
