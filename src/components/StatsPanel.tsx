"use client";

import { formatReadingTime, type Stats } from "@/lib/stats";

interface StatsPanelProps {
  stats: Stats;
}

interface Tile {
  label: string;
  value: string;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const tiles: Tile[] = [
    { label: "Words", value: stats.words.toLocaleString() },
    { label: "Chars", value: stats.chars.toLocaleString() },
    { label: "No spaces", value: stats.charsNoSpaces.toLocaleString() },
    { label: "Sentences", value: stats.sentences.toLocaleString() },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
    { label: "Reading", value: formatReadingTime(stats.readingTimeSeconds) },
  ];

  return (
    <div
      className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 rounded-xl border border-border-base bg-surface text-xs"
      aria-label="Text statistics"
    >
      {tiles.map((t, i) => (
        <div key={t.label} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden className="text-foreground-muted/40">·</span>}
          <span className="text-foreground-muted uppercase tracking-wider text-[10px]">
            {t.label}
          </span>
          <span className="font-semibold tabular-nums">{t.value}</span>
        </div>
      ))}
    </div>
  );
}
