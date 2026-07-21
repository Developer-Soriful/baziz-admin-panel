"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FolderKanban, PlayCircle, CheckCircle2, Wallet, MapPin, Trash2, ArrowRight, ListChecks, Receipt } from "lucide-react";
import { PageHeader, StatCard } from "@/components/ui/stat-card";
import { Card, Badge, Button, Progress } from "@/components/ui/primitives";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { FilterChips, SearchInput, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { projects as seed, projectStatusTone, priorityTone, type Project } from "@/lib/data";
import { gbp, gbpCompact } from "@/lib/utils";

const priColors: Record<Project["priority"], string> = { low: "#007aff", medium: "#ff9500", high: "#ff3b30", urgent: "#ff3b30" };
const empty: Omit<Project, "id"> = { title: "", description: "", address: "", type: "renovation", priority: "medium", status: "planning", budget: 0, spent: 0, contingency: 0, startDate: "", endDate: "", progress: 0, tasksCount: 0, expensesCount: 0 };

export default function ProjectsPage() {
  const toast = useToast();
  const [list, setList] = useState<Project[]>(() => [...seed]);
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "on-hold">("all");
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Omit<Project, "id">>(empty);
  const [del, setDel] = useState<Project | null>(null);

  const filtered = list.filter((p) => {
    const mq = !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.address.toLowerCase().includes(q.toLowerCase());
    const mf = filter === "all" || (filter === "active" ? p.status === "in-progress" : filter === "completed" ? p.status === "completed" : p.status === "on-hold");
    return mq && mf;
  });
  const counts = { total: list.length, active: list.filter((p) => p.status === "in-progress").length, completed: list.filter((p) => p.status === "completed").length, budget: list.reduce((s, p) => s + p.budget, 0) };

  const save = () => {
    if (!form.title.trim()) return toast("Please enter a project name", "error");
    setList((l) => [{ ...form, id: `proj_${Date.now()}` }, ...l]);
    toast("Project created");
    setModal(false);
  };

  return (
    <div className="animate-in">
      <PageHeader title="Projects" subtitle="Track renovations, refurbishments & developments" actions={<Button onClick={() => { setForm(empty); setModal(true); }}><Plus className="h-4 w-4" /> New Project</Button>} />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Projects" value={String(counts.total)} icon={FolderKanban} accent="#007aff" />
        <StatCard label="Active" value={String(counts.active)} icon={PlayCircle} accent="#008577" />
        <StatCard label="Completed" value={String(counts.completed)} icon={CheckCircle2} accent="#10b981" />
        <StatCard label="Total Budget" value={gbpCompact(counts.budget)} icon={Wallet} accent="#7c3aed" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <FilterChips value={filter} onChange={setFilter} chips={[{ value: "all", label: "All" }, { value: "active", label: "Active" }, { value: "completed", label: "Completed" }, { value: "on-hold", label: "On Hold" }]} />
        <SearchInput value={q} onChange={setQ} placeholder="Search projects..." className="sm:ml-auto sm:max-w-xs" />
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-4"><EmptyState icon={FolderKanban} title="No projects" message="Create your first project to get started." /></Card>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <div className="h-1.5 w-full" style={{ background: priColors[p.priority] }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/projects/${p.id}`} className="text-base font-bold hover:text-primary">{p.title}</Link>
                  <button onClick={() => setDel(p)} className="rounded-lg p-1.5 text-text-faint hover:bg-danger/10 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-text-muted">{p.description}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted"><MapPin className="h-3.5 w-3.5" /> {p.address}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone={priorityTone(p.priority)}>{p.priority}</Badge>
                  <Badge tone={projectStatusTone(p.status)}>{p.status.replace("-", " ")}</Badge>
                </div>
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs"><span className="font-medium text-text-muted">Progress</span><span className="font-bold">{p.progress}%</span></div>
                  <Progress value={p.progress} color={priColors[p.priority]} />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="text-text-muted">Budget <span className="font-bold text-text">{gbpCompact(p.budget)}</span></span>
                  <span className="text-text-muted">Spent <span className="font-bold text-text">{gbpCompact(p.spent)}</span></span>
                  <span className="flex items-center gap-1 text-text-muted"><ListChecks className="h-3.5 w-3.5" />{p.tasksCount}</span>
                  <span className="flex items-center gap-1 text-text-muted"><Receipt className="h-3.5 w-3.5" />{p.expensesCount}</span>
                </div>
                <Link href={`/projects/${p.id}`} className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-surface-2 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10">View Details <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="New Project" size="lg" footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={save}>Create Project</Button></>}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Project Name" className="sm:col-span-2"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Kitchen Renovation - Oak Street" /></Field>
          <Field label="Description" className="sm:col-span-2"><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the project scope" /></Field>
          <Field label="Property / Address" className="sm:col-span-2"><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Oak Street, Manchester" /></Field>
          <Field label="Type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{["renovation", "extension", "landscaping", "new build", "refurbishment", "other"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
          <Field label="Priority"><Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Project["priority"] })}>{["low", "medium", "high", "urgent"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
          <Field label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })}>{["planning", "in-progress", "on-hold", "completed"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
          <Field label="Budget (£)"><Input type="number" value={form.budget || ""} onChange={(e) => setForm({ ...form, budget: +e.target.value })} placeholder="25000" /></Field>
          <Field label="Start Date"><Input value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="15 Jan 2026" /></Field>
          <Field label="End Date"><Input value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} placeholder="15 Mar 2026" /></Field>
        </div>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={() => { if (del) { setList((l) => l.filter((x) => x.id !== del.id)); toast("Project deleted", "info"); } }} title="Delete Project" message={`Delete "${del?.title}"? This action cannot be undone.`} confirmLabel="Delete" danger />
    </div>
  );
}
