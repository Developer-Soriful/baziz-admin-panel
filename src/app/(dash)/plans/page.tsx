"use client";

import { useState } from "react";
import { Check, Plus, Pencil, Users, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/stat-card";
import { Card, Badge, Button, Toggle } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { plans as seed, planTone, type Plan } from "@/lib/data";
import { gbp } from "@/lib/utils";

export default function PlansPage() {
  const toast = useToast();
  const [list, setList] = useState<Plan[]>(() => seed.map((p) => ({ ...p, features: [...p.features] })));
  const [edit, setEdit] = useState<Plan | null>(null);
  const [form, setForm] = useState<{ price: string; tagline: string; features: string }>({ price: "", tagline: "", features: "" });

  const openEdit = (p: Plan) => { setEdit(p); setForm({ price: String(p.price), tagline: p.tagline, features: p.features.join("\n") }); };
  const save = () => {
    if (!edit) return;
    setList((l) => l.map((p) => p.id === edit.id ? { ...p, price: parseFloat(form.price) || 0, tagline: form.tagline, features: form.features.split("\n").filter(Boolean) } : p));
    toast("Plan updated"); setEdit(null);
  };
  const toggleActive = (id: string) => setList((l) => l.map((p) => p.id === id ? { ...p, active: !p.active } : p));

  return (
    <div className="animate-in">
      <PageHeader title="Plans" subtitle="Configure the subscription tiers offered on the platform" actions={<Button onClick={() => toast("Create-plan flow coming soon")}><Plus className="h-4 w-4" /> New Plan</Button>} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {list.map((p) => (
          <Card key={p.id} className={`relative p-6 ${p.popular ? "ring-2 ring-primary" : ""}`}>
            {p.popular && <span className="absolute -top-3 left-6 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white"><Star className="h-3 w-3" /> Most popular</span>}
            <div className="flex items-start justify-between">
              <div><h3 className="text-lg font-extrabold">{p.name}</h3><p className="text-xs text-text-muted">{p.tagline}</p></div>
              <Badge tone={planTone(p.name)}>{p.propertyLimit}</Badge>
            </div>
            <p className="mt-4"><span className="text-3xl font-extrabold">{p.price === 0 ? "Free" : gbp(p.price, { decimals: true })}</span>{p.price > 0 && <span className="text-text-muted">/{p.interval}</span>}</p>
            <ul className="mt-4 space-y-2">{p.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" />{f}</li>)}</ul>
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="flex items-center gap-1.5 text-sm text-text-muted"><Users className="h-4 w-4" /> {p.subscribers.toLocaleString()} subscribers</span>
              <div className="flex items-center gap-2"><span className="text-xs text-text-muted">{p.active ? "Live" : "Hidden"}</span><Toggle checked={p.active} onChange={() => toggleActive(p.id)} /></div>
            </div>
            <Button variant="secondary" className="mt-3 w-full" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /> Edit plan</Button>
          </Card>
        ))}
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={`Edit ${edit?.name} plan`} footer={<><Button variant="secondary" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={save}>Save Changes</Button></>}>
        <div className="space-y-4">
          <Field label="Monthly Price (£)"><Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="19.99" /></Field>
          <Field label="Tagline"><Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></Field>
          <Field label="Features (one per line)"><Textarea rows={5} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}
