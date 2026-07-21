"use client";

import { useState } from "react";
import { Plus, MessageSquareWarning, User, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { PageHeader, StatCard } from "@/components/ui/stat-card";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { PillTabs, SearchInput, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { complaints as seed, tenants, properties, complaintTone, type Complaint } from "@/lib/data";

const categories = ["Property Condition", "Noise", "Neighbour Dispute", "Billing", "Communication", "Other"];
const urgencyTone = { High: "danger", Medium: "warning", Low: "success" } as const;
const statuses: Complaint["status"][] = ["Open", "In Review", "Resolved"];
const empty: Omit<Complaint, "id"> = { tenant: "", property: "", landlord: "", category: "Property Condition", title: "", description: "", urgency: "Medium", status: "Open", date: "" };

export default function ComplaintsPage() {
  const toast = useToast();
  const [list, setList] = useState<Complaint[]>(() => [...seed]);
  const [tab, setTab] = useState<"All" | Complaint["status"]>("All");
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Omit<Complaint, "id">>(empty);

  const filtered = list.filter((c) => {
    const mq = !q || c.title.toLowerCase().includes(q.toLowerCase()) || c.tenant.toLowerCase().includes(q.toLowerCase());
    const mt = tab === "All" || c.status === tab;
    return mq && mt;
  });
  const counts = { open: list.filter((c) => c.status === "Open").length, review: list.filter((c) => c.status === "In Review").length, resolved: list.filter((c) => c.status === "Resolved").length };

  const setStatus = (id: string, status: Complaint["status"]) => {
    setList((l) => l.map((c) => (c.id === id ? { ...c, status } : c)));
    toast(`Marked as ${status}`);
  };
  const save = () => {
    if (!form.title.trim()) return toast("Please enter a title", "error");
    setList((l) => [{ ...form, id: `c_${Date.now()}`, date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) }, ...l]);
    toast("Complaint logged");
    setModal(false);
  };

  return (
    <div className="animate-in">
      <PageHeader title="Complaints" subtitle="Review and resolve tenant complaints" actions={<Button onClick={() => { setForm(empty); setModal(true); }}><Plus className="h-4 w-4" /> Log Complaint</Button>} />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Open" value={String(counts.open)} icon={MessageSquareWarning} accent="#ff9500" />
        <StatCard label="In Review" value={String(counts.review)} icon={Calendar} accent="#007aff" />
        <StatCard label="Resolved" value={String(counts.resolved)} icon={CheckCircle2} accent="#10b981" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <PillTabs value={tab} onChange={setTab} tabs={["All", "Open", "In Review", "Resolved"]} />
        <SearchInput value={q} onChange={setQ} placeholder="Search complaints..." className="sm:ml-auto sm:max-w-xs" />
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-4"><EmptyState icon={MessageSquareWarning} title="No complaints" message="Tenant complaints will appear here." /></Card>
      ) : (
        <div className="mt-4 space-y-4">
          {filtered.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">{c.category}</Badge>
                  <Badge tone={urgencyTone[c.urgency]}>{c.urgency} urgency</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={complaintTone(c.status)}>{c.status}</Badge>
                  {c.status !== "Resolved" && (
                    <div className="flex gap-1">
                      {c.status === "Open" && <Button size="sm" variant="secondary" onClick={() => setStatus(c.id, "In Review")}>Review</Button>}
                      <Button size="sm" onClick={() => setStatus(c.id, "Resolved")}>Resolve</Button>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="mt-3 text-base font-bold">{c.title}</h3>
              <p className="mt-1 text-sm text-text-muted">{c.description}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-text-muted">
                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {c.tenant}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {c.property}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {c.date}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Log Complaint" footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={save}>Submit</Button></>}>
        <div className="space-y-4">
          <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Mould in bathroom ceiling" /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category"><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((s) => <option key={s}>{s}</option>)}</Select></Field>
            <Field label="Urgency"><Select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value as Complaint["urgency"] })}>{["Low", "Medium", "High"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tenant"><Select value={form.tenant} onChange={(e) => setForm({ ...form, tenant: e.target.value })}><option value="">Select tenant</option>{tenants.map((t) => <option key={t.id}>{t.name}</option>)}</Select></Field>
            <Field label="Property"><Select value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })}><option value="">Select property</option>{properties.map((p) => <option key={p.id}>{p.name}</option>)}</Select></Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
