export const DEFAULT_BASE_PX = 16;

export function pxToRem(px: number, basePx: number = DEFAULT_BASE_PX): number {
  if (basePx === 0) return 0;
  return px / basePx;
}

export function remToPx(rem: number, basePx: number = DEFAULT_BASE_PX): number {
  return rem * basePx;
}

/** Format a CSS numeric value: round to 4 decimals, trim trailing zeros. */
export function formatNumber(n: number, maxDecimals = 4): string {
  if (!Number.isFinite(n)) return "0";
  const rounded = Number(n.toFixed(maxDecimals));
  return String(rounded);
}

export function formatPx(px: number): string {
  return `${formatNumber(px)}px`;
}

export function formatRem(rem: number): string {
  return `${formatNumber(rem)}rem`;
}

export type CssUnit = "px" | "rem";

export interface ClampInputs {
  minViewportPx: number;
  maxViewportPx: number;
  minFontPx: number;
  maxFontPx: number;
}

export interface ClampResult {
  css: string;             // full declaration: "font-size: clamp(...);"
  value: string;           // clamp(...) only
  minRem: number;
  maxRem: number;
  vw: number;
  interceptRem: number;
  degenerate: boolean;     // true when viewport range is zero
}

/**
 * Build a fluid clamp() CSS string from min/max font sizes and min/max viewports.
 * All inputs in px; output expresses sizes in rem (canonical 16px base for the rem output,
 * intentionally independent of the user's PX Converter base — clamp() values should travel).
 */
export function buildClamp(inputs: ClampInputs): ClampResult {
  const { minViewportPx, maxViewportPx, minFontPx, maxFontPx } = inputs;
  const OUTPUT_BASE = 16;
  const minRem = minFontPx / OUTPUT_BASE;
  const maxRem = maxFontPx / OUTPUT_BASE;

  if (maxViewportPx === minViewportPx) {
    const css = `font-size: ${formatRem(minRem)};`;
    return {
      css,
      value: formatRem(minRem),
      minRem,
      maxRem,
      vw: 0,
      interceptRem: minRem,
      degenerate: true,
    };
  }

  const slope = (maxFontPx - minFontPx) / (maxViewportPx - minViewportPx);
  const vw = slope * 100; // vw is "percentage of viewport"
  const interceptPx = minFontPx - slope * minViewportPx;
  const interceptRem = interceptPx / OUTPUT_BASE;

  const interceptStr = `${formatNumber(interceptRem)}rem`;
  const vwStr = `${formatNumber(vw)}vw`;
  const minStr = formatRem(minRem);
  const maxStr = formatRem(maxRem);

  // Build the middle expression carefully — handle negative intercept gracefully
  const middle =
    interceptRem === 0
      ? vwStr
      : interceptRem < 0
        ? `${interceptStr} + ${vwStr}`
        : `${interceptStr} + ${vwStr}`;

  const value = `clamp(${minStr}, ${middle}, ${maxStr})`;
  return {
    css: `font-size: ${value};`,
    value,
    minRem,
    maxRem,
    vw,
    interceptRem,
    degenerate: false,
  };
}
