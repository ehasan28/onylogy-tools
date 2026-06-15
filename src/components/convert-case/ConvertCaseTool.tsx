"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Check, Copy, Download, Share2, Trash2 } from "lucide-react";
import { applyCaseMode, CASE_MODES, type CaseModeId } from "@/lib/case";
import { downloadAsTextFile } from "@/lib/download";
import { Button } from "../ui/Button";

const ICON = { className: "h-3.5 w-3.5", strokeWidth: 1.75 } as const;

const SAMPLE = "Hello World — convert this text to any case";

export function ConvertCaseTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<CaseModeId>("sentence");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => applyCaseMode(input, mode), [input, mode]);

  const stats = useMemo(() => {
    const trimmed = input.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const characters = input.length;
    const sentences = input
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;
    const lines = input.length ? input.split(/\r\n|\r|\n/).length : 0;
    return { characters, words, sentences, lines };
  }, [input]);

  const flash = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      flash();
    } catch {}
  };

  const handleShare = async () => {
    if (!output) return;
    const url = typeof window !== "undefined" ? window.location.href : undefined;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Onylogy — Convert Case", text: output, url });
      } else {
        await navigator.clipboard.writeText(output);
        flash();
      }
    } catch {}
  };

  const handleDownload = () => {
    if (!output) return;
    downloadAsTextFile(output, "converted-text.txt");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-[26px] sm:text-[32px] font-semibold tracking-tight">
          Convert Case
        </h1>
        <p className="text-sm text-foreground-muted mt-2">
          Paste any text, pick a case, then copy, share, or download the result.
        </p>
      </header>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-x-4 gap-y-3">
        <div className="flex flex-wrap gap-2">
          {CASE_MODES.map((m) => {
            const active = m.id === mode;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={clsx(
                  "h-9 px-3.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  active
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-surface text-foreground-muted border-border-base hover:text-foreground hover:border-border-strong",
                )}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 md:justify-end">
          <Button
            onClick={handleCopy}
            variant="secondary"
            size="md"
            disabled={!output}
            aria-label="Copy output"
          >
            {copied ? <Check {...ICON} /> : <Copy {...ICON} />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            onClick={handleShare}
            variant="secondary"
            size="md"
            disabled={!output}
            aria-label="Share output"
          >
            <Share2 {...ICON} />
            Share
          </Button>
          <Button
            onClick={handleDownload}
            variant="secondary"
            size="md"
            disabled={!output}
            aria-label="Download output as a text file"
          >
            <Download {...ICON} />
            Download
          </Button>
          <Button
            onClick={() => setInput("")}
            variant="secondary"
            size="md"
            disabled={!input}
            aria-label="Clear input"
          >
            <Trash2 {...ICON} />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border-base bg-surface shadow-card flex flex-col">
          <label
            htmlFor="convertcase-input"
            className="block text-[10px] font-semibold uppercase tracking-wider text-foreground-muted/80 px-4 pt-3"
          >
            Input
          </label>
          <textarea
            id="convertcase-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={SAMPLE}
            rows={11}
            spellCheck={false}
            className="flex-1 w-full bg-transparent px-4 pb-4 pt-2 text-[15px] leading-relaxed resize-none outline-none font-mono"
          />
        </div>

        <div className="rounded-2xl border border-border-base bg-surface shadow-card flex flex-col">
          <label
            htmlFor="convertcase-output"
            className="block text-[10px] font-semibold uppercase tracking-wider text-foreground-muted/80 px-4 pt-3"
          >
            Output
          </label>
          <textarea
            id="convertcase-output"
            value={output}
            readOnly
            rows={11}
            spellCheck={false}
            className="flex-1 w-full bg-transparent px-4 pb-4 pt-2 text-[15px] leading-relaxed resize-none outline-none font-mono"
            placeholder="Transformed text will appear here…"
          />
        </div>
      </div>

      <div
        aria-label="Text statistics"
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-4 py-2.5 rounded-xl border border-border-base bg-surface shadow-card text-xs"
      >
        <Stat label="Characters" value={stats.characters} />
        <Dot />
        <Stat label="Words" value={stats.words} />
        <Dot />
        <Stat label="Sentences" value={stats.sentences} />
        <Dot />
        <Stat label="Lines" value={stats.lines} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="uppercase tracking-wider text-[10px] text-foreground-muted">
        {label}
      </span>
      <span className="font-semibold tabular-nums">{value.toLocaleString()}</span>
    </span>
  );
}

function Dot() {
  return (
    <span aria-hidden className="text-foreground-muted/40">
      ·
    </span>
  );
}
