import {
  BookOpenText,
  HomeIcon,
  Mail,
  NewspaperIcon,
  ShoppingBag,
} from "lucide-react";

import { common } from "@/lib/labels";

/**
 * Les cinq destinations du site, déclarées une fois.
 *
 * Le tiroir mobile et la barre de bureau tenaient chacun sa propre liste. Elles
 * étaient déjà d'accord — mais rien ne les y obligeait, et une sixième page
 * ajoutée à l'une aurait manqué à l'autre.
 */
export const NAVIGATION = [
  { title: common.navHome, path: "/", icon: HomeIcon },
  { title: common.navShop, path: "/search", icon: ShoppingBag },
  { title: common.navBlog, path: "/blog", icon: NewspaperIcon },
  { title: common.navAbout, path: "/about", icon: BookOpenText },
  { title: common.navContact, path: "/contact", icon: Mail },
] as const;
