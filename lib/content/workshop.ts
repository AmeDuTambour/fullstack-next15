/**
 * Coordonnées de l'atelier.
 *
 * Un acheteur qui hésite cherche un moyen de joindre un humain avant de payer.
 * La page de contact n'offrait qu'un formulaire : rien qui prouve qu'il y a
 * quelqu'un au bout, ni sous quel délai.
 *
 * Ces valeurs appartiennent à Julien. Elles se renseignent par l'environnement
 * plutôt que dans le code : elles changeront sans qu'on ait à redéployer, et
 * une adresse postale n'a rien à faire dans un dépôt public. Chaque champ vide
 * ne s'affiche simplement pas.
 */
export const WORKSHOP = {
  city: process.env.NEXT_PUBLIC_WORKSHOP_CITY || "Mirepoix, Ariège",
  address: process.env.NEXT_PUBLIC_WORKSHOP_ADDRESS || "",
  email: process.env.NEXT_PUBLIC_WORKSHOP_EMAIL || "",
  phone: process.env.NEXT_PUBLIC_WORKSHOP_PHONE || "",
  replyDelay: process.env.NEXT_PUBLIC_WORKSHOP_REPLY_DELAY || "48 heures",
} as const;
