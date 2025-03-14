import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import DOMPurify from "dompurify";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );
    return fieldErrors.join(". ");
  }
  if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    const field = error.meta?.target ? error.meta.target[0] : "Field";

    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  return typeof error.message === "string"
    ? error.message
    : JSON.stringify(error.message);
}

export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round(((value + Number.EPSILON) * 100) / 100);
  }
  if (typeof value === "string") {
    return Math.round(((Number(value) + Number.EPSILON) * 100) / 100);
  }
  throw new Error("Value is not a number ot string");
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

export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
    }
  );
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

export const formatText = (text: string) => {
  // Échapper les caractères dangereux
  const safeText = DOMPurify.sanitize(text);

  // Transformer les URLs en liens cliquables
  const linkedText = safeText.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>'
  );

  // Remplacer les sauts de ligne par des <br />
  return linkedText.replace(/\n/g, "<br />");
};
