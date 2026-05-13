import type { GenerateOptions, TextGenerator } from "../types";

function randomByte(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const b = new Uint8Array(1);
    crypto.getRandomValues(b);
    return b[0];
  }
  return Math.floor(Math.random() * 256);
}

function toHex(n: number, lowercase: boolean): string {
  const s = n.toString(16).padStart(2, "0");
  return lowercase ? s : s.toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export const hexColorsGenerator: TextGenerator = {
  id: "hex-colors",
  name: "HEX Colors",
  category: "Design",
  description: "Random color codes in HEX, RGB, or HSL.",
  supportedUnits: ["words"],
  unitLabelOverride: { words: "Colors" },
  presets: { words: [5, 10, 20, 50, 100] },
  customOptions: [
    {
      key: "format",
      type: "select",
      label: "Format",
      default: "hex",
      options: [
        { value: "hex", label: "HEX" },
        { value: "rgb", label: "RGB" },
        { value: "hsl", label: "HSL" },
      ],
    },
    {
      key: "lowercase",
      type: "toggle",
      label: "Lowercase",
      default: true,
    },
  ],
  generate({ count, custom }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, 500));
    const format = String(custom?.format ?? "hex");
    const lower = Boolean(custom?.lowercase ?? true);
    const out: string[] = [];
    for (let i = 0; i < n; i++) {
      const r = randomByte();
      const g = randomByte();
      const b = randomByte();
      if (format === "rgb") {
        out.push(`rgb(${r}, ${g}, ${b})`);
      } else if (format === "hsl") {
        const [h, s, l] = rgbToHsl(r, g, b);
        out.push(`hsl(${h}, ${s}%, ${l}%)`);
      } else {
        out.push(`#${toHex(r, lower)}${toHex(g, lower)}${toHex(b, lower)}`);
      }
    }
    return out.join("\n");
  },
};
