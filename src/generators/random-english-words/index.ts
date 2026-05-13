import type { GenerateOptions, TextGenerator } from "../types";
import wordbank from "../meaningful-english/wordbank.json";

interface WordBank {
  nouns: string[];
  verbsPast: string[];
  adjectives: string[];
  adverbs: string[];
}
const bank = wordbank as unknown as WordBank;
const pool = [
  ...bank.nouns,
  ...bank.verbsPast,
  ...bank.adjectives,
  ...bank.adverbs,
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const randomEnglishWordsGenerator: TextGenerator = {
  id: "random-english-words",
  name: "Random English Words",
  category: "Text",
  description: "Loose stream of unconnected English words — no punctuation or grammar.",
  supportedUnits: ["words"],
  presets: { words: [10, 25, 50, 100, 250] },
  generate({ count }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, 5000));
    const out: string[] = [];
    for (let i = 0; i < n; i++) out.push(pick(pool));
    return out.join(" ");
  },
};
