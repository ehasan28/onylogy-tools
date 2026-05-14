"use client";

import { NumberInput } from "../ui/NumberInput";
import { Select } from "../ui/Select";
import type { CssUnit } from "@/lib/css-units";

interface UnitNumberInputProps {
  value: number;
  unit: CssUnit;
  onChange: (next: { value: number; unit: CssUnit }) => void;
  min?: number;
  max?: number;
  step?: number;
  ariaLabel?: string;
}

const UNIT_OPTIONS = [
  { value: "px", label: "px" },
  { value: "rem", label: "rem" },
];

export function UnitNumberInput({
  value,
  unit,
  onChange,
  min = 0,
  max = 4000,
  step,
  ariaLabel,
}: UnitNumberInputProps) {
  return (
    <div className="flex items-center gap-2">
      <NumberInput
        value={value}
        onChange={(n) => onChange({ value: n, unit })}
        min={min}
        max={max}
        step={step ?? (unit === "rem" ? 0.0625 : 1)}
        ariaLabel={ariaLabel}
        className="min-w-[120px]"
      />
      <Select
        value={unit}
        onChange={(e) =>
          onChange({ value, unit: e.target.value as CssUnit })
        }
        options={UNIT_OPTIONS}
        size="sm"
        className="!w-[68px] min-w-0"
        aria-label="Unit"
      />
    </div>
  );
}
