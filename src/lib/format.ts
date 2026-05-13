export type CaseMode = "original" | "upper" | "lower" | "title" | "sentence";
export type LineBreakMode = "double" | "single";

export function applyCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text.replace(
        /\b([a-zA-Z])([a-zA-Z']*)/g,
        (_, first: string, rest: string) =>
          first.toUpperCase() + rest.toLowerCase(),
      );
    case "sentence": {
      const lowered = text.toLowerCase();
      return lowered.replace(
        /(^|[.!?]\s+|\n\s*)([a-z])/g,
        (_, prefix: string, ch: string) => prefix + ch.toUpperCase(),
      );
    }
    case "original":
    default:
      return text;
  }
}

export function applyLineBreaks(text: string, mode: LineBreakMode): string {
  if (mode === "single") {
    return text.replace(/\n\s*\n/g, "\n");
  }
  return text;
}

export function wrapHtmlParagraphs(text: string): string {
  return text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0)
    .map((p) => `<p>${escapeHtml(p.trim())}</p>`)
    .join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
