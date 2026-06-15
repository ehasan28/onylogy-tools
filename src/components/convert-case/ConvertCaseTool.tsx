"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Check, Copy, Trash2 } from "lucide-react";
import { applyCaseMode, CASE_MODES, type CaseModeId } from "@/lib/case";
import { Button } from "../ui/Button";

const ICON = { className: "h-4 w-4", strokeWidth: 1.5 } as const;

const SAMPLE = "Hello World — convert this text to any case";

export function ConvertCaseTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<CaseModeId>("upper");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => applyCaseMode(input, mode), [input, mode]);

  const stats = useMemo(() => {
    const trimmed = input.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s+/g, "").length;
    return { words, chars, charsNoSpaces };
  }, [input]);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-[26px] sm:text-[32px] font-semibold tracking-tight">
          Convert Case
        </h1>
        <p className="text-sm text-foreground-muted mt-2">
          Paste any text and transform it between UPPERCASE, lowercase, Title Case, and more.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border-base bg-surface shadow-card flex flex-col">
          <div className="flex items-center justify-between gap-2 px-4 pt-3">
            <label
              htmlFor="convertcase-input"
              className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted/80"
            >
              Input
            </label>
            <span
              aria-label="Text statistics"
              className="flex items-center gap-1.5 text-[11px] text-foreground-muted tabular-nums"
            >
              <Stat label="words" value={stats.words} />
              <Dot />
              <Stat label="chars" value={stats.chars} />
              <Dot />
              <Stat label="no spaces" value={stats.charsNoSpaces} />
            </span>
          </div>
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

      <div className="flex flex-wrap items-center gap-2">
        {CASE_MODES.map((m) => {
          const active = m.id === mode;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={clsx(
                "h-9 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer border",
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
        <div className="ml-auto flex items-center gap-2">
          <Button
            onClick={handleCopy}
            variant="secondary"
            size="md"
            disabled={!output}
            aria-label="Copy output"
          >
            {copied ? <Check {...ICON} /> : <Copy {...ICON} />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            onClick={() => setInput("")}
            variant="ghost"
            size="md"
            disabled={!input}
            aria-label="Clear input"
          >
            <Trash2 {...ICON} />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span>
      <span className="font-semibold text-foreground">{value.toLocaleString()}</span> {label}
    </span>
  );
}

function Dot() {
  return <span aria-hidden className="text-foreground-muted/40">·</span>;
}
