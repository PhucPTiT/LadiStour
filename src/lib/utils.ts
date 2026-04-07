import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function calculateReadingMinutesFromHtml(
  html: string,
  wordsPerMinute: number = 200,
) {
  if (!html) return 1;

  const text = html
    .replace(/<[^>]*>/g, " ") // remove tags
    .replace(/\s+/g, " ") // normalize spaces
    .trim();

  const words = text ? text.split(" ").length : 0;

  return Math.max(1, Math.ceil(words / wordsPerMinute));
}