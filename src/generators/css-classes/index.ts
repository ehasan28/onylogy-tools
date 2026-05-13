import type { GenerateOptions, TextGenerator } from "../types";
import { BLOCKS, ELEMENTS, MODIFIERS, PROPS, SIZES, TONES } from "./parts";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function kebab(...parts: string[]): string {
  return parts.filter(Boolean).join("-");
}

function bem(): string {
  const block = pick(BLOCKS);
  const hasElement = Math.random() < 0.7;
  const hasModifier = Math.random() < 0.6;
  let s = block;
  if (hasElement) s += `__${pick(ELEMENTS)}`;
  if (hasModifier) s += `--${pick(MODIFIERS)}`;
  return s;
}

function kebabStyle(): string {
  return kebab(pick(BLOCKS), pick(ELEMENTS));
}

function camelCase(): string {
  const a = pick(BLOCKS);
  const b = pick(ELEMENTS);
  const c = pick(MODIFIERS);
  const parts = [a, b, c];
  return parts
    .map((p, i) =>
      i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1),
    )
    .join("");
}

function utility(): string {
  const prop = pick(PROPS);
  const tone = pick(TONES);
  const size = pick(SIZES);
  return `${prop}-${size}-${tone}`;
}

export const cssClassesGenerator: TextGenerator = {
  id: "css-classes",
  name: "CSS Class Names",
  category: "Design",
  description: "BEM, kebab, camel, or utility-style class names.",
  supportedUnits: ["words"],
  unitLabelOverride: { words: "Classes" },
  presets: { words: [5, 10, 25, 50] },
  customOptions: [
    {
      key: "style",
      type: "select",
      label: "Style",
      default: "bem",
      options: [
        { value: "bem", label: "BEM" },
        { value: "kebab", label: "kebab-case" },
        { value: "camel", label: "camelCase" },
        { value: "utility", label: "utility (Tailwind-ish)" },
      ],
    },
  ],
  generate({ count, custom }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, 500));
    const style = String(custom?.style ?? "bem");
    const fn =
      style === "kebab"
        ? kebabStyle
        : style === "camel"
          ? camelCase
          : style === "utility"
            ? utility
            : bem;
    return Array.from({ length: n }, fn).join("\n");
  },
};
