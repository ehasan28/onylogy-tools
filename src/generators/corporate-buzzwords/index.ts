import type { GenerateOptions, TextGenerator } from "../types";
import { BUZZ } from "./words";
import { BUZZ_TEMPLATES } from "./templates";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillTemplate(t: string): string {
  return t.replace(/\[(V|ADJ|N|CONN)\]/g, (_, tok: string) => {
    switch (tok) {
      case "V":
        return pick(BUZZ.verbs);
      case "ADJ":
        return pick(BUZZ.adjectives);
      case "N":
        return pick(BUZZ.nouns);
      case "CONN":
        return pick(BUZZ.connectors);
      default:
        return "";
    }
  });
}

function buildSentence(): string {
  let s = fillTemplate(pick(BUZZ_TEMPLATES));
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return s;
}

export const corporateBuzzwordsGenerator: TextGenerator = {
  id: "corporate-buzzwords",
  name: "Corporate Buzzwords",
  category: "Text",
  description: "SaaS-style jargon for slide decks and product mockups.",
  supportedUnits: ["sentences", "paragraphs"],
  presets: {
    sentences: [3, 5, 10, 20],
    paragraphs: [1, 3, 5, 10],
  },
  generate({ unit, count }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, unit === "sentences" ? 500 : 100));
    if (n === 0) return "";
    if (unit === "sentences") {
      return Array.from({ length: n }, buildSentence).join(" ");
    }
    const paras: string[] = [];
    for (let i = 0; i < n; i++) {
      const sCount = randInt(3, 5);
      paras.push(Array.from({ length: sCount }, buildSentence).join(" "));
    }
    return paras.join("\n\n");
  },
};
