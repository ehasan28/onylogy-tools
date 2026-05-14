"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { listGenerators, getGenerator } from "@/generators/registry";
import { DEFAULT_PRESETS, MAX_BY_UNIT, getPresets } from "@/generators/defaults";
import type {
  CustomValues,
  GeneratorOptionSchema,
  Unit,
} from "@/generators/types";
import type { CaseMode, LineBreakMode } from "@/lib/format";
import { NumberInput } from "./ui/NumberInput";
import { Select, type SelectOptionGroup } from "./ui/Select";
import { Toggle } from "./ui/Toggle";

export interface SettingsState {
  generatorId: string;
  unit: Unit;
  count: number;
  caseMode: CaseMode;
  htmlWrap: boolean;
  lineBreak: LineBreakMode;
  custom: CustomValues;
}

interface SettingsPanelProps {
  settings: SettingsState;
  onChange: (next: Partial<SettingsState>) => void;
}

const ALL_UNITS: Unit[] = ["words", "sentences", "paragraphs"];

const UNIT_LABEL: Record<Unit, string> = {
  words: "Words",
  sentences: "Sentences",
  paragraphs: "Paragraphs",
};

const CASE_OPTIONS = [
  { value: "original", label: "Original" },
  { value: "sentence", label: "Sentence" },
  { value: "title", label: "Title" },
  { value: "upper", label: "UPPER" },
  { value: "lower", label: "lower" },
];

const LINEBREAK_OPTIONS = [
  { value: "double", label: "Blank line" },
  { value: "single", label: "Single break" },
];

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const generator = getGenerator(settings.generatorId);
  const generatorGroups = useMemo<SelectOptionGroup[]>(() => {
    const byCategory = new Map<string, { value: string; label: string }[]>();
    for (const g of listGenerators()) {
      const cat = g.category ?? "Text";
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat)!.push({ value: g.id, label: g.name });
    }
    const order = ["Text", "Web Dev", "Identifiers", "Design"];
    return order
      .filter((c) => byCategory.has(c))
      .map((c) => ({ label: c, options: byCategory.get(c)! }));
  }, []);

  const supportedUnits = generator?.supportedUnits ?? ALL_UNITS;
  const unitOptions = supportedUnits.map((u) => ({
    value: u,
    label: generator?.unitLabelOverride?.[u] ?? UNIT_LABEL[u],
  }));

  const presets = getPresets(generator?.presets, settings.unit);
  const max = MAX_BY_UNIT[settings.unit];

  const hasCustom =
    generator?.customOptions && generator.customOptions.length > 0;

  return (
    <div className="rounded-xl border border-border-base bg-surface px-4 py-3 space-y-3">
      <Row label="Generation">
        <Control label="Generator">
          <Select
            value={settings.generatorId}
            onChange={(e) => onChange({ generatorId: e.target.value })}
            options={generatorGroups}
            className="min-w-[180px]"
          />
        </Control>

        {unitOptions.length > 1 && (
          <Control label="Unit">
            <Select
              value={settings.unit}
              onChange={(e) => onChange({ unit: e.target.value as Unit })}
              options={unitOptions}
              className="min-w-[130px]"
            />
          </Control>
        )}

        <Control label="Count">
          <NumberInput
            value={settings.count}
            onChange={(n) => onChange({ count: n })}
            min={1}
            max={max}
            ariaLabel="Quantity to generate"
          />
        </Control>

        <div className="flex items-center gap-1.5">
          {presets.map((n) => {
            const active = settings.count === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onChange({ count: n })}
                className={clsx(
                  "h-7 min-w-7 px-2 rounded-md text-xs font-medium border transition-colors cursor-pointer tabular-nums",
                  active
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-transparent border-border-base text-foreground-muted hover:text-foreground hover:border-border-strong",
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
      </Row>

      <Divider />

      <Row label="Formatting">
        <Control label="Case">
          <Select
            value={settings.caseMode}
            onChange={(e) => onChange({ caseMode: e.target.value as CaseMode })}
            options={CASE_OPTIONS}
            className="min-w-[110px]"
          />
        </Control>

        <Control label="Breaks">
          <Select
            value={settings.lineBreak}
            onChange={(e) =>
              onChange({ lineBreak: e.target.value as LineBreakMode })
            }
            options={LINEBREAK_OPTIONS}
            className="min-w-[120px]"
          />
        </Control>

        <Control label="HTML">
          <Toggle
            checked={settings.htmlWrap}
            onChange={(v) => onChange({ htmlWrap: v })}
            ariaLabel="Wrap paragraphs in HTML p tags"
          />
        </Control>
      </Row>

      {hasCustom && (
        <>
          <Divider />
          <Row label="Options">
            {generator!.customOptions!.map((opt) => (
              <CustomControl
                key={opt.key}
                opt={opt}
                value={settings.custom[opt.key] ?? opt.default}
                onChange={(v) =>
                  onChange({ custom: { ...settings.custom, [opt.key]: v } })
                }
              />
            ))}
          </Row>
        </>
      )}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted/80 w-20 shrink-0">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 flex-1">
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <hr className="border-border-base/70" />;
}

function Control({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-foreground-muted">
      <span className="font-medium uppercase tracking-wider text-[10px]">
        {label}
      </span>
      {children}
    </label>
  );
}

function CustomControl({
  opt,
  value,
  onChange,
}: {
  opt: GeneratorOptionSchema;
  value: string | number | boolean;
  onChange: (v: string | number | boolean) => void;
}) {
  if (opt.type === "number") {
    return (
      <Control label={opt.label}>
        <NumberInput
          value={Number(value)}
          onChange={onChange}
          min={opt.min}
          max={opt.max}
          ariaLabel={opt.label}
        />
      </Control>
    );
  }
  if (opt.type === "select") {
    return (
      <Control label={opt.label}>
        <Select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          options={opt.options}
          className="min-w-[110px]"
        />
      </Control>
    );
  }
  return (
    <Control label={opt.label}>
      <Toggle
        checked={Boolean(value)}
        onChange={onChange}
        ariaLabel={opt.label}
      />
    </Control>
  );
}

export { DEFAULT_PRESETS };
