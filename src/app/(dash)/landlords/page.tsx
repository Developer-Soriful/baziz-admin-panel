"use client";

import { useState } from "react";
import { Building2, CheckCircle2, PauseCircle, Clock, Search, MoreVertical, Ban, Play, Eye, BadgeCheck, X } from "lucide-react";
import { PageHeader, StatCard } from "@/components/ui/stat-card";
import { Card, Badge, Button, Avatar } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { SearchInput, FilterChips, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { landlords as seed, landlordTone, planTone, type Landlord } from "@/lib/data";
import { gbp } from "@/lib/utils";

export default function LandlordsPage() {
  const toast = useToast();
  const [list, setList] = useState<Landlord[]>(() => [...seed]);
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState<"all" | "Free" | "Pro" | "Enterprise">("all");
  const [view, setView] = useState<Landlord | null>(null);
  const [menu, setMenu] = useState<string | null>(null);

  const filtered = list.filter((l) => (!q || l.name.toLowerCase().includes(q.toLowerCase()) || l.email.toLowerCase().includes(q.toLowerCase()) || l.company.toLowerCase().includes(q.toLowerCase())) && (plan === "all" || l.plan === plan));
  const counts = { active: list.filter((l) => l.status === "Active").length, suspended: list.filter((l) => l.status === "Suspended").length, pending: list.filter((l) => l.status === "Pending").length };

  const setStatus = (id: string, status: Landlord["status"]) => { setList((l) => l.map((x) => x.id === id ? { ...x, status } : x)); setMenu(null); toast(status === "Suspended" ? "Landlord suspended" : "Landlord reactivated", status === "Suspended" ? "warning" : "success"); };

  return (
    <div className="animate-in">
      <PageHeader title="Landlords" subtitle="Every property owner across the Propertera platform" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Landlords" value={String(list.length)} icon={Building2} accent="#007aff" />
        <StatCard label="Active" value={String(counts.active)} icon={CheckCircle2} accent="#10b981" />
        <StatCard label="Suspended" value={String(counts.suspended)} icon={PauseCircle} accent="#ff3b30" />
        <StatCard label="Pending" value={String(counts.pending)} icon={Clock} accent="#ff9500" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={q} onChange={setQ} placeholder="Search landlords by name, email or company..." className="sm:max-w-sm" />
        <FilterChips value={plan} onChange={setPlan} chips={[{ value: "all", label: "All Plans" }, { value: "Free", label: "Free" }, { value: "Pro", label: "Pro" }, { value: "Enterprise", label: "Enterprise" }]} />
      </div>

      <Card className="mt-4 overflow-hidden">
        {filtered.length === 0 ? <EmptyState icon={Search} title="No landlords found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead><tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-text-faint">
                <th className="px-5 py-3">Landlord</th><th className="px-5 py-3">Plan</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Properties</th><th className="px-5 py-3">Rent Volume</th><th className="px-5 py-3">Joined</th><th className="px-5 py-3 text-right">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {filtered.map((l) => (
                  <tr key={l.id} className="transition hover:bg-surface-2">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={l.name} color={l.color} size={38} />
                        <div><p className="flex items-center gap-1 font-semibold">{l.name}{l.verified && <BadgeCheck className="h-3.5 w-3.5 text-info" />}</p><p className="text-xs text-text-muted">{l.company}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><Badge tone={planTone(l.plan)}>{l.plan}</Badge></td>
                    <td className="px-5 py-3"><Badge tone={landlordTone(l.status)}>{l.status}</Badge></td>
                    <td className="px-5 py-3 font-semibold">{l.properties}</td>
                    <td className="px-5 py-3 font-bold">{gbp(l.monthlyRent)}/mo</td>
                    <td className="px-5 py-3 text-text-muted">{l.joined}</td>
                    <td className="px-5 py-3">
                      <div className="relative flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setView(l)}><Eye className="h-4 w-4" /></Button>
                        <button onClick={() => setMenu(menu === l.id ? null : l.id)} className="rounded-lg p-2 text-text-faint hover:bg-surface-2"><MoreVertical className="h-4 w-4" /></button>
                        {menu === l.id && (
                          <div className="animate-in absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-surface shadow-float">
                            {l.status === "Suspended"
                              ? <button onClick={() => setStatus(l.id, "Active")} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-surface-2"><Play className="h-4 w-4 text-success" /> Reactivate</button>
                              : <button onClick={() => setStatus(l.id, "Suspended")} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-danger hover:bg-danger/8"><Ban className="h-4 w-4" /> Suspend</button>}
                            <button onClick={() => { setView(l); setMenu(null); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-surface-2"><Eye className="h-4 w-4" /> View details</button>
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

      <Modal open={!!view} onClose={() => setView(null)} title={view?.name} subtitle={view?.company}>
        {view && (
          <div className="space-y-4">
            <div className="flex items-center gap-3"><Avatar name={view.name} color={view.color} size={56} /><div><div className="flex items-center gap-2"><Badge tone={planTone(view.plan)}>{view.plan}</Badge><Badge tone={landlordTone(view.status)}>{view.status}</Badge>{view.verified && <Badge tone="info"><BadgeCheck className="mr-1 h-3 w-3" />Verified</Badge>}</div></div></div>
            <div className="grid grid-cols-2 gap-3">
              {[["Email", view.email], ["Phone", view.phone], ["Properties", String(view.properties)], ["Tenants", String(view.tenants)], ["Rent Volume", `${gbp(view.monthlyRent)}/mo`], ["Joined", view.joined]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-surface-2 p-3"><p className="text-xs text-text-muted">{k}</p><p className="truncate font-semibold">{v}</p></div>
              ))}
            </div>
            <div className="flex gap-2">
              {view.status === "Suspended"
                ? <Button className="flex-1" onClick={() => { setStatus(view.id, "Active"); setView(null); }}><Play className="h-4 w-4" /> Reactivate account</Button>
                : <Button variant="danger" className="flex-1" onClick={() => { setStatus(view.id, "Suspended"); setView(null); }}><Ban className="h-4 w-4" /> Suspend account</Button>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
