import type { GenerateOptions, TextGenerator } from "../types";
import { CLASSIC_OPENING, LOREM_WORDS } from "./words";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildSentence(): string {
  const len = randInt(8, 18);
  const words: string[] = [];
  for (let i = 0; i < len; i++) words.push(pick(LOREM_WORDS));
  // Occasional comma at midpoint
  if (len >= 12 && Math.random() < 0.6) {
    const at = randInt(4, len - 4);
    words[at] = words[at] + ",";
  }
  let s = words.join(" ");
  s = s.charAt(0).toUpperCase() + s.slice(1) + ".";
  return s;
}

function buildSentences(n: number, startWithClassic: boolean): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    if (i === 0 && startWithClassic) {
      const tail: string[] = [];
      const tailLen = randInt(6, 12);
      for (let j = 0; j < tailLen; j++) tail.push(pick(LOREM_WORDS));
      const all = [...CLASSIC_OPENING, ...tail];
      let s = all.join(" ");
      s = s.charAt(0).toUpperCase() + s.slice(1) + ".";
      out.push(s);
    } else {
      out.push(buildSentence());
    }
  }
  return out;
}

export const loremIpsumGenerator: TextGenerator = {
  id: "lorem-ipsum",
  name: "Lorem Ipsum",
  category: "Text",
  description: "Classic Latin placeholder text.",
  customOptions: [
    {
      key: "startWithClassic",
      type: "toggle",
      label: "Classic start",
      default: true,
    },
  ],
  generate({ unit, count, custom }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, 5000));
    const startWithClassic = Boolean(custom?.startWithClassic ?? true);
    if (n === 0) return "";

    if (unit === "sentences") {
      return buildSentences(n, startWithClassic).join(" ");
    }
    if (unit === "paragraphs") {
      const paras: string[] = [];
      for (let i = 0; i < n; i++) {
        const sCount = randInt(3, 6);
        const sentences = buildSentences(sCount, i === 0 && startWithClassic);
        paras.push(sentences.join(" "));
      }
      return paras.join("\n\n");
    }
    // words
    const sentences: string[] = [];
    let words = 0;
    let first = true;
    while (words < n) {
      const s = first && startWithClassic ? buildSentences(1, true)[0] : buildSentence();
      first = false;
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
