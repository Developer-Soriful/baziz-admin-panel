"use client";

import { Building2, TrendingUp, ShieldCheck, Users } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-sidebar p-12 text-white lg:flex">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(1200px 500px at -10% -10%, rgba(0,133,119,0.55), transparent), radial-gradient(900px 500px at 110% 110%, rgba(124,58,237,0.35), transparent)",
          }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-black shadow-[var(--shadow-glow)]">
            P
          </span>
          <div>
            <p className="text-lg font-extrabold">Propertera</p>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-muted">
              Admin Console
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">
            Operate the entire Propertera platform from one console.
          </h2>
          <p className="mt-4 text-base text-sidebar-text/80">
            Subscriptions, billing, landlords, tenants and the whole app &amp; website —
            unified, role-secured, and built for the platform owner.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { icon: Building2, label: "Landlords & tenants" },
              { icon: Users, label: "Subscriptions & plans" },
              { icon: TrendingUp, label: "Revenue & billing" },
              { icon: ShieldCheck, label: "Role-based admin access" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/25 text-primary-100">
                  <f.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-sidebar-muted">
          © 2026 Propertera. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
