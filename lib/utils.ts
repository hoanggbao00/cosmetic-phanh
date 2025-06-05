import { type ClassValue, clsx } from "clsx"
import { format } from "date-fns"
import { twMerge } from "tailwind-merge"

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

  // Format for Vietnamese currency (VND)
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0, // VND doesn't use decimal places
    maximumFractionDigits: 0,
  }).format(price)
}

// Example usage:
// formatPrice(150000) -> "150.000 ₫"
// formatPrice(1500000) -> "1.500.000 ₫"
// formatPrice(null) -> "-"
