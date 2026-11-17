import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Shared pill styling, reused by the filter buttons in the project grid. */
export function tagStyles({ interactive = false }: { interactive?: boolean } = {}) {
  return cn(
    "inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted-foreground",
    interactive &&
      "cursor-pointer transition-colors hover:border-foreground/30 hover:text-foreground",
  );
}

export function Tag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn(tagStyles(), className)}>{children}</span>;
}
