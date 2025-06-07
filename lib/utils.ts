import { type ClassValue, clsx } from "clsx"
import { format } from "date-fns"
import { twMerge } from "tailwind-merge"
import { currencySymbol } from "./consts"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function tw(s: string) {
  return s
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "MMMM d, yyyy")
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
}

export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "-"

  // Format number without currency symbol first
  const formattedNumber = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

  // Append custom currency symbol
  return `${formattedNumber}${currencySymbol}`
}

// Example usage:
// formatPrice(150000) -> "150.000 ₫"
// formatPrice(1500000) -> "1.500.000 ₫"
// formatPrice(null) -> "-"
