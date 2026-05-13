import type { GenerateOptions, TextGenerator } from "../types";
import { FIRST_NAMES, LAST_NAMES } from "./names";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function generateOne(format: string): string {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  switch (format) {
    case "last-first":
      return `${last}, ${first}`;
    case "first-only":
      return first;
    case "full-email":
      return `${first} ${last} — ${slugify(first)}.${slugify(last)}@example.com`;
    case "first-last":
    default:
      return `${first} ${last}`;
  }
}

export const namesGenerator: TextGenerator = {
  id: "names",
  name: "Names",
  category: "Identifiers",
  description: "Realistic-looking first + last names.",
  supportedUnits: ["words"],
  unitLabelOverride: { words: "Names" },
  presets: { words: [5, 10, 25, 50, 100] },
  customOptions: [
    {
      key: "format",
      type: "select",
      label: "Format",
      default: "first-last",
      options: [
        { value: "first-last", label: "First Last" },
        { value: "last-first", label: "Last, First" },
        { value: "first-only", label: "First only" },
        { value: "full-email", label: "Full + email" },
      ],
    },
  ],
  generate({ count, custom }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, 1000));
    const format = String(custom?.format ?? "first-last");
    return Array.from({ length: n }, () => generateOne(format)).join("\n");
  },
};
