"use client";

import Link from "next/link";
import type { PricingPlan } from "@/lib/marketing/pricing";
import { useSessionSnapshot } from "@/lib/auth/use-session-snapshot";

type Props = {
  plan: Pick<PricingPlan, "id" | "ctaHref" | "ctaLabel">;
  isHighlight: boolean;
};

export function PricingPlanCta({ plan, isHighlight }: Props) {
  const { isLoggedIn, role } = useSessionSnapshot();
  const isAdmin = isLoggedIn && role === "ADMIN";
  const isExternal = plan.ctaHref.startsWith("mailto:");

  if (isAdmin && plan.id === "premium") {
    return (
      <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-center text-sm leading-relaxed text-slate-600">
        Set the live Premium checkout amount (per course) in{" "}
        <Link
          href="/admin/dashboard"
          className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
        >
          Admin dashboard
        </Link>
        {" "}
        under Premium pricing.
        .
      </p>
    );
  }

  if (isAdmin && plan.id === "basic") {
    return (
      <Link
        href="/admin/dashboard"
        className="mt-8 inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
      >
        Open admin dashboard
      </Link>
    );
  }

  const buttonClass = `mt-8 inline-flex items-center justify-center rounded-xl px-4 py-3.5 text-sm font-bold transition active:scale-[0.98] ${
    isHighlight
      ? "bg-brand-gradient text-white shadow-glow-sm hover:brightness-110"
      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
  }`;

  if (isExternal) {
    return (
      <a href={plan.ctaHref} className={buttonClass}>
        {plan.ctaLabel}
      </a>
    );
  }

  return (
    <Link href={plan.ctaHref} className={buttonClass}>
      {plan.ctaLabel}
    </Link>
  );
}
