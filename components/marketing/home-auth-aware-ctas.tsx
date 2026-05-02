"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { dashboardPathForRole } from "@/lib/auth/session";
import { useSessionSnapshot } from "@/lib/auth/use-session-snapshot";

/** Hero primary + secondary buttons on `/` — hide “Create account” when already signed in. */
export function HomeHeroActions() {
  const { isLoggedIn, role } = useSessionSnapshot();

  if (!isLoggedIn) {
    return (
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link
          href="/register"
          className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
        >
          Create your free account
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-xl border border-white/28 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/18 active:scale-[0.98]"
        >
          <PlayCircle className="h-4 w-4" />
          Browse courses
        </Link>
      </div>
    );
  }

  const isAdmin = role === "ADMIN";
  const primaryHref = isAdmin ? "/admin/dashboard" : dashboardPathForRole(role);
  const primaryLabel = isAdmin ? "Admin dashboard" : "Learner dashboard";

  return (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      <Link
        href={primaryHref}
        className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
      >
        {primaryLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 rounded-xl border border-white/28 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/18 active:scale-[0.98]"
      >
        <PlayCircle className="h-4 w-4" />
        Browse courses
      </Link>
    </div>
  );
}

/** Bottom gradient CTA on `/` — no register/pricing prompts for signed-in users. */
export function HomeClosingCtaActions() {
  const { isLoggedIn, role } = useSessionSnapshot();

  if (!isLoggedIn) {
    return (
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/register"
          className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
        >
          Create your free account
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.98]"
        >
          See pricing
        </Link>
      </div>
    );
  }

  const isAdmin = role === "ADMIN";
  const primaryHref = isAdmin ? "/admin/dashboard" : dashboardPathForRole(role);
  const primaryLabel = isAdmin ? "Admin dashboard" : "Learner dashboard";

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Link
        href={primaryHref}
        className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
      >
        {primaryLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.98]"
      >
        {isAdmin ? "Open catalog" : "Course catalog"}
      </Link>
    </div>
  );
}

/** Bottom CTA intro line — avoid “create an account” copy when signed in. */
export function HomeClosingCtaIntro() {
  const { isLoggedIn } = useSessionSnapshot();
  if (isLoggedIn) {
    return (
      <p className="mx-auto mt-4 max-w-xl text-base text-white/85">
        {"You're signed in. Open your dashboard or browse the catalog anytime."}
      </p>
    );
  }
  return (
    <p className="mx-auto mt-4 max-w-xl text-base text-white/85">
      Create an account, pick a track, and let our mentors walk you through the rest.
    </p>
  );
}
