import type { ReactNode } from "react";
import { MarketingHeader } from "./header";
import { MarketingFooter } from "./footer";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f6f8fc] text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_50%_-20%,rgba(99,102,241,0.09),transparent_65%)]" />
      <div className="relative flex min-h-screen flex-col">
        <MarketingHeader />
        <main className="relative flex-1">{children}</main>
        <MarketingFooter />
      </div>
    </div>
  );
}
