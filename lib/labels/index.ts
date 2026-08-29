/**
 * Référentiel de libellés d'interface.
 *
 * Point d'entrée unique de tout texte affiché à un humain. Voir le contrat dans
 * `specs/001-french-ui-labels/contracts/labels.md`.
 *
 * Ce que ce référentiel ne couvre pas : le contenu saisi par l'administrateur
 * (noms de produits, titres d'articles), les chemins d'URL, les identifiants
 * stockés en base, et les messages destinés aux développeurs ou à l'application
 * mobile — ces derniers restent en anglais.
 */
import { account } from "./account";
import { admin } from "./admin";
import { blog } from "./blog";
import { catalog } from "./catalog";
import { common } from "./common";
import { contact } from "./contact";
import { email } from "./email";
import { errors } from "./errors";
import { feedback } from "./feedback";
import { legal } from "./legal";
import { order } from "./order";
import { payment } from "./payment";

export const labels = {
  account,
  admin,
  blog,
  catalog,
  common,
  contact,
  email,
  errors,
  feedback,
  legal,
  order,
  payment,
} as const;

export {
  account,
  admin,
  blog,
  catalog,
  common,
  contact,
  email,
  errors,
  feedback,
  legal,
  order,
  payment,
};
