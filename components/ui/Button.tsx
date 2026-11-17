import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground hover:opacity-90 active:opacity-100",
  secondary:
    "border border-border bg-surface text-foreground hover:border-foreground/25",
  ghost: "text-foreground hover:bg-surface",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type AsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children"> & {
    href: string;
  };

type AsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: undefined;
  };

/**
 * One button for both links and actions. External links get `target`/`rel`
 * plus a screen-reader note, so callers never have to remember either.
 */
export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", className, children, ...rest } =
    props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (typeof props.href !== "string") {
    return (
      <button
        type="button"
        className={classes}
        {...(rest as ComponentPropsWithoutRef<"button">)}
      >
        {children}
      </button>
    );
  }

  const linkProps = rest as ComponentPropsWithoutRef<"a">;
  const external = /^https?:\/\//.test(props.href);

  return (
    <a
      className={classes}
      {...linkProps}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}
