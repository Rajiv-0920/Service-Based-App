import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Shadcn's recommended className merger. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Format a price value with currency symbol. */
export function formatPrice(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Returns an array of 5 values: "full" | "half" | "empty"
 * suitable for rendering star icons.
 */
export function getStarValues(rating) {
  return Array.from({ length: 5 }, (_, i) => {
    if (rating >= i + 1) return 'full';
    if (rating >= i + 0.5) return 'half';
    return 'empty';
  });
}

/** Clamp a number between min and max. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
