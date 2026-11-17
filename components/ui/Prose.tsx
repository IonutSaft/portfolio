import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Typographic scope for long-form text (About paragraphs, case-study bodies).
 * The actual rules live in globals.css under `.prose` so rendered Markdown —
 * which is plain HTML, not components — picks them up too.
 */
export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("prose", className)}>{children}</div>;
}
