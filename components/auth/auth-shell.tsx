import Link from "next/link";
import Image from "next/image";
import { GraduationCap, CheckCircle2, Sparkles } from "lucide-react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
};

const SIDE_FEATURES = [
  "Structured weekly learning tracks",
  "Live mock interviews with real engineers",
  "Progress tracking across all subjects",
  "No subscriptions — pay once per course",
];

export function AuthShell({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerHref,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] p-4 md:p-8">
      {/* Ambient mesh */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(99,102,241,0.14),transparent_50%),radial-gradient(ellipse_at_80%_30%,rgba(147,51,234,0.1),transparent_45%),radial-gradient(ellipse_at_50%_100%,rgba(59,130,246,0.08),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[1.75rem] border border-slate-200/60 bg-white shadow-[0_32px_64px_-24px_rgba(15,23,42,0.12),0_0_0_1px_rgba(255,255,255,0.8)_inset] md:min-h-[calc(100vh-4rem)] md:grid-cols-2 md:rounded-[2rem]">
        {/* Left: brand panel */}
        <section className="relative hidden overflow-hidden md:flex md:flex-col md:justify-between md:p-10 lg:p-12">
          <Image
            src="/hero-study-session.png"
            alt="Students preparing together"
            fill
            sizes="50vw"
            quality={92}
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/92 via-indigo-950/88 to-purple-950/82" />
          <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-16 -left-16 h-56 w-56 rounded-full bg-violet-400/15 blur-3xl" />

          {/* Logo — links to marketing home */}
          <Link
            href="/"
            className="relative z-10 inline-flex w-fit max-w-full items-center gap-3 rounded-xl text-white outline-none ring-white/40 ring-offset-2 ring-offset-slate-900/50 transition hover:opacity-95 focus-visible:ring-2"
            aria-label="Place2Prepare home"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-lg shadow-black/10 ring-1 ring-white/25 backdrop-blur-md">
              <GraduationCap className="h-5 w-5" strokeWidth={2} />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">Place2Prepare</span>
          </Link>

          {/* Bottom copy */}
          <div className="relative z-10 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/85 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amber-300" />
              Trusted by engineers
            </div>
            <h2 className="font-display mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight lg:text-[2rem]">
              Prepare with focus,
              <br />
              interview with confidence.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/78">
              Sign in to continue your placement roadmap, live sessions, and mentor-reviewed practice.
            </p>
            <ul className="mt-8 space-y-3">
              {SIDE_FEATURES.map((feat) => (
                <li key={feat} className="flex items-start gap-3 text-sm text-white/88">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" strokeWidth={2} />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Right: form */}
        <section className="relative flex items-center justify-center bg-gradient-to-b from-white to-slate-50/90 p-6 md:p-10 lg:p-12">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200/70 to-transparent md:hidden" />

          <div className="w-full max-w-md animate-fade-in">
            {/* Mobile hero strip */}
            <div className="relative mb-8 overflow-hidden rounded-2xl md:hidden">
              <div className="absolute inset-0 bg-brand-gradient opacity-95" />
              <div className="absolute inset-0 bg-grid opacity-[0.12]" />
              <Link
                href="/"
                className="relative flex items-center gap-3 px-5 py-4 outline-none ring-white/50 ring-offset-2 ring-offset-indigo-600 transition hover:bg-white/5 focus-visible:ring-2"
                aria-label="Place2Prepare home"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 ring-2 ring-white/30 backdrop-blur-sm">
                  <GraduationCap className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-white">Place2Prepare</p>
                  <p className="text-xs font-medium text-white/80">Placement prep that lands offers</p>
                </div>
              </Link>
            </div>

            <div className="rounded-[1.35rem] border border-slate-200/80 bg-white/95 p-7 shadow-[0_20px_50px_-18px_rgba(15,23,42,0.1)] ring-1 ring-white/80 backdrop-blur-xl md:p-9">
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>

              <div className="mt-8">{children}</div>

              <p className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
                {footerText}{" "}
                <Link
                  href={footerHref}
                  className="font-semibold text-indigo-600 underline-offset-4 transition hover:text-indigo-700 hover:underline"
                >
                  {footerLinkText}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
