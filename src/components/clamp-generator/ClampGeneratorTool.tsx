"use client";

import { useMemo, useReducer, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "../ui/Button";
import { PresetChips } from "../ui/PresetChips";
import { UnitNumberInput } from "./UnitNumberInput";
import {
  buildClamp,
  DEFAULT_BASE_PX,
  remToPx,
  type CssUnit,
} from "@/lib/css-units";
import { ONYLOGY_PRESETS } from "@/lib/onylogy-presets";

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

type Action =
  | { type: "setField"; key: FieldKey; value: UnitValue }
  | { type: "preset"; key: FieldKey; value: number };

const initial: State = {
  minViewport: { value: 500, unit: "px" },
  maxViewport: { value: 900, unit: "px" },
  minFont: { value: 16, unit: "px" },
  maxFont: { value: 48, unit: "px" },
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "setField":
      return { ...s, [a.key]: a.value };
    case "preset":
      return { ...s, [a.key]: { ...s[a.key], value: a.value } };
  }
}

function toPx(uv: UnitValue): number {
  return uv.unit === "px" ? uv.value : remToPx(uv.value, DEFAULT_BASE_PX);
}

const FIELDS: { key: FieldKey; label: string; helper: string }[] = [
  { key: "minViewport", label: "Minimum viewport width", helper: "Where fluid scaling starts" },
  { key: "maxViewport", label: "Maximum viewport width", helper: "Where fluid scaling ends" },
  { key: "minFont", label: "Minimum font size", helper: "Size at (and below) min viewport" },
  { key: "maxFont", label: "Maximum font size", helper: "Size at (and above) max viewport" },
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
      await navigator.clipboard.writeText(clamp.css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h1 className="font-display text-2xl sm:text-[28px] font-semibold tracking-tight">
          Clamp Generator
        </h1>
        <p className="text-sm text-foreground-muted mt-0.5">
          Generate a fluid <code className="font-mono text-[12px] bg-surface-muted px-1 py-0.5 rounded">font-size</code> that scales linearly with viewport width.
        </p>
      </div>

      <div className="rounded-xl border border-border-base bg-surface p-5 sm:p-6 space-y-5">
        {FIELDS.map((f) => (
          <div key={f.key} className="space-y-2">
            <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
              <label className="flex flex-col gap-1 min-w-[260px]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted/80">
                  {f.label}
                </span>
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
              <p className="text-xs text-foreground-muted pb-1.5">{f.helper}</p>
            </div>
            <PresetChips
              values={ONYLOGY_PRESETS}
              active={state[f.key].value}
              onPick={(n) => dispatch({ type: "preset", key: f.key, value: n })}
              size="sm"
              ariaLabel={`${f.label} presets`}
            />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border-base bg-surface p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Output</h2>
          <Button
            onClick={handleCopy}
            variant="secondary"
            size="md"
            aria-label="Copy clamp CSS"
          >
            {copied ? <Check {...ICON} /> : <Copy {...ICON} />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <pre className="font-mono text-sm leading-relaxed bg-surface-muted rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-words">
          {clamp.css}
        </pre>
        {clamp.degenerate && (
          <p className="text-xs text-foreground-muted">
            Viewport range is zero — using the minimum font size as a flat value.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border-base bg-surface p-5 sm:p-6 space-y-3">
        <h2 className="font-display text-base font-semibold">Live preview</h2>
        <p className="text-xs text-foreground-muted">
          Resize the window to see the font-size scale between viewport widths.
        </p>
        <div className="rounded-lg border border-border-base bg-surface-muted px-4 py-6">
          <p
            style={{ fontSize: clamp.value, lineHeight: 1.2 }}
            className="font-display"
          >
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </div>
    </div>
  );
}
