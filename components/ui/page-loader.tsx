import { GraduationCap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PageLoaderProps = {
  message?: string;
  className?: string;
};

/** Full-viewport branded loader for Suspense fallouts and route transitions. */
export function PageLoader({ message = "Loading…", className }: PageLoaderProps) {
  return (
    <main
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden app-shell-bg px-4",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(99,102,241,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative flex flex-col items-center gap-8 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-3xl bg-brand-gradient opacity-35 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-gradient text-white shadow-glow ring-4 ring-white/90">
            <GraduationCap className="h-10 w-10" strokeWidth={2.25} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-200/90">
            <div className="loader-progress h-full w-2/5 rounded-full bg-brand-gradient shadow-glow-sm" />
          </div>
          <p className="text-center text-sm font-medium tracking-tight text-slate-600">{message}</p>
        </div>
      </div>
    </main>
  );
}

/** In-page centered loader for data fetches inside a layout. */
export function InlineLoader({
  message,
  minHeight = "min-h-[min(440px,70vh)]",
  className,
}: {
  message: string;
  minHeight?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5 rounded-3xl border border-slate-200/80 bg-white/70 px-6 py-16 shadow-card backdrop-blur-sm",
        minHeight,
        className
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-400/25 blur-xl" />
        <Loader2 className="relative h-11 w-11 animate-spin text-indigo-600" strokeWidth={2} />
      </div>
      <p className="max-w-sm text-center text-sm font-medium leading-relaxed text-slate-600">{message}</p>
    </div>
  );
}
