"use client";

import Link from "next/link";
import {
  BadgePoundSterling, Users, Building2, CreditCard, ArrowUpRight, TrendingUp,
  Receipt, LifeBuoy, Globe, Smartphone,
} from "lucide-react";
import { StatCard, PageHeader } from "@/components/ui/stat-card";
import { Card, Badge } from "@/components/ui/primitives";
import { MrrArea, GroupedBar, MixPie } from "@/components/charts";
import { MapPanel } from "@/components/map-panel";
import {
  mrrByMonth, signupsByMonth, planDistribution, propertyPins, recentActivity,
  transactions, subscriptions, landlords, plans, txnTone, planTone,
} from "@/lib/data";
import { gbp } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const { user } = useAuth();
  const totalLandlords = 1818;
  const totalTenants = 7940;
  const activeSubs = 512;
  const mrr = mrrByMonth[mrrByMonth.length - 1].mrr;
  const revenue30d = transactions.filter((t) => t.status === "Paid").reduce((s, t) => s + t.amount, 0) + 13800;

  return (
    <div>
      <PageHeader title={`Platform overview`} subtitle={`Welcome back, ${user?.name.split(" ")[0]} — here's how Propertera is performing.`} />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monthly Recurring Revenue" value={gbp(mrr)} sub="Across all paid plans" icon={BadgePoundSterling} accent="#008577" trend={{ value: "9.0%", up: true }} />
        <StatCard label="Active Subscriptions" value={activeSubs.toLocaleString()} sub={`${plans.reduce((s, p) => s + p.subscribers, 0).toLocaleString()} total accounts`} icon={CreditCard} accent="#7c3aed" trend={{ value: "4.2%", up: true }} />
        <StatCard label="Landlords" value={totalLandlords.toLocaleString()} sub="Property owners on platform" icon={Building2} accent="#007aff" trend={{ value: "6.1%", up: true }} />
        <StatCard label="Tenants" value={totalTenants.toLocaleString()} sub="Residents using the app" icon={Users} accent="#10b981" trend={{ value: "3.4%", up: true }} />
      </div>

      {/* MRR + plan mix */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="text-base font-bold">Revenue Growth (MRR)</h3><p className="text-xs text-text-muted">Last 6 months</p></div>
            <Badge tone="success" dot>+9.0%</Badge>
          </div>
          <div className="h-64"><MrrArea data={mrrByMonth} /></div>
        </Card>
        <Card className="p-5">
          <div className="mb-4"><h3 className="text-base font-bold">Plan Distribution</h3><p className="text-xs text-text-muted">By active account</p></div>
          <div className="relative h-40"><MixPie data={planDistribution} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-extrabold">{planDistribution.reduce((s, p) => s + p.value, 0).toLocaleString()}</span><span className="text-[11px] text-text-muted">Accounts</span></div>
          </div>
          <div className="mt-4 space-y-2">
            {planDistribution.map((m) => (
              <div key={m.name} className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} /><span className="font-semibold">{m.name}</span><span className="ml-auto text-text-muted">{m.value.toLocaleString()}</span></div>
            ))}
          </div>
        </Card>
      </div>

      {/* Signups + platform reach */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="text-base font-bold">New Signups</h3><p className="text-xs text-text-muted">Landlords vs tenants</p></div>
            <div className="flex gap-4 text-xs font-semibold"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-info" />Landlords</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" />Tenants</span></div>
          </div>
          <div className="h-60"><GroupedBar data={signupsByMonth} keys={[{ key: "landlords", color: "#007aff", label: "Landlords" }, { key: "tenants", color: "#008577", label: "Tenants" }]} /></div>
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-base font-bold">Platform Reach</h3></div>
          <MapPanel pins={propertyPins} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface-2 p-3"><span className="flex items-center gap-1.5 text-xs text-text-muted"><Smartphone className="h-3.5 w-3.5" /> Mobile app</span><p className="text-lg font-extrabold">64%</p></div>
            <div className="rounded-xl bg-surface-2 p-3"><span className="flex items-center gap-1.5 text-xs text-text-muted"><Globe className="h-3.5 w-3.5" /> Website</span><p className="text-lg font-extrabold">36%</p></div>
          </div>
        </Card>
      </div>

      {/* Transactions + activity */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold">Recent Transactions</h3>
            <Link href="/transactions" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">View all <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="divide-y divide-border">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"><Receipt className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{t.customer}</p><p className="truncate text-xs text-text-muted">{t.invoiceNo} · {t.plan} · {t.date}</p></div>
                <span className="text-sm font-bold">{gbp(t.amount, { decimals: true })}</span>
                <Badge tone={txnTone(t.status)}>{t.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 text-base font-bold">Live Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full`} style={{ background: a.tone === "danger" ? "#ff3b30" : a.tone === "success" ? "#34c759" : a.tone === "warning" ? "#ff9500" : "#007aff" }} />
                <div className="min-w-0"><p className="text-sm"><span className="font-semibold">{a.who}</span> <span className="text-text-muted">{a.action}</span></p><p className="mt-0.5 text-[11px] text-text-faint">{a.time}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top landlords */}
      <Card className="mt-4 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold">Top Landlords by Portfolio</h3>
          <Link href="/landlords" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Manage <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[...landlords].sort((a, b) => b.properties - a.properties).slice(0, 3).map((l) => (
            <div key={l.id} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between"><span className="text-sm font-bold">{l.name}</span><Badge tone={planTone(l.plan)}>{l.plan}</Badge></div>
              <p className="text-xs text-text-muted">{l.company}</p>
              <div className="mt-3 flex items-center justify-between text-xs"><span className="flex items-center gap-1 text-text-faint"><Building2 className="h-3 w-3" />{l.properties} properties</span><span className="flex items-center gap-1 font-bold text-success"><TrendingUp className="h-3 w-3" />{gbp(l.monthlyRent)}/mo</span></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
