import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind-friendly class lists; later arguments override earlier conflicting utilities. */
export const mergeClasses = (...classValues: ClassValue[]): string => {
  return twMerge(clsx(...classValues));
};
