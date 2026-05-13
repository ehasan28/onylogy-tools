"use client";

import { useMemo, useReducer } from "react";
import { Sparkles } from "lucide-react";
import { ActionButtons } from "./ActionButtons";
import { HistoryPanel } from "./HistoryPanel";
import { OutputDisplay } from "./OutputDisplay";
import { SettingsPanel, type SettingsState } from "./SettingsPanel";
import { StatsPanel } from "./StatsPanel";
import { ThemeToggle } from "./ThemeToggle";
import { DEFAULT_GENERATOR_ID, getGenerator } from "@/generators/registry";
import { getPresets, medianPreset } from "@/generators/defaults";
import type {
  CustomValues,
  GeneratorOptionSchema,
  TextGenerator,
  Unit,
} from "@/generators/types";
import { applyCase, applyLineBreaks, wrapHtmlParagraphs } from "@/lib/format";
import { computeStats } from "@/lib/stats";
import { useHistory } from "@/hooks/useHistory";
import type { HistoryEntry } from "@/lib/history";

interface State {
  settings: SettingsState;
  rawOutput: string;
}

type Action =
  | { type: "updateSettings"; payload: Partial<SettingsState> }
  | { type: "switchGenerator"; payload: { id: string } }
  | { type: "setOutput"; payload: string }
  | { type: "restore"; payload: { settings: Partial<SettingsState>; text: string } }
  | { type: "clear" };

function defaultsForGenerator(gen: TextGenerator | undefined): {
  custom: CustomValues;
  unit: Unit;
  count: number;
} {
  const custom: CustomValues = {};
  (gen?.customOptions ?? []).forEach((opt: GeneratorOptionSchema) => {
    custom[opt.key] = opt.default;
  });
  const unit = gen?.supportedUnits?.[0] ?? "words";
  const presets = getPresets(gen?.presets, unit);
  const count = medianPreset(presets);
  return { custom, unit, count };
}

function buildInitial(): State {
  const gen = getGenerator(DEFAULT_GENERATOR_ID);
  const d = defaultsForGenerator(gen);
  return {
    settings: {
      generatorId: DEFAULT_GENERATOR_ID,
      unit: d.unit,
      count: d.count,
      caseMode: "original",
      htmlWrap: false,
      lineBreak: "double",
      custom: d.custom,
    },
    rawOutput: "",
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "updateSettings":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "switchGenerator": {
      const gen = getGenerator(action.payload.id);
      const d = defaultsForGenerator(gen);
      const supported = gen?.supportedUnits;
      const unit = supported && !supported.includes(state.settings.unit)
        ? d.unit
        : state.settings.unit;
      const presets = getPresets(gen?.presets, unit);
      const count = medianPreset(presets);
      return {
        ...state,
        settings: {
          ...state.settings,
          generatorId: action.payload.id,
          unit,
          count,
          custom: d.custom,
        },
      };
    }
    case "setOutput":
      return { ...state, rawOutput: action.payload };
    case "restore":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload.settings },
        rawOutput: action.payload.text,
      };
    case "clear":
      return { ...state, rawOutput: "" };
  }
}

export function GeneratorApp() {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitial);
  const { settings, rawOutput } = state;
  const history = useHistory();

  const displayedText = useMemo(() => {
    if (!rawOutput) return "";
    let t = applyLineBreaks(rawOutput, settings.lineBreak);
    t = applyCase(t, settings.caseMode);
    if (settings.htmlWrap) t = wrapHtmlParagraphs(t);
    return t;
  }, [rawOutput, settings.lineBreak, settings.caseMode, settings.htmlWrap]);

  const stats = useMemo(() => computeStats(displayedText), [displayedText]);

  const handleSettingsChange = (p: Partial<SettingsState>) => {
    if (p.generatorId && p.generatorId !== settings.generatorId) {
      dispatch({ type: "switchGenerator", payload: { id: p.generatorId } });
      return;
    }
    dispatch({ type: "updateSettings", payload: p });
  };

  const handleGenerate = () => {
    const gen = getGenerator(settings.generatorId);
    if (!gen) return;
    const out = gen.generate({
      unit: settings.unit,
      count: settings.count,
      custom: settings.custom,
    });
    dispatch({ type: "setOutput", payload: out });
    history.push({
      generatorId: gen.id,
      generatorName: gen.name,
      unit: settings.unit,
      count: settings.count,
      custom: settings.custom,
      rawText: out,
    });
  };

  const handleRestore = (entry: HistoryEntry) => {
    const gen = getGenerator(entry.generatorId);
    const d = defaultsForGenerator(gen);
    dispatch({
      type: "restore",
      payload: {
        settings: {
          generatorId: entry.generatorId,
          unit: entry.unit,
          count: entry.count,
          custom: { ...d.custom, ...(entry.custom ?? {}) },
        },
        text: entry.rawText,
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="sticky top-0 z-10 backdrop-blur bg-background/85 border-b border-border-base">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-accent text-accent-foreground flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
            </div>
            <span className="font-display text-[15px] font-semibold tracking-tight">
              Text Generator
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
        <div>
          <h1 className="font-display text-2xl sm:text-[28px] font-semibold tracking-tight">
            Generate placeholder text & mock data
          </h1>
          <p className="text-sm text-foreground-muted mt-0.5">
            Words, sentences, paragraphs, JSON, identifiers, colors — all client-side.
          </p>
        </div>

        <SettingsPanel settings={settings} onChange={handleSettingsChange} />

        <ActionButtons
          text={displayedText}
          hasOutput={!!rawOutput}
          onGenerate={handleGenerate}
          onClear={() => dispatch({ type: "clear" })}
        />

        <StatsPanel stats={stats} />

        <OutputDisplay text={displayedText} htmlMode={settings.htmlWrap} />

        <HistoryPanel
          entries={history.entries}
          onRestore={handleRestore}
          onDelete={history.remove}
          onClear={history.clear}
        />

        <footer className="pt-2 text-center text-xs text-foreground-muted">
          Modern · Extensible · Fully client-side
        </footer>
      </main>
    </div>
  );
}
