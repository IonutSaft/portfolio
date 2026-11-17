import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Section header. `id` is applied to the `h2` so the enclosing <section> can
 * point at it with aria-labelledby.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        // Only let the header sit in a row when there is something to place
        // beside it — otherwise `items-end` pins it to the bottom of a grid
        // cell it shares with body copy.
        children ? "sm:flex-row sm:items-end sm:justify-between" : null,
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={id}
          className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-pretty text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </div>
  );
}
