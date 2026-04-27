import Link from "next/link";
import { ArrowLeft, GraduationCap, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f4f6fb] px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(99,102,241,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-violet-400/12 blur-3xl" />

      <div className="relative w-full max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-gradient text-white shadow-glow ring-4 ring-white">
          <GraduationCap className="h-10 w-10" strokeWidth={2} />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">404</p>
        <h1 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          This page went off the roadmap
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-600">
          The URL might be mistyped, or the page may have moved. Let&apos;s get you back to learning.
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-gradient px-6 py-3.5 text-sm font-bold text-white shadow-glow-sm transition hover:brightness-110 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-slate-50"
          >
            <Search className="h-4 w-4 text-indigo-500" />
            Browse courses
          </Link>
        </div>
      </div>
    </main>
  );
}
