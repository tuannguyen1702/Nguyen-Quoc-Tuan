import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, fractionDigits = 6) {
  return Math.round(value * (10 ** fractionDigits)) / (10 ** fractionDigits)
}