import type { Unit } from "./types";

export const DEFAULT_PRESETS: Record<Unit, number[]> = {
  words: [25, 50, 100, 250, 500],
  sentences: [3, 5, 10, 20, 40],
  paragraphs: [1, 3, 5, 10, 20],
};

export const MAX_BY_UNIT: Record<Unit, number> = {
  words: 5000,
  sentences: 500,
  paragraphs: 100,
};

export function getPresets(
  generatorPresets: Partial<Record<Unit, number[]>> | undefined,
  unit: Unit,
): number[] {
  return generatorPresets?.[unit] ?? DEFAULT_PRESETS[unit];
}

export function medianPreset(presets: number[]): number {
  if (presets.length === 0) return 1;
  return presets[Math.floor(presets.length / 2)];
}
