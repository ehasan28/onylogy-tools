import type { GenerateOptions, TextGenerator } from "../types";
import wordbank from "./wordbank.json";
import { SENTENCE_TEMPLATES } from "./templates";

interface WordBank {
  nouns: string[];
  verbsPast: string[];
  adjectives: string[];
  adverbs: string[];
  prepositions: string[];
  determiners: string[];
  determinersPlural: string[];
  conjunctions: string[];
  openers: string[];
}

const bank = wordbank as WordBank;

const SENTENCES_PER_PARAGRAPH_MIN = 3;
const SENTENCES_PER_PARAGRAPH_MAX = 6;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillTemplate(template: string): string {
  return template.replace(
    /\[(DET|DETP|N|ADJ|V|ADV|PREP|CONJ|OPENER)\]/g,
    (_, token: string) => {
      switch (token) {
        case "DET":
          return pick(bank.determiners);
        case "DETP":
          return pick(bank.determinersPlural);
        case "N":
          return pick(bank.nouns);
        case "ADJ":
          return pick(bank.adjectives);
        case "V":
          return pick(bank.verbsPast);
        case "ADV":
          return pick(bank.adverbs);
        case "PREP":
          return pick(bank.prepositions);
        case "CONJ":
          return pick(bank.conjunctions);
        case "OPENER":
          return pick(bank.openers);
        default:
          return "";
      }
    },
  );
}

function capitalizeFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateSentence(): string {
  const template = pick(SENTENCE_TEMPLATES);
  let filled = fillTemplate(template);
  filled = filled.replace(/\s+([.,!?])/g, "$1");
  filled = capitalizeFirst(filled);
  return filled;
}

function generateParagraph(sentenceCount?: number): string {
  const n = sentenceCount ?? randInt(SENTENCES_PER_PARAGRAPH_MIN, SENTENCES_PER_PARAGRAPH_MAX);
  const sentences: string[] = [];
  for (let i = 0; i < n; i++) sentences.push(generateSentence());
  return sentences.join(" ");
}

function generateSentences(count: number): string {
  if (count <= 0) return "";
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) sentences.push(generateSentence());
  return sentences.join(" ");
}

function generateParagraphs(count: number): string {
  if (count <= 0) return "";
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) paragraphs.push(generateParagraph());
  return paragraphs.join("\n\n");
}

function generateWords(target: number): string {
  if (target <= 0) return "";
  const parts: string[] = [];
  let words = 0;
  while (words < target) {
    const sentence = generateSentence();
    parts.push(sentence);
    words += sentence.trim().split(/\s+/).filter(Boolean).length;
  }
  let combined = parts.join(" ");
  const tokens = combined.trim().split(/\s+/);
  if (tokens.length > target) {
    let last = tokens[target - 1];
    last = last.replace(/[.,!?;:]+$/, "");
    if (!/[.!?]$/.test(last)) last = `${last}.`;
    tokens.length = target;
    tokens[target - 1] = last;
    combined = tokens.join(" ");
  }
  return combined;
}

export const meaningfulEnglishGenerator: TextGenerator = {
  id: "meaningful-english",
  name: "Meaningful English",
  category: "Text",
  description: "Plausible English text built from a curated word bank and grammatical templates.",
  generate({ unit, count }: GenerateOptions): string {
    const safeCount = Math.max(0, Math.min(count, 5000));
    if (unit === "words") return generateWords(safeCount);
    if (unit === "sentences") return generateSentences(safeCount);
    return generateParagraphs(safeCount);
  },
};
