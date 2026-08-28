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
import { common } from "./common";
import { errors } from "./errors";
import { order } from "./order";
import { payment } from "./payment";

export const labels = { account, admin, common, errors, order, payment } as const;

export { account, admin, common, errors, order, payment };
