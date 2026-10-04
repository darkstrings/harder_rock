import { clsx } from "clsx";
import { differenceInCalendarDays, format, parseISO } from "date-fns";

export const cn = (...args) => clsx(...args);

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const currencyExact = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const formatCurrency = (value, exact = false) => (exact ? currencyExact : currency).format(Number(value) || 0);

const toDate = (d) => (d instanceof Date ? d : parseISO(d));

export const formatDate = (d, pattern = "MMM d, yyyy") => format(toDate(d), pattern);

export function relativeDay(d) {
  const diff = differenceInCalendarDays(toDate(d), new Date());
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return diff > 0 ? `In ${diff} days` : `${-diff} days ago`;
}

export const todayISO = () => format(new Date(), "yyyy-MM-dd");

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
