import { AppNav } from "@/components/shell/AppNav";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <AppNav />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-5 sm:py-7">
        {children}
      </main>
      <footer className="pb-6 text-center text-xs text-foreground-muted">
        Onylogy Tools · Modern · Fully client-side
      </footer>
    </div>
  );
}
