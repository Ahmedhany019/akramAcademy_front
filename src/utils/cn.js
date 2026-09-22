import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount) {
  if (amount === undefined || amount === null) return "0 ج.م";
  return `${amount.toLocaleString({
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} ج.م`;
}

export function formatDate(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
