import type { GenerateOptions, TextGenerator } from "../types";
import { buildRecord, formatRecords, type Schema } from "./schemas";

export const jsonMockGenerator: TextGenerator = {
  id: "json-mock",
  name: "JSON Mock Data",
  category: "Web Dev",
  description: "Pretty-printed JSON arrays of users, products, posts, or comments.",
  supportedUnits: ["words"],
  unitLabelOverride: { words: "Records" },
  presets: { words: [1, 5, 10, 25, 50, 100] },
  customOptions: [
    {
      key: "schema",
      type: "select",
      label: "Schema",
      default: "users",
      options: [
        { value: "users", label: "Users" },
        { value: "products", label: "Products" },
        { value: "posts", label: "Posts" },
        { value: "comments", label: "Comments" },
      ],
    },
    {
      key: "pretty",
      type: "toggle",
      label: "Pretty",
      default: true,
    },
  ],
  generate({ count, custom }: GenerateOptions): string {
    const n = Math.max(0, Math.min(count, 500));
    const schema = (String(custom?.schema ?? "users") as Schema);
    const pretty = Boolean(custom?.pretty ?? true);
    const records = Array.from({ length: n }, () => buildRecord(schema));
    return formatRecords(records, pretty);
  },
};
