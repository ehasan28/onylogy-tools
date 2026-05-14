import type { Metadata } from "next";
import { ClampGeneratorTool } from "@/components/clamp-generator/ClampGeneratorTool";

export const metadata: Metadata = {
  title: "Onylogy Clamp Generator — fluid CSS clamp() values",
  description:
    "Generate fluid CSS clamp() values that scale linearly between viewport widths. Live preview, presets, drop-in CSS output.",
};

export default function ClampGeneratorPage() {
  return <ClampGeneratorTool />;
}
