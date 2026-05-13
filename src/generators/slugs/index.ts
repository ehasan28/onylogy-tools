import type { GenerateOptions, TextGenerator } from "../types";
import wordbank from "../meaningful-english/wordbank.json";

interface WordBank {
  nouns: string[];
  adjectives: string[];
  verbsPast: string[];
}
const bank = wordbank as unknown as WordBank;
const pool = [...bank.nouns, ...bank.adjectives, ...bank.verbsPast];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clean(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function buildSlug(wordsPer: number): string {
  const parts: string[] = [];
  for (let i = 0; i < wordsPer; i++) {
    let w = clean(pick(pool));
    if (!w) w = "word";
    parts.push(w);
  }
  return parts.join("-");
}

export const slugsGenerator: TextGenerator = {
  id: "slugs",
  name: "URL Slugs",
  category: "Identifiers",
  description: "Kebab-case URL slugs.",
  supportedUnits: ["words"],
  unitLabelOverride: { words: "Slugs" },
  presets: { words: [5, 10, 25, 50] },
  customOptions: [
    {
      key: "wordsPer",
      type: "number",
      label: "Words/slug",
      default: 3,
      min: 2,
      max: 6,
    },
  ],
  generate({ count, custom }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, 500));
    const wordsPer = Math.max(2, Math.min(Number(custom?.wordsPer ?? 3), 6));
    return Array.from({ length: n }, () => buildSlug(wordsPer)).join("\n");
  },
};
