import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string, options: { currency?: "USD" | "EUR" | "GBP" | "BDT", notation?: Intl.NumberFormatOptions["notation"] } = {}) {
  const { currency = "EUR", notation = "compact" } = options;
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2
  }).format(numericPrice);
}

export const formatDate = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp, 10) * 1000);

  return format(date, 'dd/MM/yyyy H:mm');
}

export const formatExpires = (timestamp: string): string => {
  const seconds = parseInt(timestamp, 10);

  const secondsInDays = 86400;
  const secondsInWeeks = secondsInDays * 7;
  const secondsInMonths = secondsInDays * 30.44;
  const secondsInYears = secondsInDays * 365.25;

  let value: number = 0;
  let unit: string = '';

  if (seconds >= secondsInYears) {
    value = Math.floor(seconds / secondsInYears);
    unit = value === 1 ? 'Year' : 'Years'
  } else if (seconds >= secondsInMonths) {
    value = Math.floor(seconds / secondsInMonths);
    unit = value === 1 ? 'Month' : 'Months'
  } else if (seconds >= secondsInWeeks) {
    value = Math.floor(seconds / secondsInWeeks);
    unit = value === 1 ? 'Week' : 'Weeks'
  } else if (seconds >= secondsInDays) {
    value = Math.floor(seconds / secondsInDays);
    unit = value === 1 ? 'Day' : 'Days'
  }

  return `${value} ${unit}`;
}