import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Unified compact number formatter. One casing, one precision everywhere.
 * ≥1M → "1.2M" (trailing ".0" stripped)
 * ≥1k → "12.3K" (trailing ".0" stripped)
 * else → integer with thousands separators
 */
export function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    const v = (n / 1_000_000).toFixed(1).replace(/\.0$/, "")
    return `${v}M`
  }
  if (n >= 1_000) {
    const v = (n / 1_000).toFixed(1).replace(/\.0$/, "")
    return `${v}K`
  }
  return Math.round(n).toLocaleString()
}
