import type { Metadata } from "next";
import { ConvertCaseTool } from "@/components/convert-case/ConvertCaseTool";

export const metadata: Metadata = {
  title: "Onylogy Convert Case — UPPERCASE, lowercase, camelCase, and more",
  description:
    "Paste any text and convert between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE.",
};

export default function ConvertCasePage() {
  return <ConvertCaseTool />;
}
