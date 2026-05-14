"use client";

import { useReducer, useState } from "react";
import { ArrowLeftRight, Check, Copy } from "lucide-react";
import { Button } from "../ui/Button";
import { NumberInput } from "../ui/NumberInput";
import { PresetChips } from "../ui/PresetChips";
import {
  DEFAULT_BASE_PX,
  formatNumber,
  pxToRem,
  remToPx,
} from "@/lib/css-units";
import { ONYLOGY_PRESETS } from "@/lib/onylogy-presets";

const ICON = { className: "h-4 w-4", strokeWidth: 1.5 } as const;
const SWAP_ICON = { className: "h-5 w-5", strokeWidth: 1.5 } as const;

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

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h1 className="font-display text-2xl sm:text-[28px] font-semibold tracking-tight">
          PX Converter
        </h1>
        <p className="text-sm text-foreground-muted mt-0.5">
          Convert pixels to the CSS rem unit and back. The default base is 16px (the browser default
          for the root <code className="font-mono text-[12px] bg-surface-muted px-1 py-0.5 rounded">&lt;html&gt;</code>
          font-size) but you can change it.
        </p>
      </div>

      <div className="rounded-xl border border-border-base bg-surface p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted/80">
              Base font-size
            </span>
            <NumberInput
              value={state.basePx}
              onChange={(n) => dispatch({ type: "setBase", value: Math.max(1, n) })}
              min={1}
              max={64}
              ariaLabel="Base font-size in pixels"
            />
          </label>
          <p className="text-xs text-foreground-muted pb-1 max-w-md">
            Sets the conversion ratio. Most browsers default to 16px.
          </p>
        </div>

        <hr className="border-border-base/70" />

        <div className="flex flex-wrap items-end gap-x-3 gap-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted/80">
              Pixel
            </span>
            <div className="flex items-center gap-2">
              <NumberInput
                value={state.px}
                onChange={(n) => dispatch({ type: "setPx", value: n })}
                min={0}
                max={5000}
                ariaLabel="Pixel value"
                className="min-w-[140px]"
              />
              <span className="text-sm text-foreground-muted">px</span>
            </div>
          </label>

          <div className="pb-2 self-center text-foreground-muted" aria-hidden>
            <ArrowLeftRight {...SWAP_ICON} />
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted/80">
              Rem
            </span>
            <div className="flex items-center gap-2">
              <NumberInput
                value={Number(formatNumber(state.rem))}
                onChange={(n) => dispatch({ type: "setRem", value: n })}
                min={0}
                max={500}
                step={0.0625}
                ariaLabel="Rem value"
                className="min-w-[140px]"
              />
              <span className="text-sm text-foreground-muted">rem</span>
            </div>
          </label>

          <div className="ml-auto flex items-center gap-2">
            <Button
              onClick={() => handleCopy("px")}
              variant="secondary"
              size="md"
              aria-label="Copy pixel value"
            >
              {copied === "px" ? <Check {...ICON} /> : <Copy {...ICON} />}
              {copied === "px" ? "Copied!" : `Copy ${formatNumber(state.px)}px`}
            </Button>
            <Button
              onClick={() => handleCopy("rem")}
              variant="secondary"
              size="md"
              aria-label="Copy rem value"
            >
              {copied === "rem" ? <Check {...ICON} /> : <Copy {...ICON} />}
              {copied === "rem" ? "Copied!" : `Copy ${formatNumber(state.rem)}rem`}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted/80">
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

        <div className="text-sm text-foreground-muted">
          <span className="font-mono text-foreground">{formatNumber(state.px)}px</span>
          {" "}={" "}
          <span className="font-mono text-foreground">{formatNumber(state.rem)}rem</span>
          {" "}(base: {state.basePx}px)
        </div>
      </div>
    </div>
  );
}
