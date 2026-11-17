/** Joins class names, dropping falsy values. No Tailwind merge — keep it simple. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
