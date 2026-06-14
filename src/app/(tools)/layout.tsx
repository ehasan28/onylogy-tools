import { AppNav } from "@/components/shell/AppNav";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <AppNav />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-12 flex flex-col">
        <div className="my-auto w-full">{children}</div>
      </main>
      <footer className="pb-6 text-center text-xs text-foreground-muted">
        Built by{" "}
        <a
          href="https://onylogy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-accent underline underline-offset-2 transition-colors"
        >
          Onylogy
        </a>{" "}
        · Fully client-side
      </footer>
    </div>
  );
}
