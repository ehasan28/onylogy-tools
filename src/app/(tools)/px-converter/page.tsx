import type { Metadata } from "next";
import { PxConverterTool } from "@/components/px-converter/PxConverterTool";

export const metadata: Metadata = {
  title: "Onylogy PX Converter — convert pixels to rem and back",
  description:
    "Bidirectional pixel-to-rem CSS unit converter with configurable base font-size. Click presets, copy values, ship.",
};

export default function PxConverterPage() {
  return <PxConverterTool />;
}
