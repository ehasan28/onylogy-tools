import type { Metadata } from "next";
import { ConvertCaseTool } from "@/components/convert-case/ConvertCaseTool";

export const metadata: Metadata = {
  title: "Case Converter — Change Text Case Online",
  description:
    "Instantly switch text between Sentence case, Title Case, UPPERCASE, lowercase, and CONSTANT_CASE, then copy, share, or download. Free and fully client-side.",
};

export default function ConvertCasePage() {
  return <ConvertCaseTool />;
}
