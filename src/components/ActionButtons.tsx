"use client";

import {
  Check,
  Copy,
  Download,
  RefreshCw,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button";
import { downloadAsTextFile } from "@/lib/download";

interface ActionButtonsProps {
  text: string;
  onGenerate: () => void;
  onClear: () => void;
  onReset?: () => void;
  canReset?: boolean;
  hasOutput: boolean;
}

const ICON = { className: "h-4 w-4", strokeWidth: 1.5 } as const;

export function ActionButtons({
  text,
  onGenerate,
  onClear,
  onReset,
  canReset = false,
  hasOutput,
}: ActionButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {}
      document.body.removeChild(ta);
    }
  };

  const handleDownload = () => {
    if (!text) return;
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    downloadAsTextFile(text, `generated-${stamp}.txt`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={onGenerate} variant="primary" size="md">
        <RefreshCw {...ICON} />
        {hasOutput ? "Regenerate" : "Generate"}
      </Button>
      <Button
        onClick={handleCopy}
        variant="secondary"
        size="md"
        disabled={!hasOutput}
        aria-label="Copy to clipboard"
      >
        {copied ? <Check {...ICON} /> : <Copy {...ICON} />}
        {copied ? "Copied!" : "Copy"}
      </Button>
      <Button
        onClick={handleDownload}
        variant="secondary"
        size="md"
        disabled={!hasOutput}
        aria-label="Download as .txt file"
      >
        <Download {...ICON} />
        Download
      </Button>
      <div className="ml-auto flex items-center gap-2">
        {onReset && (
          <Button
            onClick={onReset}
            variant="ghost"
            size="md"
            disabled={!canReset}
            aria-label="Reset settings to defaults"
            title="Reset settings"
          >
            <RotateCcw {...ICON} />
            Reset
          </Button>
        )}
        <Button
          onClick={onClear}
          variant="ghost"
          size="md"
          disabled={!hasOutput}
          aria-label="Clear output"
        >
          <Trash2 {...ICON} />
          Clear
        </Button>
      </div>
    </div>
  );
}
