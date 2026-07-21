"use client";

import { useState } from "react";
import { BadgePoundSterling, CheckCircle2, Clock, AlertTriangle, MoreVertical, ArrowUpCircle, XCircle } from "lucide-react";
import { PageHeader, StatCard } from "@/components/ui/stat-card";
import { Card, Badge, Button, Avatar } from "@/components/ui/primitives";
import { SearchInput, FilterChips, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { subscriptions as seed, subTone, planTone, type Subscription } from "@/lib/data";
import { gbp, colorFromString } from "@/lib/utils";

const label: Record<Subscription["status"], string> = { active: "Active", trialing: "Trialing", past_due: "Past Due", canceled: "Canceled" };

export default function SubscriptionsPage() {
  const toast = useToast();
  const [list, setList] = useState<Subscription[]>(() => [...seed]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Subscription["status"]>("all");
  const [menu, setMenu] = useState<string | null>(null);

  const filtered = list.filter((s) => (!q || s.customer.toLowerCase().includes(q.toLowerCase()) || s.email.toLowerCase().includes(q.toLowerCase())) && (filter === "all" || s.status === filter));
  const mrr = list.filter((s) => s.status === "active" || s.status === "trialing").reduce((sum, s) => sum + s.amount, 0);
  const counts = { active: list.filter((s) => s.status === "active").length, trialing: list.filter((s) => s.status === "trialing").length, pastDue: list.filter((s) => s.status === "past_due").length };

  const act = (id: string, status: Subscription["status"], msg: string) => { setList((l) => l.map((s) => s.id === id ? { ...s, status } : s)); setMenu(null); toast(msg); };

  return (
    <div className="animate-in">
      <PageHeader title="Subscriptions" subtitle="Manage every subscriber, plan and renewal" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="MRR (visible rows)" value={gbp(mrr, { decimals: true })} icon={BadgePoundSterling} accent="#008577" />
        <StatCard label="Active" value={String(counts.active)} icon={CheckCircle2} accent="#10b981" />
        <StatCard label="Trialing" value={String(counts.trialing)} icon={Clock} accent="#007aff" />
        <StatCard label="Past Due" value={String(counts.pastDue)} icon={AlertTriangle} accent="#ff9500" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={q} onChange={setQ} placeholder="Search subscribers..." className="sm:max-w-sm" />
        <FilterChips value={filter} onChange={setFilter} chips={[{ value: "all", label: "All" }, { value: "active", label: "Active" }, { value: "trialing", label: "Trialing" }, { value: "past_due", label: "Past Due" }, { value: "canceled", label: "Canceled" }]} />
      </div>

      <Card className="mt-4 overflow-hidden">
        {filtered.length === 0 ? <EmptyState icon={BadgePoundSterling} title="No subscriptions found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead><tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-text-faint">
                <th className="px-5 py-3">Customer</th><th className="px-5 py-3">Plan</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Seats</th><th className="px-5 py-3">Renews</th><th className="px-5 py-3 text-right">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s.id} className="transition hover:bg-surface-2">
                    <td className="px-5 py-3"><div className="flex items-center gap-3"><Avatar name={s.customer} color={colorFromString(s.customer)} size={36} /><div><p className="font-semibold">{s.customer}</p><p className="text-xs text-text-muted">{s.email}</p></div></div></td>
                    <td className="px-5 py-3"><Badge tone={planTone(s.plan)}>{s.plan}</Badge></td>
                    <td className="px-5 py-3 font-bold">{gbp(s.amount, { decimals: true })}/mo</td>
                    <td className="px-5 py-3"><Badge tone={subTone(s.status)}>{label[s.status]}</Badge></td>
                    <td className="px-5 py-3">{s.seats}</td>
                    <td className="px-5 py-3 text-text-muted">{s.renews}</td>
                    <td className="px-5 py-3">
                      <div className="relative flex justify-end">
                        <button onClick={() => setMenu(menu === s.id ? null : s.id)} className="rounded-lg p-2 text-text-faint hover:bg-surface-2"><MoreVertical className="h-4 w-4" /></button>
                        {menu === s.id && (
                          <div className="animate-in absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-border bg-surface shadow-float">
                            {s.plan !== "Enterprise" && <button onClick={() => act(s.id, s.status, "Upgraded to Enterprise")} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-surface-2"><ArrowUpCircle className="h-4 w-4 text-primary" /> Upgrade plan</button>}
                            {s.status === "past_due" && <button onClick={() => act(s.id, "active", "Marked as paid")} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-surface-2"><CheckCircle2 className="h-4 w-4 text-success" /> Mark as paid</button>}
                            {s.status !== "canceled" && <button onClick={() => act(s.id, "canceled", "Subscription canceled")} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-danger hover:bg-danger/8"><XCircle className="h-4 w-4" /> Cancel subscription</button>}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
