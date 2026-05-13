"use client";

import clsx from "clsx";

export interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  id?: string;
  ariaLabel?: string;
  size?: "sm" | "md";
}

export function Toggle({ checked, onChange, id, ariaLabel, size = "sm" }: ToggleProps) {
  const dims = size === "sm" ? "h-5 w-9" : "h-6 w-11";
  const dot = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const translate = size === "sm"
    ? checked ? "translate-x-[18px]" : "translate-x-[3px]"
    : checked ? "translate-x-6" : "translate-x-1";

  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
        dims,
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-accent" : "bg-surface-muted border border-border-base",
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "inline-block rounded-full bg-white shadow",
          dot,
          "transform transition-transform duration-150",
          translate,
        )}
      />
    </button>
  );
}
