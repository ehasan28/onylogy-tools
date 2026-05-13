import type { Unit, CustomValues } from "@/generators/types";

export const HISTORY_KEY = "tg-history";
export const HISTORY_CAP = 10;

export interface HistoryEntry {
  id: string;
  generatorId: string;
  generatorName: string;
  unit: Unit;
  count: number;
  custom?: CustomValues;
  rawText: string;
  createdAt: number;
}

function safeParse(raw: string | null): HistoryEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is HistoryEntry =>
        e && typeof e.id === "string" && typeof e.rawText === "string",
    );
  } catch {
    return [];
  }
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(HISTORY_KEY));
}

export function saveHistory(entries: HistoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {}
}

export function makeEntry(
  data: Omit<HistoryEntry, "id" | "createdAt">,
): HistoryEntry {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return { ...data, id, createdAt: Date.now() };
}

export function pushEntry(
  entries: HistoryEntry[],
  entry: HistoryEntry,
): HistoryEntry[] {
  const next = [entry, ...entries];
  if (next.length > HISTORY_CAP) next.length = HISTORY_CAP;
  return next;
}

export function removeEntry(
  entries: HistoryEntry[],
  id: string,
): HistoryEntry[] {
  return entries.filter((e) => e.id !== id);
}

export function formatRelative(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 5000) return "just now";
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  const days = Math.floor(diff / 86_400_000);
  return `${days}d ago`;
}
