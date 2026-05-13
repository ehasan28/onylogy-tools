import type { GenerateOptions, TextGenerator } from "../types";
import { generateBlocks, renderMarkdown } from "../_shared/structured-content";

export const markdownGenerator: TextGenerator = {
  id: "markdown",
  name: "Markdown",
  category: "Web Dev",
  description: "Markdown with headings, paragraphs, lists, blockquotes.",
  customOptions: [
    { key: "includeHeadings", type: "toggle", label: "Headings", default: true },
    { key: "includeLists", type: "toggle", label: "Lists", default: true },
    { key: "includeQuotes", type: "toggle", label: "Quotes", default: true },
    { key: "includeLinks", type: "toggle", label: "Links", default: true },
  ],
  generate({ unit, count, custom }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, unit === "paragraphs" ? 50 : 500));
    if (n === 0) return "";
    const blocks = generateBlocks(unit, n, {
      includeHeadings: Boolean(custom?.includeHeadings ?? true),
      includeLists: Boolean(custom?.includeLists ?? true),
      includeQuotes: Boolean(custom?.includeQuotes ?? true),
      includeLinks: Boolean(custom?.includeLinks ?? true),
    });
    return renderMarkdown(blocks);
  },
};
