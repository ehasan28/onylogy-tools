"use client";

import { useEffect, useRef } from "react";
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
  const navRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ul = navRef.current;
    if (!ul) return;
    const active = ul.querySelector<HTMLAnchorElement>('a[aria-current="page"]');
    const scroller = ul.parentElement; // the <nav> with overflow-x-auto
    if (!active || !scroller) return;
    const aLeft = active.offsetLeft;
    const aWidth = active.offsetWidth;
    const visibleW = scroller.clientWidth;
    const target = Math.max(0, aLeft - (visibleW - aWidth) / 2);
    scroller.scrollLeft = target;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-background/85 border-b border-border-base">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center gap-4">
        <Link
          href="/copy-generator"
          className="flex items-center gap-2 shrink-0"
          aria-label="Onylogy Tools"
        >
          <span className="h-7 w-7 rounded-md bg-accent text-accent-foreground flex items-center justify-center">
            <Sparkles className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="hidden sm:inline font-display text-[15px] font-semibold tracking-tight whitespace-nowrap">
            Onylogy Tools
          </span>
        </Link>

        <nav
          aria-label="Tools"
          className="flex-1 min-w-0 -mx-2 overflow-x-auto scrollbar-thin flex justify-center"
        >
          <ul ref={navRef} className="flex items-center gap-1 px-2 min-w-max">
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

        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
