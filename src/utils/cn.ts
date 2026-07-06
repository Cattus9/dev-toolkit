import { type ClassValue, clsx } from "clsx";

// Wait, let's write simple cn function
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
