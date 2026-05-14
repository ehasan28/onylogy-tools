export type CaseModeId =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "alternating";

export interface CaseModeInfo {
  id: CaseModeId;
  label: string;
}

export const CASE_MODES: CaseModeInfo[] = [
  { id: "upper", label: "UPPERCASE" },
  { id: "lower", label: "lowercase" },
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "camel", label: "camelCase" },
  { id: "pascal", label: "PascalCase" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" },
  { id: "constant", label: "CONSTANT_CASE" },
  { id: "alternating", label: "aLtErNaTiNg" },
];

/**
 * Split a string into word tokens for join-style cases (camel/pascal/snake/kebab/constant).
 * Handles whitespace, punctuation, and camelHumps so "fooBarBaz" → ["foo","bar","baz"].
 */
function tokenize(input: string): string[] {
  if (!input) return [];
  // Insert space at camelHump boundaries first
  const withBreaks = input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  return withBreaks
    .split(/[^a-zA-Z0-9]+/g)
    .map((t) => t.trim())
    .filter(Boolean);
}

export function toUpper(s: string): string {
  return s.toUpperCase();
}

export function toLower(s: string): string {
  return s.toLowerCase();
}

export function toTitle(s: string): string {
  return s.replace(
    /\b([a-zA-Z])([a-zA-Z']*)/g,
    (_, first: string, rest: string) =>
      first.toUpperCase() + rest.toLowerCase(),
  );
}

export function toSentence(s: string): string {
  const lowered = s.toLowerCase();
  return lowered.replace(
    /(^|[.!?]\s+|\n\s*)([a-z])/g,
    (_, prefix: string, ch: string) => prefix + ch.toUpperCase(),
  );
}

export function toCamel(s: string): string {
  const tokens = tokenize(s);
  if (tokens.length === 0) return "";
  return tokens
    .map((t, i) =>
      i === 0
        ? t.toLowerCase()
        : t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(),
    )
    .join("");
}

export function toPascal(s: string): string {
  const tokens = tokenize(s);
  return tokens
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
    .join("");
}

export function toSnake(s: string): string {
  return tokenize(s).map((t) => t.toLowerCase()).join("_");
}

export function toKebab(s: string): string {
  return tokenize(s).map((t) => t.toLowerCase()).join("-");
}

export function toConstant(s: string): string {
  return tokenize(s).map((t) => t.toUpperCase()).join("_");
}

export function toAlternating(s: string): string {
  let upperNext = false;
  let out = "";
  for (const ch of s) {
    if (/[a-zA-Z]/.test(ch)) {
      out += upperNext ? ch.toUpperCase() : ch.toLowerCase();
      upperNext = !upperNext;
    } else {
      out += ch;
    }
  }
  return out;
}

export function applyCaseMode(input: string, mode: CaseModeId): string {
  switch (mode) {
    case "upper": return toUpper(input);
    case "lower": return toLower(input);
    case "title": return toTitle(input);
    case "sentence": return toSentence(input);
    case "camel": return toCamel(input);
    case "pascal": return toPascal(input);
    case "snake": return toSnake(input);
    case "kebab": return toKebab(input);
    case "constant": return toConstant(input);
    case "alternating": return toAlternating(input);
  }
}
