import type { GenerateOptions, TextGenerator } from "../types";

function uuidv4(): string {
  const g = (typeof globalThis !== "undefined" ? globalThis : undefined) as
    | { crypto?: Crypto & { randomUUID?: () => string } }
    | undefined;
  const c = g?.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  const b = new Uint8Array(16);
  if (c && typeof c.getRandomValues === "function") {
    c.getRandomValues(b);
  } else {
    for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
  }
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export const uuidsGenerator: TextGenerator = {
  id: "uuids",
  name: "UUIDs (v4)",
  category: "Identifiers",
  description: "RFC 4122 v4 UUIDs.",
  supportedUnits: ["words"],
  unitLabelOverride: { words: "UUIDs" },
  presets: { words: [5, 10, 25, 50, 100] },
  generate({ count }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, 1000));
    return Array.from({ length: n }, uuidv4).join("\n");
  },
};
