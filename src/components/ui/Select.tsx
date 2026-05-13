"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import clsx from "clsx";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export type SelectOptionList = SelectOption[] | SelectOptionGroup[];

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "size"> {
  options: SelectOptionList;
  size?: "sm" | "md";
}

function isGroup(opt: SelectOption | SelectOptionGroup): opt is SelectOptionGroup {
  return (opt as SelectOptionGroup).options !== undefined;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, className, size = "md", ...props }, ref) => {
    const grouped = options.length > 0 && isGroup(options[0]);
    return (
      <div className="relative inline-block w-full">
        <select
          ref={ref}
          className={clsx(
            "appearance-none w-full rounded-lg",
            "bg-surface text-foreground border border-border-base",
            "hover:border-border-strong",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background",
            "transition-colors cursor-pointer pr-8 pl-3",
            size === "sm" ? "h-8 text-xs" : "h-9 text-sm",
            className,
          )}
          {...props}
        >
          {grouped
            ? (options as SelectOptionGroup[]).map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </optgroup>
              ))
            : (options as SelectOption[]).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
        </select>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  },
);
Select.displayName = "Select";
