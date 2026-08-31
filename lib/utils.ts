import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { errors } from "@/lib/labels/errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");

  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

type ErrorLike = {
  name?: string;
  code?: string;
  message?: unknown;
  errors?: Record<string, { message?: string }>;
  meta?: { target?: string[] };
};

/**
 * Met en forme une erreur pour l'afficher à un visiteur.
 *
 * Table de correspondance, pas passe-plat : seules les formes reconnues sont
 * traduites, tout le reste retourne un message générique unique. L'implémentation
 * précédente se terminait par un retour du message brut — c'est par là que
 * l'anglais de Prisma atteignait des notifications françaises, et par là qu'un
 * détail d'implémentation pouvait fuir vers un visiteur.
 *
 * ⚠️ Ne concerne QUE les server actions du site. Les routes de `app/api/`
 * n'utilisent pas cette fonction : leurs messages s'adressent à l'application
 * mobile, restent en anglais, et sont figés par les tests de contrat.
 */
export function formatError(error: unknown): string {
  const e = (error ?? {}) as ErrorLike;

  // Validation : les messages des schémas sont déjà rédigés en français.
  if (e.name === "ZodError" && e.errors) {
    const fieldErrors = Object.keys(e.errors).map(
      (field) => e.errors![field]?.message ?? ""
    );
    const joined = fieldErrors.filter(Boolean).join(". ");
    if (joined) return joined;
  }

  // Refus d'autorisation : le message des gardes est déjà en français.
  if (e.name === "AuthorizationError" && typeof e.message === "string") {
    return e.message;
  }

  // Contrainte d'unicité : le champ est nommé en clair, jamais par sa colonne.
  if (e.name === "PrismaClientKnownRequestError" && e.code === "P2002") {
    const column = e.meta?.target?.[0];
    const readable = column ? errors.fieldNames[column] : undefined;
    if (readable) return errors.alreadyExists(readable);
    return errors.unexpected;
  }

  // Tout le reste : journalisé côté serveur, générique côté visiteur.
  console.error("Erreur non reconnue :", error);
  return errors.unexpected;
}

export function round2(value: number | string) {
  const numeric = typeof value === "number" ? value : Number(value);

  if (typeof value !== "number" && typeof value !== "string") {
    throw new Error("round2 attend un nombre ou une chaîne");
  }
  if (Number.isNaN(numeric)) {
    throw new Error(`round2 : valeur non numérique (${String(value)})`);
  }

  return Math.round((numeric + Number.EPSILON) * 100) / 100;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  style: "currency",
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  }
  if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  }
  return "NaN";
}

const NUMBER_FORMATTER = new Intl.NumberFormat("fr-FR");

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

export function formatDateTime(dateString: Date) {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "fr-FR",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "fr-FR",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "fr-FR",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
}

/**
 * Reconstruit l'URL courante en changeant un paramètre de requête.
 *
 * Écrit avec `URLSearchParams` plutôt qu'avec `query-string` : ce module est
 * importé par du code serveur, et `query-string` est distribué en ESM pur.
 * Dépend de `window`, donc réservé au client.
 */
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = new URLSearchParams(params);

  if (value === null) {
    query.delete(key);
  } else {
    query.set(key, value);
  }

  const search = query.toString();
  return search
    ? `${window.location.pathname}?${search}`
    : window.location.pathname;
}

export const isValidUrl = (url: string) => {
  if (!url || url.trim() === "") return false;

  try {
    new URL(url);
    return true;
  } catch {
    return /^\/(?!\/).*/.test(url);
  }
};

export const getProductCategory = (
  productId: string,
  categories: Record<string, string>[]
) => {
  return categories.filter((c) => c.id === productId)[0];
};

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Met en forme le corps d'une section d'article : échappement, liens
 * cliquables, retours à la ligne.
 *
 * Le texte vient d'un `<textarea>` de l'éditeur : c'est du texte brut, jamais
 * du HTML. On l'échappe donc intégralement au lieu de l'assainir. C'est plus
 * sûr, et ça règle un plantage en rendu serveur — `DOMPurify.sanitize` n'existe
 * pas sans DOM, et chaque article levait « sanitize is not a function ».
 */
export const formatText = (text: string) => {
  const escaped = text.replace(/[&<>"']/g, (c) => HTML_ENTITIES[c]);

  const linked = escaped.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>'
  );

  return linked.replace(/\n/g, "<br />");
};
