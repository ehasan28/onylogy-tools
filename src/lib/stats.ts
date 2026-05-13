export interface Stats {
  words: number;
  chars: number;
  charsNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeSeconds: number;
}

const WORDS_PER_MINUTE = 200;

export function computeStats(text: string): Stats {
  if (!text || !text.trim()) {
    return {
      words: 0,
      chars: 0,
      charsNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeSeconds: 0,
    };
  }

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s+/g, "").length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = (text.match(/[^.!?\n]+[.!?]+/g) || []).length;
  const paragraphs = text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length;
  const readingTimeSeconds = Math.ceil((words / WORDS_PER_MINUTE) * 60);

  return { words, chars, charsNoSpaces, sentences, paragraphs, readingTimeSeconds };
}

export function formatReadingTime(seconds: number): string {
  if (seconds < 1) return "0 sec";
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const rem = seconds % 60;
  if (rem === 0) return `${minutes} min`;
  return `${minutes} min ${rem} sec`;
}
