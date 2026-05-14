import type { Metadata } from "next";
import { GeneratorApp } from "@/components/GeneratorApp";

export const metadata: Metadata = {
  title: "Onylogy Copy Generator — placeholder text & mock data",
  description:
    "Generate meaningful placeholder text, lorem ipsum, JSON mock data, UUIDs, emails, slugs, HEX colors, and more — all client-side.",
};

export default function CopyGeneratorPage() {
  return <GeneratorApp />;
}
