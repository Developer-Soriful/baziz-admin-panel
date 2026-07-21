"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wallet, TrendingUp, ListChecks, Users, Plus, Trash2, Star, Receipt, Check } from "lucide-react";
import { Card, Badge, Button, Progress, Avatar } from "@/components/ui/primitives";
import { PillTabs } from "@/components/ui/misc";
import { projects, projectStatusTone, priorityTone } from "@/lib/data";
import { gbp, gbpCompact, colorFromString } from "@/lib/utils";

type Task = { id: string; title: string; due: string; status: string };
type Expense = { id: string; title: string; date: string; category: string; amount: number };
type Contractor = { id: string; name: string; spec: string; phone: string; rating: number };

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const p = projects.find((x) => x.id === id);
  const [tab, setTab] = useState<"Overview" | "Tasks" | "Expenses" | "Contractors" | "Team">("Overview");

  const [tasks, setTasks] = useState<Task[]>([
    { id: "t1", title: "Install countertops", due: "15 Feb 2026", status: "pending" },
    { id: "t2", title: "Install kitchen cabinets", due: "25 Jan 2026", status: "completed" },
  ]);
  const [expenses] = useState<Expense[]>([
    { id: "e1", title: "Granite countertops", date: "10 Feb 2026", category: "materials", amount: 3500 },
    { id: "e2", title: "Plumbing work", date: "1 Feb 2026", category: "labor", amount: 1500 },
    { id: "e3", title: "Kitchen cabinets", date: "20 Jan 2026", category: "materials", amount: 8500 },
  ]);
  const contractors: Contractor[] = [
    { id: "c1", name: "John Smith", spec: "General Construction", phone: "07700 900123", rating: 4.8 },
    { id: "c2", name: "Sarah Jones", spec: "Electrical Specialist", phone: "07700 900124", rating: 4.5 },
  ];
  const team = [
    { name: "Priya Patel", email: "priya.patel@propertera.com", role: "Property Manager" },
    { name: "Marcus Lee", email: "marcus.lee@contractors.com", role: "Contractor" },
  ];

  if (!p) return (
    <div className="animate-in"><Link href="/projects" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back</Link><Card className="p-10 text-center">Project not found.</Card></div>
  );

  const doneCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="animate-in">
      <Link href="/projects" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to projects</Link>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold">{p.title}</h1>
            <p className="mt-1 text-sm text-text-muted">{p.description}</p>
            <p className="mt-1 text-sm text-text-muted">{p.address}</p>
            <div className="mt-2 flex flex-wrap gap-2"><Badge tone={priorityTone(p.priority)}>{p.priority} priority</Badge><Badge tone={projectStatusTone(p.status)}>{p.status.replace("-", " ")}</Badge></div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Budget", value: gbpCompact(p.budget), icon: Wallet, color: "#007aff" },
            { label: "Spent", value: gbpCompact(p.spent), icon: Receipt, color: "#ff9500" },
            { label: "Progress", value: `${p.progress}%`, icon: TrendingUp, color: "#10b981" },
            { label: "Tasks", value: `${doneCount}/${tasks.length}`, icon: ListChecks, color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${s.color}1a`, color: s.color }}><s.icon className="h-4 w-4" /></span>
              <p className="mt-2 text-lg font-extrabold">{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-4"><PillTabs value={tab} onChange={setTab} tabs={["Overview", "Tasks", "Expenses", "Contractors", "Team"]} /></div>

      {tab === "Overview" && (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h3 className="mb-3 text-base font-bold">Timeline</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-2 p-3"><p className="text-xs text-text-muted">Start Date</p><p className="font-bold">{p.startDate}</p></div>
              <div className="rounded-xl bg-surface-2 p-3"><p className="text-xs text-text-muted">End Date</p><p className="font-bold">{p.endDate}</p></div>
            </div>
            <div className="mt-4"><div className="mb-1.5 flex justify-between text-sm"><span className="text-text-muted">Progress</span><span className="font-bold">{p.progress}%</span></div><Progress value={p.progress} /><p className="mt-1 text-xs text-text-muted">{doneCount} of {tasks.length} tasks done</p></div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-base font-bold">Project Details</h3>
            <div className="divide-y divide-border text-sm">
              {[["Type", p.type], ["Contingency", gbp(p.contingency)], ["Created", "10 Jan 2026"], ["Last Updated", "12 Feb 2026"]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5"><span className="text-text-muted">{k}</span><span className="font-semibold capitalize">{v}</span></div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-base font-bold">Recent Tasks</h3>
            <div className="space-y-2">{tasks.map((t) => <div key={t.id} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-sm"><span className="flex items-center gap-2">{t.status === "completed" ? <Check className="h-4 w-4 text-success" /> : <span className="h-4 w-4 rounded-full border-2 border-border-strong" />}{t.title}</span><span className="text-xs text-text-muted">{t.due}</span></div>)}</div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-base font-bold">Recent Expenses</h3>
            <div className="space-y-2">{expenses.map((e) => <div key={e.id} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-sm"><span>{e.title}<span className="block text-xs text-text-muted">{e.date} · {e.category}</span></span><span className="font-bold">{gbp(e.amount)}</span></div>)}</div>
          </Card>
        </div>
      )}

      {tab === "Tasks" && (
        <Card className="mt-4 p-5">
          <div className="mb-3 flex items-center justify-between"><h3 className="text-base font-bold">All Tasks ({tasks.length})</h3><Button size="sm"><Plus className="h-4 w-4" /> Add</Button></div>
          <div className="divide-y divide-border">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-3">
                <button onClick={() => setTasks((l) => l.map((x) => x.id === t.id ? { ...x, status: x.status === "completed" ? "pending" : "completed" } : x))} className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${t.status === "completed" ? "border-success bg-success text-white" : "border-border-strong"}`}>{t.status === "completed" && <Check className="h-3 w-3" />}</button>
                <div className="flex-1"><p className={t.status === "completed" ? "line-through text-text-faint" : "font-semibold"}>{t.title}</p><p className="text-xs text-text-muted">Due: {t.due}</p></div>
                <Badge tone={t.status === "completed" ? "success" : "warning"}>{t.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Expenses" && (
        <Card className="mt-4 p-5">
          <div className="mb-4 rounded-xl bg-primary/8 p-4"><p className="text-sm text-text-muted">Total Spent</p><p className="text-2xl font-extrabold text-primary">{gbp(expenses.reduce((s, e) => s + e.amount, 0), { decimals: true })}</p></div>
          <div className="mb-3 flex items-center justify-between"><h3 className="text-base font-bold">All Expenses ({expenses.length})</h3><Button size="sm"><Plus className="h-4 w-4" /> Add</Button></div>
          <div className="divide-y divide-border">{expenses.map((e) => <div key={e.id} className="flex items-center gap-3 py-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Receipt className="h-4 w-4" /></span><div className="flex-1"><p className="font-semibold">{e.title}</p><p className="text-xs text-text-muted">{e.date} · {e.category}</p></div><span className="font-bold">{gbp(e.amount)}</span></div>)}</div>
        </Card>
      )}

      {tab === "Contractors" && (
        <Card className="mt-4 p-5">
          <div className="mb-3 flex items-center justify-between"><h3 className="text-base font-bold">All Contractors ({contractors.length})</h3><Button size="sm"><Plus className="h-4 w-4" /> Add</Button></div>
          <div className="divide-y divide-border">{contractors.map((c) => <div key={c.id} className="flex items-center gap-3 py-3"><Avatar name={c.name} color={colorFromString(c.name)} size={40} /><div className="flex-1"><p className="font-semibold">{c.name}</p><p className="text-xs text-text-muted">{c.spec} · {c.phone}</p></div><span className="flex items-center gap-1 text-sm font-bold"><Star className="h-4 w-4 fill-amber text-amber" />{c.rating}</span></div>)}</div>
        </Card>
      )}

      {tab === "Team" && (
        <Card className="mt-4 p-5">
          <div className="mb-3 flex items-center justify-between"><h3 className="text-base font-bold">Project Team ({team.length})</h3><Button size="sm"><Users className="h-4 w-4" /> Add Member</Button></div>
          <div className="divide-y divide-border">{team.map((m) => <div key={m.email} className="flex items-center gap-3 py-3"><Avatar name={m.name} color={colorFromString(m.name)} size={40} /><div className="flex-1"><p className="font-semibold">{m.name}</p><p className="text-xs text-text-muted">{m.email}</p></div><Badge tone="primary">{m.role}</Badge><button className="rounded-lg p-1.5 text-text-faint hover:bg-danger/10 hover:text-danger"><Trash2 className="h-4 w-4" /></button></div>)}</div>
        </Card>
      )}
    </div>
  );
}
