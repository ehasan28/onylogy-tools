import type { GenerateOptions, TextGenerator } from "../types";

const CHARSETS: Record<string, string> = {
  alnum: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  numeric: "0123456789",
  hex: "0123456789abcdef",
  symbols:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}<>?",
};

function randomChar(set: string): string {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return set[buf[0] % set.length];
  }
  return set[Math.floor(Math.random() * set.length)];
}

function generateToken(len: number, set: string): string {
  let out = "";
  for (let i = 0; i < len; i++) out += randomChar(set);
  return out;
}

export const randomCharsGenerator: TextGenerator = {
  id: "random-chars",
  name: "Random Characters",
  category: "Identifiers",
  description: "Random alphanumeric tokens — passwords, IDs, mock keys.",
  supportedUnits: ["words"],
  unitLabelOverride: { words: "Tokens" },
  presets: { words: [5, 10, 25, 50, 100] },
  customOptions: [
    {
      key: "length",
      type: "number",
      label: "Length",
      default: 12,
      min: 4,
      max: 64,
    },
    {
      key: "charset",
      type: "select",
      label: "Charset",
      default: "alnum",
      options: [
        { value: "alnum", label: "Alphanumeric" },
        { value: "alpha", label: "Alphabetic" },
        { value: "numeric", label: "Numeric" },
        { value: "hex", label: "Hex" },
        { value: "symbols", label: "+ Symbols" },
      ],
    },
  ],
  generate({ count, custom }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, 1000));
    const len = Math.max(4, Math.min(Number(custom?.length ?? 12), 64));
    const set = CHARSETS[String(custom?.charset ?? "alnum")] ?? CHARSETS.alnum;
    const tokens = Array.from({ length: n }, () => generateToken(len, set));
    return tokens.join("\n");
  },
};
