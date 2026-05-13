import type { GenerateOptions, TextGenerator } from "../types";
import { HIPSTER_WORDS } from "./words";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildSentence(): string {
  const len = randInt(7, 16);
  const words: string[] = [];
  for (let i = 0; i < len; i++) words.push(pick(HIPSTER_WORDS));
  if (len >= 10 && Math.random() < 0.5) {
    const at = randInt(3, len - 3);
    words[at] = words[at] + ",";
  }
  let s = words.join(" ");
  s = s.charAt(0).toUpperCase() + s.slice(1) + ".";
  return s;
}

function buildSentences(n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(buildSentence());
  return out;
}

export const hipsterIpsumGenerator: TextGenerator = {
  id: "hipster-ipsum",
  name: "Hipster Ipsum",
  category: "Text",
  description: "Trendy themed filler text with hipster vocabulary.",
  generate({ unit, count }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, 5000));
    if (n === 0) return "";
    if (unit === "sentences") return buildSentences(n).join(" ");
    if (unit === "paragraphs") {
      const paras: string[] = [];
      for (let i = 0; i < n; i++) {
        const sCount = randInt(3, 6);
        paras.push(buildSentences(sCount).join(" "));
      }
      return paras.join("\n\n");
    }
    const sentences: string[] = [];
    let words = 0;
    while (words < n) {
      const s = buildSentence();
      sentences.push(s);
      words += s.trim().split(/\s+/).filter(Boolean).length;
    }
    const tokens = sentences.join(" ").trim().split(/\s+/);
    if (tokens.length > n) {
      let last = tokens[n - 1].replace(/[.,!?;:]+$/, "");
      if (!/[.!?]$/.test(last)) last += ".";
      tokens.length = n;
      tokens[n - 1] = last;
    }
    return tokens.join(" ");
  },
};
