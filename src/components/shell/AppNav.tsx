"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

interface Tool {
  href: string;
  label: string;
}

const TOOLS: Tool[] = [
  { href: "/copy-generator", label: "Copy Generator" },
  { href: "/px-converter", label: "PX Converter" },
  { href: "/clamp-generator", label: "Clamp Generator" },
  { href: "/convert-case", label: "Convert Case" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-background/85 border-b border-border-base">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-12 flex items-center justify-between">
          <Link
            href="/copy-generator"
            className="flex items-center gap-2 group"
            aria-label="Onylogy Tools"
          >
            <span className="h-6 w-6 rounded-md bg-accent text-accent-foreground flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight">
              Onylogy Tools
            </span>
          </Link>
          <ThemeToggle />
        </div>
        <nav
          aria-label="Tools"
          className="-mx-4 sm:mx-0 overflow-x-auto scrollbar-thin"
        >
          <ul className="flex items-center gap-1 px-4 sm:px-0 pb-2 pt-0.5 min-w-max">
            {TOOLS.map((tool) => {
              const active =
                pathname === tool.href ||
                pathname?.startsWith(tool.href + "/");
              return (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className={clsx(
                      "inline-flex items-center h-8 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground-muted hover:text-foreground hover:bg-surface-muted",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {tool.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
