"use client";

import { useReducer, useState } from "react";
import clsx from "clsx";
import { ArrowLeftRight, Check, Copy } from "lucide-react";
import { PresetChips } from "../ui/PresetChips";
import {
  DEFAULT_BASE_PX,
  formatNumber,
  pxToRem,
  remToPx,
} from "@/lib/css-units";
import { ONYLOGY_PRESETS } from "@/lib/onylogy-presets";

const ICON = { className: "h-4 w-4", strokeWidth: 1.5 } as const;

interface State {
  basePx: number;
  px: number;
  rem: number;
  lastEdited: "px" | "rem";
}

type Action =
  | { type: "setPx"; value: number }
  | { type: "setRem"; value: number }
  | { type: "setBase"; value: number }
  | { type: "setPxFromPreset"; value: number };

const initial: State = {
  basePx: DEFAULT_BASE_PX,
  px: 16,
  rem: 1,
  lastEdited: "px",
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "setPx":
      return { ...s, px: a.value, rem: pxToRem(a.value, s.basePx), lastEdited: "px" };
    case "setRem":
      return { ...s, rem: a.value, px: remToPx(a.value, s.basePx), lastEdited: "rem" };
    case "setBase":
      if (s.lastEdited === "px") {
        return { ...s, basePx: a.value, rem: pxToRem(s.px, a.value) };
      }
      return { ...s, basePx: a.value, px: remToPx(s.rem, a.value) };
    case "setPxFromPreset":
      return { ...s, px: a.value, rem: pxToRem(a.value, s.basePx), lastEdited: "px" };
  }
}

export function PxConverterTool() {
  const [state, dispatch] = useReducer(reducer, initial);
  const [copied, setCopied] = useState<"px" | "rem" | null>(null);
  const [swapped, setSwapped] = useState(false);

  const handleCopy = async (which: "px" | "rem") => {
    const value =
      which === "px"
        ? `${formatNumber(state.px)}px`
        : `${formatNumber(state.rem)}rem`;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const pxCard = (
    <UnitCard
      label="Pixels"
      unit="px"
      value={state.px}
      onChange={(v) => dispatch({ type: "setPx", value: v })}
      onCopy={() => handleCopy("px")}
      copied={copied === "px"}
      inputAriaLabel="Pixel value"
      highlight={!swapped}
    />
  );

  const remCard = (
    <UnitCard
      label="REM"
      unit="rem"
      value={Number(formatNumber(state.rem))}
      onChange={(v) => dispatch({ type: "setRem", value: v })}
      onCopy={() => handleCopy("rem")}
      copied={copied === "rem"}
      inputAriaLabel="Rem value"
      highlight={swapped}
    />
  );

  return (
    <div className="space-y-7 sm:space-y-9">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-[26px] sm:text-[32px] font-semibold tracking-tight">
          PX to REM converter
        </h1>
        <p className="text-sm text-foreground-muted mt-2">
          Convert pixels to the CSS rem unit and back. The conversion works in both directions —
          edit either value, or swap which side leads.
        </p>
      </header>

      <div className="mx-auto w-full max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-3 sm:gap-4">
          {swapped ? remCard : pxCard}

          <div className="flex justify-center pb-3.5">
            <button
              type="button"
              onClick={() => setSwapped((v) => !v)}
              aria-label="Swap sides"
              title="Swap sides"
              className="h-9 w-9 rounded-full border border-border-base bg-surface text-foreground-muted shadow-card flex items-center justify-center cursor-pointer hover:text-accent hover:border-border-strong active:scale-95 transition-all"
            >
              <ArrowLeftRight className="h-4 w-4 rotate-90 sm:rotate-0" strokeWidth={1.75} />
            </button>
          </div>

          {swapped ? pxCard : remCard}
        </div>

        <p className="text-center text-sm text-foreground-muted mt-6">
          Calculation based on a root font-size of{" "}
          <BaseEditor
            value={state.basePx}
            onChange={(n) => dispatch({ type: "setBase", value: n })}
          />{" "}
          pixel.
        </p>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl border border-border-base bg-surface shadow-card p-4 sm:p-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground-muted/80 mb-3">
            Presets (px)
          </div>
          <PresetChips
            values={ONYLOGY_PRESETS}
            active={state.lastEdited === "px" ? state.px : undefined}
            onPick={(n) => dispatch({ type: "setPxFromPreset", value: n })}
            size="md"
            ariaLabel="Pixel value presets"
          />
        </div>
      </div>
    </div>
  );
}

interface UnitCardProps {
  label: string;
  unit: string;
  value: number;
  onChange: (n: number) => void;
  onCopy: () => void;
  copied: boolean;
  inputAriaLabel: string;
  highlight?: boolean;
}

function UnitCard({
  label,
  unit,
  value,
  onChange,
  onCopy,
  copied,
  inputAriaLabel,
  highlight,
}: UnitCardProps) {
  return (
    <div className="space-y-2">
      <div className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-foreground-muted">
        {label}
      </div>
      <div
        className={clsx(
          "rounded-2xl border bg-surface shadow-card px-3 py-5 sm:py-6 flex items-center gap-2 transition-colors",
          highlight ? "border-accent/40" : "border-border-base",
        )}
      >
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Copied" : `Copy ${label} value`}
          className="shrink-0 h-8 w-8 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted flex items-center justify-center cursor-pointer transition-colors"
        >
          {copied ? <Check {...ICON} /> : <Copy {...ICON} />}
        </button>
        <input
          type="number"
          value={value}
          step={unit === "rem" ? 0.0625 : 1}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) onChange(n);
          }}
          aria-label={inputAriaLabel}
          className={clsx(
            "flex-1 min-w-0 bg-transparent text-center font-display tabular-nums",
            "text-3xl sm:text-4xl font-medium",
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            "focus:outline-none",
            highlight && "text-accent",
          )}
        />
        <span className="shrink-0 w-10 text-right text-sm text-foreground-muted">
          {unit}
        </span>
      </div>
    </div>
  );
}

function BaseEditor({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="number"
      value={value}
      min={1}
      max={64}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (Number.isFinite(n) && n > 0) onChange(n);
      }}
      aria-label="Root font-size in pixels"
      className={clsx(
        "inline-block w-12 text-center font-mono tabular-nums",
        "border-b border-dashed border-foreground-muted/40 hover:border-foreground/60 focus:border-accent",
        "bg-transparent text-foreground focus:outline-none transition-colors",
        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
      )}
    />
  );
}
