import { meaningfulEnglishGenerator } from "../meaningful-english";

export type Block =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "quote"; text: string };

export interface StructuredToggles {
  includeLists: boolean;
  includeQuotes: boolean;
  includeHeadings: boolean;
  includeLinks: boolean;
}

const DEFAULTS: StructuredToggles = {
  includeLists: true,
  includeQuotes: true,
  includeHeadings: true,
  includeLinks: true,
};

function pickKind(toggles: StructuredToggles): Block["kind"] {
  const choices: Block["kind"][] = ["p", "p", "p"];
  if (toggles.includeHeadings) choices.push("h2", "h3");
  if (toggles.includeLists) choices.push("ul", "ol");
  if (toggles.includeQuotes) choices.push("quote");
  return choices[Math.floor(Math.random() * choices.length)];
}

function sentence(): string {
  return meaningfulEnglishGenerator.generate({ unit: "sentences", count: 1 });
}

function shortPhrase(): string {
  const words = meaningfulEnglishGenerator
    .generate({ unit: "words", count: 4 + Math.floor(Math.random() * 4) })
    .replace(/[.,!?;:]+$/, "");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function paragraphText(): string {
  const n = 3 + Math.floor(Math.random() * 3);
  return meaningfulEnglishGenerator.generate({ unit: "sentences", count: n });
}

function maybeInlineLink(text: string, toggles: StructuredToggles): string {
  if (!toggles.includeLinks) return text;
  if (Math.random() > 0.4) return text;
  const tokens = text.split(" ");
  if (tokens.length < 5) return text;
  const i = 2 + Math.floor(Math.random() * (tokens.length - 4));
  const len = 1 + Math.floor(Math.random() * 2);
  const phrase = tokens.slice(i, i + len).join(" ");
  const replacement = `__LINK_OPEN__${phrase}__LINK_CLOSE__`;
  return [...tokens.slice(0, i), replacement, ...tokens.slice(i + len)].join(" ");
}

export function generateBlocks(
  unit: "words" | "sentences" | "paragraphs",
  count: number,
  togglesPartial?: Partial<StructuredToggles>,
): Block[] {
  const toggles = { ...DEFAULTS, ...(togglesPartial ?? {}) };
  const blocks: Block[] = [];
  const planSize =
    unit === "paragraphs" ? count : unit === "sentences" ? Math.max(1, Math.ceil(count / 4)) : Math.max(1, Math.ceil(count / 40));
  if (toggles.includeHeadings) blocks.push({ kind: "h2", text: shortPhrase() });
  for (let i = blocks.length; i < planSize; i++) {
    const k = pickKind(toggles);
    if (k === "h2" || k === "h3") {
      blocks.push({ kind: k, text: shortPhrase() });
    } else if (k === "ul" || k === "ol") {
      const items = Array.from(
        { length: 3 + Math.floor(Math.random() * 3) },
        () => shortPhrase(),
      );
      blocks.push({ kind: k, items });
    } else if (k === "quote") {
      blocks.push({ kind: "quote", text: maybeInlineLink(sentence(), toggles) });
    } else {
      blocks.push({ kind: "p", text: maybeInlineLink(paragraphText(), toggles) });
    }
  }
  return blocks;
}

export function renderHtml(blocks: Block[]): string {
  const out: string[] = [];
  for (const b of blocks) {
    switch (b.kind) {
      case "h2":
        out.push(`<h2>${escape(b.text)}</h2>`);
        break;
      case "h3":
        out.push(`<h3>${escape(b.text)}</h3>`);
        break;
      case "p":
        out.push(`<p>${inlineHtml(b.text)}</p>`);
        break;
      case "ul":
        out.push(
          "<ul>\n" +
            b.items.map((i) => `  <li>${escape(i)}</li>`).join("\n") +
            "\n</ul>",
        );
        break;
      case "ol":
        out.push(
          "<ol>\n" +
            b.items.map((i) => `  <li>${escape(i)}</li>`).join("\n") +
            "\n</ol>",
        );
        break;
      case "quote":
        out.push(`<blockquote>\n  <p>${inlineHtml(b.text)}</p>\n</blockquote>`);
        break;
    }
  }
  return out.join("\n\n");
}

export function renderMarkdown(blocks: Block[]): string {
  const out: string[] = [];
  for (const b of blocks) {
    switch (b.kind) {
      case "h2":
        out.push(`## ${b.text}`);
        break;
      case "h3":
        out.push(`### ${b.text}`);
        break;
      case "p":
        out.push(inlineMd(b.text));
        break;
      case "ul":
        out.push(b.items.map((i) => `- ${i}`).join("\n"));
        break;
      case "ol":
        out.push(b.items.map((i, idx) => `${idx + 1}. ${i}`).join("\n"));
        break;
      case "quote":
        out.push(`> ${inlineMd(b.text)}`);
        break;
    }
  }
  return out.join("\n\n");
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inlineHtml(text: string): string {
  const escaped = escape(text);
  return escaped
    .replace(/__LINK_OPEN__/g, '<a href="#">')
    .replace(/__LINK_CLOSE__/g, "</a>");
}

function inlineMd(text: string): string {
  return text
    .replace(/__LINK_OPEN__/g, "[")
    .replace(/__LINK_CLOSE__/g, "](#)");
}
