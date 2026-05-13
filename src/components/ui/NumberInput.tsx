"use client";

import { useCallback } from "react";
import clsx from "clsx";

export interface NumberInputProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  className?: string;
  ariaLabel?: string;
  size?: "sm" | "md";
}

export function NumberInput({
  value,
  onChange,
  min = 1,
  max = 5000,
  step = 1,
  id,
  className,
  ariaLabel,
  size = "md",
}: NumberInputProps) {
  const clamp = useCallback(
    (n: number) => Math.max(min, Math.min(max, Math.round(n))),
    [min, max],
  );

  const decrement = () => onChange(clamp(value - step));
  const increment = () => onChange(clamp(value + step));

  const h = size === "sm" ? "h-8" : "h-9";
  const btnW = size === "sm" ? "w-7" : "w-8";

  return (
    <div
      className={clsx(
        "inline-flex items-stretch rounded-lg overflow-hidden",
        "bg-surface border border-border-base hover:border-border-strong",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 focus-within:ring-offset-background",
        "transition-colors",
        h,
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease"
        onClick={decrement}
        className={clsx(
          btnW,
          "flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-surface-muted cursor-pointer text-sm",
        )}
      >
        −
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        aria-label={ariaLabel}
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : min}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(clamp(n));
        }}
        className={clsx(
          "flex-1 min-w-0 text-center bg-transparent",
          size === "sm" ? "text-xs w-12" : "text-sm w-14",
          "font-medium tabular-nums",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          "focus:outline-none",
        )}
      />
      <button
        type="button"
        aria-label="Increase"
        onClick={increment}
        className={clsx(
          btnW,
          "flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-surface-muted cursor-pointer text-sm",
        )}
      >
        +
      </button>
    </div>
  );
}
