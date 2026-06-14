"use client";

import { useMemo, useReducer, useState } from "react";
import clsx from "clsx";
import { Check, Copy } from "lucide-react";
import { UnitNumberInput } from "./UnitNumberInput";
import {
  buildClamp,
  DEFAULT_BASE_PX,
  remToPx,
  type CssUnit,
} from "@/lib/css-units";

const ICON = { className: "h-4 w-4", strokeWidth: 1.5 } as const;

interface UnitValue {
  value: number;
  unit: CssUnit;
}

interface State {
  minViewport: UnitValue;
  maxViewport: UnitValue;
  minFont: UnitValue;
  maxFont: UnitValue;
}

type FieldKey = "minViewport" | "maxViewport" | "minFont" | "maxFont";

type Action = { type: "setField"; key: FieldKey; value: UnitValue };

const initial: State = {
  minViewport: { value: 420, unit: "px" },
  maxViewport: { value: 1200, unit: "px" },
  minFont: { value: 16, unit: "px" },
  maxFont: { value: 48, unit: "px" },
};

function reducer(s: State, a: Action): State {
  return { ...s, [a.key]: a.value };
}

function toPx(uv: UnitValue): number {
  return uv.unit === "px" ? uv.value : remToPx(uv.value, DEFAULT_BASE_PX);
}

const FIELDS: { key: FieldKey; label: string }[] = [
  { key: "minViewport", label: "Minimum viewport width" },
  { key: "maxViewport", label: "Maximum viewport width" },
  { key: "minFont", label: "Minimum font size" },
  { key: "maxFont", label: "Maximum font size" },
];

export function ClampGeneratorTool() {
  const [state, dispatch] = useReducer(reducer, initial);
  const [copied, setCopied] = useState(false);

  const clamp = useMemo(() => {
    return buildClamp({
      minViewportPx: toPx(state.minViewport),
      maxViewportPx: toPx(state.maxViewport),
      minFontPx: toPx(state.minFont),
      maxFontPx: toPx(state.maxFont),
    });
  }, [state]);

  const handleCopy = async () => {
    try {
      // Copy the clean clamp() value only (no `font-size:` prefix) —
      // drops straight into Elementor / WordPress fields. Preview keeps the
      // full declaration for readability.
      await navigator.clipboard.writeText(clamp.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="space-y-7 sm:space-y-9">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-[26px] sm:text-[32px] font-semibold tracking-tight">
          Font-size Clamp Generator
        </h1>
        <p className="text-sm text-foreground-muted mt-2">
          Generate a fluid <span className="font-mono">font-size</span> that scales linearly with{" "}
          <span className="font-mono">clamp()</span>.
        </p>
      </header>

      <div className="mx-auto w-full max-w-2xl space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {FIELDS.map((f) => (
            <label key={f.key} className="space-y-2">
              <span className="block text-sm font-medium">{f.label}</span>
              <UnitNumberInput
                value={state[f.key].value}
                unit={state[f.key].unit}
                onChange={(uv) =>
                  dispatch({ type: "setField", key: f.key, value: uv })
                }
                min={0}
                max={f.key.includes("Viewport") ? 4000 : 400}
                ariaLabel={f.label}
              />
            </label>
          ))}
        </div>

        <div className="rounded-2xl border border-border-base bg-surface shadow-card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground-muted/80">
              Generated CSS
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy clamp() value"}
              className={clsx(
                "shrink-0 inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors",
                copied
                  ? "text-accent"
                  : "text-foreground-muted hover:text-foreground hover:bg-surface-muted",
              )}
              title={copied ? "Copied!" : "Copy clean clamp() value"}
            >
              {copied ? <Check {...ICON} /> : <Copy {...ICON} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <code className="block font-mono text-sm sm:text-[15px] break-all whitespace-pre-wrap text-foreground">
            {clamp.css}
          </code>
          <p className="mt-2.5 text-xs text-foreground-muted">
            Copy gives the clean <span className="font-mono">clamp()</span> value (no{" "}
            <span className="font-mono">font-size:</span> prefix) — drops straight into Elementor or
            any CSS field.
          </p>
        </div>

        {clamp.degenerate && (
          <p className="text-center text-xs text-foreground-muted">
            Viewport range is zero — using the minimum font size as a flat value.
          </p>
        )}
      </div>
    </div>
  );
}
