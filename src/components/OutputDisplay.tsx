"use client";

import clsx from "clsx";
import { FileText } from "lucide-react";

interface OutputDisplayProps {
  text: string;
  htmlMode: boolean;
}

export function OutputDisplay({ text, htmlMode }: OutputDisplayProps) {
  const isEmpty = !text;

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Generated text output"
      className={clsx(
        "relative rounded-xl border border-border-base bg-surface",
        "min-h-[300px] sm:min-h-[440px]",
      )}
    >
      {isEmpty ? (
        <EmptyState />
      ) : (
        <pre
          className={clsx(
            "whitespace-pre-wrap break-words p-5 sm:p-6 text-[15px] leading-relaxed",
            htmlMode ? "font-mono text-[13px] leading-relaxed" : "font-body",
          )}
        >
          {text}
        </pre>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-foreground-muted">
      <div className="rounded-full bg-surface-muted p-3 mb-3">
        <FileText className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <p className="font-display text-base text-foreground">Nothing generated yet</p>
      <p className="text-xs mt-1 max-w-xs">
        Pick a generator and press{" "}
        <span className="font-medium text-foreground">Generate</span>.
      </p>
    </div>
  );
}
