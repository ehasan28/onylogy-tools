import type { Metadata } from "next";
import { GeneratorApp } from "@/components/GeneratorApp";

export const metadata: Metadata = {
  title: "Copy Generator — Lorem Ipsum & Mock Data",
  description:
    "Generate placeholder text and mock data — lorem ipsum, JSON, UUIDs, emails, slugs, HEX colors, and more. 16 generators, free and fully client-side.",
};

export default function CopyGeneratorPage() {
  return <GeneratorApp />;
}
