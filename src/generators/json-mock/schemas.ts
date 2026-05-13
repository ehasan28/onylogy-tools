import { FIRST_NAMES, LAST_NAMES } from "../names/names";
import wordbank from "../meaningful-english/wordbank.json";

interface WordBank {
  nouns: string[];
  adjectives: string[];
}
const bank = wordbank as unknown as WordBank;
const wordPool = [...bank.nouns, ...bank.adjectives];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 14);
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function fullName(): { first: string; last: string; display: string } {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  return { first, last, display: `${first} ${last}` };
}

function email(first: string, last: string): string {
  return `${slug(first)}.${slug(last)}@example.com`;
}

function isoDate(daysAgoMax = 365): string {
  const daysAgo = Math.floor(Math.random() * daysAgoMax);
  const d = new Date(Date.now() - daysAgo * 86_400_000);
  return d.toISOString();
}

function shortPhrase(min: number, max: number): string {
  const n = min + Math.floor(Math.random() * (max - min + 1));
  const words: string[] = [];
  for (let i = 0; i < n; i++) words.push(pick(wordPool));
  return words
    .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function kebabSlug(): string {
  const n = 2 + Math.floor(Math.random() * 2);
  return Array.from({ length: n }, () => slug(pick(wordPool))).join("-");
}

export type Schema = "users" | "products" | "posts" | "comments";

export function buildRecord(schema: Schema): Record<string, unknown> {
  switch (schema) {
    case "users": {
      const { first, last, display } = fullName();
      return {
        id: uuid(),
        name: display,
        email: email(first, last),
        role: pick(["admin", "editor", "viewer"]),
        active: Math.random() < 0.8,
        createdAt: isoDate(),
      };
    }
    case "products": {
      const name = shortPhrase(2, 3);
      return {
        id: uuid(),
        sku: `${pick(["AX", "BY", "CZ", "DM"])}-${100 + Math.floor(Math.random() * 900)}`,
        name,
        price: Number((9.99 + Math.random() * 990).toFixed(2)),
        inStock: Math.random() < 0.7,
        tags: Array.from(
          { length: 1 + Math.floor(Math.random() * 3) },
          () => slug(pick(wordPool)),
        ),
      };
    }
    case "posts": {
      const title = shortPhrase(3, 7);
      const { first, last, display } = fullName();
      const excerpt = shortPhrase(8, 14) + ".";
      return {
        id: uuid(),
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        author: display,
        authorEmail: email(first, last),
        excerpt,
        publishedAt: isoDate(),
      };
    }
    case "comments": {
      const { display } = fullName();
      const body = `${shortPhrase(6, 12)}. ${shortPhrase(5, 10)}.`;
      return {
        id: uuid(),
        postId: uuid(),
        author: display,
        body,
        createdAt: isoDate(60),
      };
    }
  }
}

export function formatRecords(records: Record<string, unknown>[], pretty: boolean): string {
  return pretty ? JSON.stringify(records, null, 2) : JSON.stringify(records);
}

export function kebabFromTitle(_t: string): string {
  return kebabSlug();
}
