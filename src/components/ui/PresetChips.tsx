"use client";

import clsx from "clsx";

interface PresetChipsProps {
  values: readonly number[];
  active?: number;
  onPick: (n: number) => void;
  size?: "sm" | "md";
  ariaLabel?: string;
}

export function PresetChips({
  values,
  active,
  onPick,
  size = "sm",
  ariaLabel,
}: PresetChipsProps) {
  const dims =
    size === "sm" ? "h-6 min-w-6 px-1.5 text-[11px]" : "h-7 min-w-7 px-2 text-xs";
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex flex-wrap items-center gap-1"
    >
      {values.map((n) => {
        const isActive = n === active;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onPick(n)}
            className={clsx(
              dims,
              "rounded-md font-medium border transition-colors cursor-pointer tabular-nums",
              isActive
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-transparent border-border-base text-foreground-muted hover:text-foreground hover:border-border-strong",
            )}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
