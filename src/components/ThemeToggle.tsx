"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "./ui/Button";

const LABEL: Record<string, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const ICON = { className: "h-4 w-4", strokeWidth: 1.5 } as const;

export function ThemeToggle() {
  const { theme, cycleTheme, mounted } = useTheme();

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  const label = mounted ? LABEL[theme] : "Theme";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      aria-label={`Theme: ${label}. Click to change.`}
      title={label}
      className="!h-8 !w-8 !p-0"
    >
      <Icon {...ICON} />
    </Button>
  );
}
