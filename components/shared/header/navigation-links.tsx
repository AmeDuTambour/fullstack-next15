import { Button } from "@/components/ui/button";
import Link from "next/link";

const NavigationLinks = () => {
  const links = [
    { title: "Accueil", path: "/" },
    { title: "Boutique", path: "/search" },
    { title: "Blog", path: "/blog" },
    { title: "À propos", path: "/about" },
    { title: "Contact", path: "/contact" },
  ];

  return (
    <div className="flex gap-6 pl-8">
      {links.map((link) => (
        <Button key={link.title} asChild variant="ghost">
          <Link href={link.path}>{link.title}</Link>
        </Button>
      ))}
    </div>
  );
};

export default NavigationLinks;
