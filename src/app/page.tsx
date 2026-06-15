import Link from "next/link";
import { ArrowRight, CaseSensitive, Ruler, Scaling, Type } from "lucide-react";
import type { ComponentType } from "react";

interface ToolCard {
  href: string;
  name: string;
  desc: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}

const TOOLS: ToolCard[] = [
  {
    href: "/copy-generator",
    name: "Copy Generator",
    desc: "Placeholder copy & mock data — lorem ipsum, JSON, UUIDs, emails, HEX colors and more.",
    Icon: Type,
  },
  {
    href: "/px-converter",
    name: "PX Converter",
    desc: "Convert pixels to rem and back instantly, with a configurable base and handy presets.",
    Icon: Ruler,
  },
  {
    href: "/clamp-generator",
    name: "Clamp Generator",
    desc: "Fluid font-size that scales between viewports — copy a clean CSS clamp() value.",
    Icon: Scaling,
  },
  {
    href: "/convert-case",
    name: "Convert Case",
    desc: "Switch text between Sentence case, Title Case, UPPERCASE, lowercase and CONSTANT_CASE.",
    Icon: CaseSensitive,
  },
];

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="my-auto w-full mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-border-base bg-surface px-3 py-1 text-xs font-medium text-foreground-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Free · client-side · no sign-up
          </span>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Small, sharp tools for the web
          </h1>
          <p className="mt-4 text-base sm:text-lg text-foreground-muted">
            A growing set of fast, focused utilities for developers and designers. Everything runs
            in your browser — nothing is ever uploaded.
          </p>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {TOOLS.map(({ href, name, desc, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-border-base bg-surface shadow-card p-5 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <span className="shrink-0 h-10 w-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <span className="flex items-center gap-1.5">
                    <h2 className="font-display text-base font-semibold tracking-tight">{name}</h2>
                    <ArrowRight
                      className="h-4 w-4 text-accent -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
                      strokeWidth={2}
                    />
                  </span>
                  <p className="mt-1 text-sm text-foreground-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-foreground-muted">More tools on the way.</p>
      </div>
    </main>
  );
}
