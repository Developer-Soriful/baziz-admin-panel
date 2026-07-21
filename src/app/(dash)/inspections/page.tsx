"use client";

import { useState } from "react";
import { Plus, CalendarCheck, Clock, CheckCircle2, AlertTriangle, User, MapPin, Calendar } from "lucide-react";
import { PageHeader, StatCard } from "@/components/ui/stat-card";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { Field, Input, Select } from "@/components/ui/form";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { PillTabs, SearchInput, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { inspections as seed, properties, inspectionTone, type Inspection } from "@/lib/data";

const tagTone: Record<Inspection["tag"], "info" | "success" | "danger"> = { Routine: "info", "Move In": "success", "Move Out": "danger" };
const empty: Omit<Inspection, "id"> = { title: "", tag: "Routine", description: "", property: "", landlord: "", inspector: "", date: "", status: "Scheduled" };

export default function InspectionsPage() {
  const toast = useToast();
  const [list, setList] = useState<Inspection[]>(() => [...seed]);
  const [tab, setTab] = useState<"All" | "Scheduled" | "Completed">("All");
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Inspection | null>(null);
  const [form, setForm] = useState<Omit<Inspection, "id">>(empty);
  const [cancel, setCancel] = useState<Inspection | null>(null);

  const filtered = list.filter((i) => {
    const mq = !q || i.title.toLowerCase().includes(q.toLowerCase()) || i.property.toLowerCase().includes(q.toLowerCase());
    const mt = tab === "All" || (tab === "Scheduled" ? i.status === "Scheduled" || i.status === "Overdue" : i.status === "Valid");
    return mq && mt;
  });

  const counts = {
    all: list.length,
    scheduled: list.filter((i) => i.status === "Scheduled").length,
    valid: list.filter((i) => i.status === "Valid").length,
    overdue: list.filter((i) => i.status === "Overdue").length,
  };

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (i: Inspection) => { setEditing(i); setForm(i); setModal(true); };
  const save = () => {
    if (!form.title.trim()) return toast("Please enter a title", "error");
    if (editing) { setList((l) => l.map((x) => (x.id === editing.id ? { ...editing, ...form } : x))); toast("Inspection updated"); }
    else { setList((l) => [{ ...form, id: `insp_${Date.now()}` }, ...l]); toast("Inspection scheduled"); }
    setModal(false);
  };

  return (
    <div className="animate-in">
      <PageHeader title="Inspections" subtitle="Manage property inspections and compliance checks" actions={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Schedule Inspection</Button>} />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="All Inspections" value={String(counts.all)} icon={CalendarCheck} accent="#007aff" />
        <StatCard label="Scheduled" value={String(counts.scheduled)} icon={Clock} accent="#008577" />
        <StatCard label="Valid" value={String(counts.valid)} icon={CheckCircle2} accent="#10b981" />
        <StatCard label="Overdue" value={String(counts.overdue)} icon={AlertTriangle} accent="#ff3b30" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <PillTabs value={tab} onChange={setTab} tabs={["All", "Scheduled", "Completed"]} />
        <SearchInput value={q} onChange={setQ} placeholder="Search inspections..." className="sm:ml-auto sm:max-w-xs" />
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-4"><EmptyState icon={CalendarCheck} title="No inspections found" message="Adjust your filters or schedule a new inspection." /></Card>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((i) => (
            <Card key={i.id} className="p-5">
              <div className="flex items-center justify-between">
                <Badge tone={tagTone[i.tag]}>{i.tag}</Badge>
                <Badge tone={inspectionTone(i.status)}>{i.status}</Badge>
              </div>
              <h3 className="mt-3 text-base font-bold">{i.title}</h3>
              <p className="mt-1 text-sm text-text-muted">{i.description}</p>
              <div className="mt-3 space-y-1.5 text-sm">
                <p className="flex items-center gap-2 text-text-muted"><MapPin className="h-4 w-4" /> {i.property}</p>
                <p className="flex items-center gap-2 text-text-muted"><User className="h-4 w-4" /> {i.inspector}</p>
                <p className="flex items-center gap-2 text-text-muted"><Calendar className="h-4 w-4" /> {i.date}</p>
              </div>
              {i.status !== "Valid" && (
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1" onClick={() => openEdit(i)}>Reschedule</Button>
                  <Button size="sm" variant="outline" className="flex-1 !border-danger !text-danger" onClick={() => setCancel(i)}>Cancel</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Reschedule Inspection" : "Schedule Inspection"} footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save" : "Schedule"}</Button></>}>
        <div className="space-y-4">
          <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Quarterly Property Inspection" /></Field>
          <Field label="Description"><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Routine check of property condition" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type"><Select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value as Inspection["tag"] })}>{["Routine", "Move In", "Move Out"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
            <Field label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Inspection["status"] })}>{["Scheduled", "Overdue", "Valid"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
          </div>
          <Field label="Property"><Select value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })}><option value="">Select property</option>{properties.map((p) => <option key={p.id}>{p.name}</option>)}</Select></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Inspector"><Input value={form.inspector} onChange={(e) => setForm({ ...form, inspector: e.target.value })} placeholder="John Smith" /></Field>
            <Field label="Date"><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="15/1/2026" /></Field>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!cancel} onClose={() => setCancel(null)} onConfirm={() => { if (cancel) { setList((l) => l.filter((x) => x.id !== cancel.id)); toast("Inspection cancelled", "info"); } }} title="Cancel Inspection?" message="This inspection will be removed from the schedule." confirmLabel="Yes, cancel" danger />
    </div>
  );
}
