import type { GenerateOptions, TextGenerator } from "../types";
import wordbank from "../meaningful-english/wordbank.json";

interface WordBank {
  nouns: string[];
  adjectives: string[];
}
const bank = wordbank as unknown as WordBank;
const pool = [...bank.nouns, ...bank.adjectives];

const TLDS = ["com", "io", "dev", "app", "co", "tech", "net"];
const QUERY_KEYS = ["ref", "utm_source", "id", "page", "q", "tag", "v"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clean(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildHost(): string {
  const a = clean(pick(pool));
  const b = clean(pick(pool));
  return `${a}${b}.${pick(TLDS)}`;
}

function buildPath(): string {
  const segs = randInt(1, 3);
  const parts: string[] = [];
  for (let i = 0; i < segs; i++) {
    const wc = randInt(1, 3);
    const seg: string[] = [];
    for (let j = 0; j < wc; j++) seg.push(clean(pick(pool)));
    parts.push(seg.join("-"));
  }
  return parts.join("/");
}

function buildQuery(): string {
  const keyCount = randInt(1, 3);
  const used = new Set<string>();
  const parts: string[] = [];
  while (parts.length < keyCount) {
    const k = pick(QUERY_KEYS);
    if (used.has(k)) continue;
    used.add(k);
    parts.push(`${k}=${clean(pick(pool))}`);
  }
  return parts.join("&");
}

export const urlsGenerator: TextGenerator = {
  id: "urls",
  name: "URLs",
  category: "Identifiers",
  description: "Realistic-looking URLs with optional query strings.",
  supportedUnits: ["words"],
  unitLabelOverride: { words: "URLs" },
  presets: { words: [5, 10, 25, 50] },
  customOptions: [
    {
      key: "protocol",
      type: "select",
      label: "Protocol",
      default: "https",
      options: [
        { value: "https", label: "https" },
        { value: "http", label: "http" },
        { value: "mixed", label: "mixed" },
      ],
    },
    {
      key: "query",
      type: "toggle",
      label: "Query string",
      default: false,
    },
  ],
  generate({ count, custom }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, 500));
    const proto = String(custom?.protocol ?? "https");
    const query = Boolean(custom?.query ?? false);
    const out: string[] = [];
    for (let i = 0; i < n; i++) {
      const p = proto === "mixed" ? (Math.random() < 0.5 ? "https" : "http") : proto;
      let url = `${p}://${buildHost()}/${buildPath()}`;
      if (query) url += `?${buildQuery()}`;
      out.push(url);
    }
    return out.join("\n");
  },
};
