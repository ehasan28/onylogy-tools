import type { Metadata } from "next";
import { ClampGeneratorTool } from "@/components/clamp-generator/ClampGeneratorTool";

export const metadata: Metadata = {
  title: "CSS Clamp Generator — Fluid Font Size Calculator",
  description:
    "Build a responsive CSS clamp() for fluid typography between two viewport widths. Copy a clean clamp() value — ready for Elementor, WordPress, or any stylesheet.",
};

export default function ClampGeneratorPage() {
  return <ClampGeneratorTool />;
}
