"use client";

import { useCallback, useEffect, useState } from "react";
import {
  HISTORY_KEY,
  loadHistory,
  makeEntry,
  pushEntry,
  removeEntry,
  saveHistory,
  type HistoryEntry,
} from "@/lib/history";

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEntries(loadHistory());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    saveHistory(entries);
  }, [entries, mounted]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === HISTORY_KEY) setEntries(loadHistory());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const push = useCallback(
    (data: Omit<HistoryEntry, "id" | "createdAt">) => {
      setEntries((prev) => pushEntry(prev, makeEntry(data)));
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setEntries((prev) => removeEntry(prev, id));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  return { entries, push, remove, clear, mounted };
}
