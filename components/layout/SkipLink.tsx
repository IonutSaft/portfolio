/**
 * First focusable element on the page. Hidden until focused, then pinned to
 * the top-left corner above the sticky nav.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-md bg-background px-4 py-3 text-sm font-medium text-foreground shadow-md ring-2 ring-ring focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100"
    >
      Skip to content
    </a>
  );
}
