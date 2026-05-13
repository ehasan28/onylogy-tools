"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  ChevronDown,
  ChevronRight,
  History,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "./ui/Button";
import { formatRelative, type HistoryEntry } from "@/lib/history";

const ICON = { className: "h-4 w-4", strokeWidth: 1.5 } as const;
const SMALL_ICON = { className: "h-3.5 w-3.5", strokeWidth: 1.5 } as const;

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const INITIAL_VISIBLE = 5;
const PREVIEW_LENGTH = 80;

export function HistoryPanel({
  entries,
  onRestore,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  const [open, setOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-border-base bg-surface px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <History {...SMALL_ICON} />
          <span>History will appear here after you generate something.</span>
        </div>
      </div>
    );
  }

  const visible = showAll ? entries : entries.slice(0, INITIAL_VISIBLE);
  const more = entries.length - visible.length;

  return (
    <div className="rounded-xl border border-border-base bg-surface">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-base">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-foreground text-foreground"
          aria-expanded={open}
        >
          {open ? <ChevronDown {...SMALL_ICON} /> : <ChevronRight {...SMALL_ICON} />}
          <History {...SMALL_ICON} />
          <span className="font-display">History</span>
          <span className="text-foreground-muted text-xs tabular-nums">
            ({entries.length})
          </span>
        </button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          aria-label="Clear all history"
        >
          <Trash2 {...SMALL_ICON} />
          Clear all
        </Button>
      </div>

      {open && (
        <ul className="divide-y divide-border-base/60">
          {visible.map((entry) => {
            const expanded = expandedId === entry.id;
            const preview =
              entry.rawText.length > PREVIEW_LENGTH
                ? entry.rawText.slice(0, PREVIEW_LENGTH).trimEnd() + "…"
                : entry.rawText;
            return (
              <li key={entry.id}>
                <div
                  className={clsx(
                    "flex items-start gap-2 px-3 py-2.5 hover:bg-surface-muted/60 transition-colors",
                  )}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(expanded ? null : entry.id)
                    }
                    className="mt-0.5 text-foreground-muted hover:text-foreground cursor-pointer"
                    aria-label={expanded ? "Collapse entry" : "Expand entry"}
                  >
                    {expanded ? (
                      <ChevronDown {...SMALL_ICON} />
                    ) : (
                      <ChevronRight {...SMALL_ICON} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(expanded ? null : entry.id)
                    }
                    className="flex-1 text-left min-w-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-[11px] text-foreground-muted">
                      <span className="font-medium text-foreground-muted">
                        {entry.generatorName}
                      </span>
                      <span aria-hidden>·</span>
                      <span className="tabular-nums">
                        {formatRelative(entry.createdAt)}
                      </span>
                      <span aria-hidden>·</span>
                      <span className="tabular-nums">
                        {entry.count} {entry.unit}
                      </span>
                    </div>
                    <div
                      className={clsx(
                        "text-sm text-foreground mt-0.5 break-words",
                        !expanded && "line-clamp-1",
                      )}
                    >
                      {expanded ? null : preview}
                    </div>
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRestore(entry)}
                      aria-label="Restore this generation"
                      title="Restore"
                      className="!h-7 !w-7 !p-0"
                    >
                      <RotateCcw {...SMALL_ICON} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(entry.id)}
                      aria-label="Delete this entry"
                      title="Delete"
                      className="!h-7 !w-7 !p-0"
                    >
                      <X {...SMALL_ICON} />
                    </Button>
                  </div>
                </div>
                {expanded && (
                  <pre className="mx-3 mb-3 max-h-64 overflow-auto rounded-lg border border-border-base bg-surface-muted p-3 text-xs leading-relaxed whitespace-pre-wrap break-words font-mono">
                    {entry.rawText}
                  </pre>
                )}
              </li>
            );
          })}
          {more > 0 && (
            <li className="px-3 py-2 text-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="text-xs text-foreground-muted hover:text-foreground cursor-pointer"
              >
                Show all ({entries.length})
              </button>
            </li>
          )}
          {showAll && entries.length > INITIAL_VISIBLE && (
            <li className="px-3 py-2 text-center">
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="text-xs text-foreground-muted hover:text-foreground cursor-pointer"
              >
                Show less
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export { type HistoryEntry };
