"use client";

import { useTheme } from "next-themes";

/**
 * Theme toggle.
 *
 * - The icon is driven by the `dark` class on <html>, which next-themes sets
 *   before paint, so it is correct on first paint and needs no mount guard.
 * - The click handler reads that same class instead of `resolvedTheme`:
 *   next-themes leaves `resolvedTheme` undefined until the first `setTheme`,
 *   and using it made the first click in dark mode a no-op.
 * - The accessible name is state-independent on purpose. Any label derived
 *   from the resolved theme differs between server and client HTML and
 *   triggers a hydration mismatch; the icon already conveys current state.
 */
export function ThemeToggle() {
  const { setTheme } = useTheme();

  function toggle() {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
    >
      <SunIcon className="size-5 dark:hidden" />
      <MoonIcon className="hidden size-5 dark:block" />
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
