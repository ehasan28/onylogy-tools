import type { GenerateOptions, TextGenerator } from "../types";
import { FIRST_NAMES, LAST_NAMES } from "../names/names";
import { DOMAIN_POOLS } from "./domains";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function buildLocalPart(first: string, last: string): string {
  const a = slug(first);
  const b = slug(last);
  const variants = [
    `${a}.${b}`,
    `${a}_${b}`,
    `${a}${b}`,
    `${a[0]}${b}`,
    `${a}.${b}${Math.floor(Math.random() * 90) + 10}`,
  ];
  return pick(variants);
}

export const emailsGenerator: TextGenerator = {
  id: "emails",
  name: "Emails",
  category: "Identifiers",
  description: "Realistic-looking email addresses.",
  supportedUnits: ["words"],
  unitLabelOverride: { words: "Emails" },
  presets: { words: [5, 10, 25, 50, 100] },
  customOptions: [
    {
      key: "mode",
      type: "select",
      label: "Domain",
      default: "example",
      options: [
        { value: "example", label: "example.com" },
        { value: "mixed", label: "Mixed real-looking" },
        { value: "corporate", label: "Corporate" },
      ],
    },
  ],
  generate({ count, custom }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, 1000));
    const mode = String(custom?.mode ?? "example");
    const pool = DOMAIN_POOLS[mode] ?? DOMAIN_POOLS.example;
    const out: string[] = [];
    for (let i = 0; i < n; i++) {
      const first = pick(FIRST_NAMES);
      const last = pick(LAST_NAMES);
      out.push(`${buildLocalPart(first, last)}@${pick(pool)}`);
    }
    return out.join("\n");
  },
};
