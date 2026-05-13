export type Unit = "words" | "sentences" | "paragraphs";

export type GeneratorCategory = "Text" | "Web Dev" | "Identifiers" | "Design";

export type GeneratorOptionSchema =
  | {
      key: string;
      type: "number";
      label: string;
      default: number;
      min: number;
      max: number;
    }
  | {
      key: string;
      type: "select";
      label: string;
      default: string;
      options: { value: string; label: string }[];
    }
  | {
      key: string;
      type: "toggle";
      label: string;
      default: boolean;
    };

export type CustomValues = Record<string, string | number | boolean>;

export interface GenerateOptions {
  unit: Unit;
  count: number;
  custom?: CustomValues;
}

export interface TextGenerator {
  id: string;
  name: string;
  description?: string;
  category?: GeneratorCategory;
  supportedUnits?: Unit[];
  unitLabelOverride?: Partial<Record<Unit, string>>;
  presets?: Partial<Record<Unit, number[]>>;
  customOptions?: GeneratorOptionSchema[];
  generate(opts: GenerateOptions): string;
}
